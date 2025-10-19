# Site de photos - Boilerplate

## Prérequis
- Node.js (18+ recommandé)
- Un compte Stripe (pour récupérer tes clés API)

## Installation
1. Place le projet dans un dossier, par ex. `photo-shop`.
2. Crée un fichier `.env` à la racine et ajoute :

```
STRIPE_SECRET_KEY=sk_test_...   # ta clé secrète Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...  # ta clé publique
DOMAIN=http://localhost:4242
```

3. Installe les dépendances :
```
npm install
```
4. Lance le serveur :
```
npm start
```
5. Ouvre `http://localhost:4242` dans ton navigateur.

## Notes
- Ajoute tes images dans `public/images/` et modifie `public/app.js` pour les lister avec leur prix.
- Pour une version de production, configure HTTPS et utilise des webhooks Stripe pour délivrer automatiquement les fichiers numériques après paiement.
