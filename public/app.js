// Liste de photos - modifie/ajoute tes propres images dans public/images et ici
const PHOTOS = [
  { id: 'img1', title: 'Coucher de soleil', price: '15.00', file: 'images/sunset.jpg' },
  { id: 'img2', title: 'Ville la nuit', price: '12.00', file: 'images/city.jpg' },
  { id: 'img3', title: 'Montagne', price: '18.00', file: 'images/mountain.jpg' }
];

const gallery = document.getElementById('gallery');
const template = document.getElementById('card-template');

function render() {
  PHOTOS.forEach(p => {
    const node = template.content.cloneNode(true);
    node.querySelector('.photo').src = p.file;
    node.querySelector('.photo').alt = p.title;
    node.querySelector('.title').textContent = p.title;
    node.querySelector('.price').textContent = `${p.price} €`;
    node.querySelector('.view').addEventListener('click', () => window.open(p.file, '_blank'));
    node.querySelector('.buy').addEventListener('click', () => buy(p));
    gallery.appendChild(node);
  });
}

async function buy(photo) {
  try {
    const res = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: photo.id, title: photo.title, price: photo.price, image: photo.file })
    });
    const data = await res.json();
    if (data.url) {
      window.location = data.url; // redirige vers Stripe Checkout
    } else {
      alert('Impossible de créer la session de paiement.');
      console.error(data);
    }
  } catch (err) {
    console.error(err);
    alert('Erreur réseau');
  }
}

render();