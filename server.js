require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// 🔧 Configuration de base
const PORT = process.env.PORT || 4242;
const DOMAIN = process.env.DOMAIN || 'http://localhost:4242';

// ⚠️ Vérifie que la clé Stripe est bien chargée
if (!process.env.STRIPE_SECRET_KEY) {
console.error("❌ Erreur : aucune clé Stripe trouvée. Ajoute STRIPE_SECRET_KEY dans ton fichier .env");
process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Endpoint pour créer une session Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
try {
const { title, price, image } = req.body;

// Vérifie les champs reçus
if (!title || !price) {
  return res.status(400).json({ error: 'Paramètres manquants' });
}

// Conversion du prix en centimes
const unit_amount = Math.round(Number(price) * 100);

// Création de la session Stripe
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

// Envoi de l’URL de redirection Stripe au frontend
res.json({ url: session.url });


} catch (err) {
console.error("❌ Erreur Stripe :", err.message);
res.status(500).json({ error: 'Erreur création session Stripe' });
}
});

// 🚀 Lancement du serveur
app.listen(PORT, () => console.log('✅ Serveur lancé sur le port ${PORT}'));