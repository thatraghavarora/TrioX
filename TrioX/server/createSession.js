import dotenv from 'dotenv'
import input from 'input'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'

dotenv.config()

const apiId = Number(process.env.TG_API_ID)
const apiHash = process.env.TG_API_HASH

if (!apiId || !apiHash) {
  console.error('Set TG_API_ID and TG_API_HASH in your .env before generating a session.')
  process.exit(1)
}

const client = new TelegramClient(new StringSession(''), apiId, apiHash, {
  connectionRetries: 5
})

const run = async () => {
  await client.start({
    phoneNumber: async () => await input.text('Enter the phone number linked to Telegram: '),
    password: async () => await input.text('Enter 2FA password (leave blank if none): '),
    phoneCode: async () => await input.text('Enter the code you received: '),
    onError: (error) => console.error(error)
  })

  console.log('Use the string session below as TG_STRING_SESSION in your .env file:\n')
  console.log(client.session.save())
  process.exit(0)
}

run()
