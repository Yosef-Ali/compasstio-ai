import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``

async function validateRequest(request: Request) {
  const payloadString = await request.text()
  const headerPayload = headers()

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  }
  const wh = new Webhook(webhookSecret)
  return wh.verify(payloadString, svixHeaders) as WebhookEvent
}

export async function POST(request: Request) {
  const payload = await validateRequest(request)
  console.log("payload", payload)
  return Response.json({ message: 'Received' })
}