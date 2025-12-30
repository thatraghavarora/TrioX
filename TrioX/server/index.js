import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { TelegramClient } from 'telegram'
import { Api } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

let telegramClient = null
let telegramReady = false

const DISCOVERY_LIMIT = Number(process.env.TG_DISCOVERY_LIMIT) || 6
const POSTS_PER_CHANNEL = Number(process.env.TG_CHANNEL_RESULTS) || 4
const STATIC_CHANNELS = (process.env.TG_CHANNELS || '')
  .split(',')
  .map((channel) => channel.trim())
  .filter(Boolean)
const TELEGRAM_DEBUG = process.env.TG_DEBUG === 'true'

const logDebug = (...args) => {
  if (TELEGRAM_DEBUG) {
    console.log('[Telegram]', ...args)
  }
}

const startTelegramClient = async () => {
  const apiId = Number(process.env.TG_API_ID)
  const apiHash = process.env.TG_API_HASH
  const session = process.env.TG_STRING_SESSION

  if (!apiId || !apiHash) {
    console.warn('TG_API_ID or TG_API_HASH missing. Telegram client will stay offline.')
    return
  }

  if (!session) {
    console.warn('TG_STRING_SESSION missing. Run `npm run session` to generate it.')
    return
  }

  telegramClient = new TelegramClient(new StringSession(session), apiId, apiHash, {
    connectionRetries: 5
  })

  try {
    logDebug('Connecting to Telegram...')
    await telegramClient.connect()

    const authed = await telegramClient.checkAuthorization()
    if (!authed) {
      console.warn('Telegram session invalid. Generate a new TG_STRING_SESSION.')
      return
    }

    telegramReady = true
    console.log('Telegram client connected and ready.')
  } catch (error) {
    console.error('Failed to connect to Telegram:', error)
  }
}

startTelegramClient()

const resolveChatName = (chat) => {
  if (!chat) return 'Unknown Source'
  if ('title' in chat && chat.title) return chat.title
  const first = chat.firstName || ''
  const last = chat.lastName || ''
  return `${first} ${last}`.trim() || 'Direct Message'
}

const buildPermalink = (chat, messageId) => {
  if (!chat?.username) return null
  return `https://t.me/${chat.username}/${messageId}`
}

const resolveStaticChannels = async () => {
  if (STATIC_CHANNELS.length === 0) {
    return []
  }

  const peers = []
  for (const channel of STATIC_CHANNELS) {
    try {
      const peer = await telegramClient.getInputEntity(channel)
      peers.push(peer)
    } catch (error) {
      logDebug(`Static channel resolution failed for ${channel}`, error.message)
    }
  }
  logDebug('Resolved static channels', peers.length)
  return peers
}

const discoverPublicChannels = async (keyword) => {
  const staticPeers = await resolveStaticChannels()

  const response = await telegramClient.invoke(
    new Api.contacts.Search({
      q: keyword,
      limit: DISCOVERY_LIMIT * 5
    })
  )

  const chats = response.chats || []
  const dynamicPeers = chats
    .map((chat) => {
      if (chat instanceof Api.Channel && chat.accessHash) {
        return new Api.InputPeerChannel({
          channelId: chat.id,
          accessHash: chat.accessHash
        })
      }
      if (chat instanceof Api.Chat) {
        return new Api.InputPeerChat({
          chatId: chat.id
        })
      }
      return null
    })
    .filter(Boolean)

  const combined = [...staticPeers, ...dynamicPeers]
  logDebug('Discovered peers for keyword', keyword, combined.length)
  return combined.slice(0, DISCOVERY_LIMIT)
}

const fetchPostsForChannel = async (peer, keyword) => {
  const entity = await telegramClient.getEntity(peer).catch((error) => {
    logDebug('Failed to hydrate entity for peer', JSON.stringify(peer), error.message)
    throw error
  })

  const response = await telegramClient.invoke(
    new Api.messages.Search({
      peer,
      q: keyword,
      filter: new Api.InputMessagesFilterEmpty(),
      minDate: 0,
      maxDate: 0,
      limit: POSTS_PER_CHANNEL,
      offsetId: 0,
      addOffset: 0,
      hash: 0
    })
  )

  return (response.messages || [])
    .filter((message) => message instanceof Api.Message && Boolean(message.message))
    .map((message) => ({
      id: `${entity.id}-${message.id}`,
      channel: resolveChatName(entity),
      channelHandle: entity.username ? `@${entity.username}` : null,
      channelId: entity.id,
      messageId: message.id,
      message: message.message,
      postedAt: message.date?.toISOString?.() ?? null,
      views: message.views ?? 0,
      forwards: message.forwards ?? 0,
      permalink: buildPermalink(entity, message.id)
    }))
}

const fetchGlobalPosts = async (keyword) => {
  const peers = await discoverPublicChannels(keyword)
  const aggregated = []

  for (const peer of peers) {
    try {
      const posts = await fetchPostsForChannel(peer, keyword)
      aggregated.push(...posts)
      logDebug('Fetched posts from peer', peer.channelId || peer.chatId || peer.userId, posts.length)
    } catch (error) {
      console.warn('Failed to fetch posts for channel', error.message)
    }
  }

  return aggregated.sort((a, b) => {
    const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0
    const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0
    return timeB - timeA
  })
}

app.get('/api/telegram/search', async (req, res) => {
  const keyword = (req.query.keyword || '').toString().trim()
  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword parameter.' })
  }

  if (!telegramReady || !telegramClient) {
    return res.status(503).json({
      error: 'Telegram collector offline. Validate TG_API_ID, TG_API_HASH, TG_STRING_SESSION.'
    })
  }

  try {
    const results = await fetchGlobalPosts(keyword)
    res.json({
      keyword,
      posts: results
    })
  } catch (error) {
    console.error('Telegram search failed:', error)
    res.status(500).json({
      error: 'Telegram search failed',
      details: error.message,
      hint: TELEGRAM_DEBUG
        ? 'Check server logs for [Telegram] entries to diagnose missing accessHash or permissions.'
        : undefined
    })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    telegramReady
  })
})

app.listen(PORT, () => {
  console.log(`Telemetry backend listening on port ${PORT}`)
})
