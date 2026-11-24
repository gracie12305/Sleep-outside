import { getLocalStorage, setLocalStorage } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      removeItem(event.target.dataset.id);
    });
  });
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="remove-item" data-id="${item.Id}">Remove</button>
</li>`;

  return newItem;
}

function removeItem(id) {
  let cartItems = getLocalStorage('so-cart') || [];

  cartItems = cartItems.filter((item) => item.Id !== id);

  setLocalStorage('so-cart', cartItems);

  renderCartContents();
}

renderCartContents();

const checkout = new CheckoutProcess('so-cart', '.cart-footer');
checkout.init();
