import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      const { paymentMethodId } = req.body;

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // Amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
      });

      // Handle successful payment
      res.status(200).json({ message: 'Payment successful' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Payment failed' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}