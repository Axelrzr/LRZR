require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 4242;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour créer une session Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { id, title, price, image } = req.body;
    // price en euros (ex: 15.00) - on convertira en cents
    const unit_amount = Math.round(Number(price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: title,
              images: image ? [`${DOMAIN}/${image}`] : [],
            },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création session' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
