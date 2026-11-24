import { setLocalStorage, getLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

async function init() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');

  const product = await dataSource.findProductById(productId);

  if (!product) {
    document.querySelector('.product-detail').innerHTML =
      '<h2>Product not found.</h2>';
    return;
  }

  document.querySelector('#product-brand').textContent = product.Brand.Name;
  document.querySelector('#product-name').textContent = product.Name;
  document.querySelector('#product-image').src = product.Image;
  document.querySelector('#product-image').alt = product.Name;
  document.querySelector('#product-price').textContent = `$${product.FinalPrice}`;
  document.querySelector('#product-color').textContent =
    product.Colors[0].ColorName;
  document.querySelector('#product-description').innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector('#addToCart').addEventListener('click', () => {
    addProductToCart(product);
  });
}

function addProductToCart(product) {
  let cartItems = getLocalStorage('so-cart');

  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  // Combine any duplicate products already in the cart.
  const uniqueItems = cartItems.reduce((items, item) => {
    const existingItem = items.find((cartItem) => cartItem.Id === item.Id);

    if (existingItem) {
      existingItem.Quantity += item.Quantity || 1;
    } else {
      items.push({ ...item, Quantity: item.Quantity || 1 });
    }

    return items;
  }, []);

  // Add one to the selected product's quantity.
  const existingProduct = uniqueItems.find(
    (item) => item.Id === product.Id
  );

  if (existingProduct) {
    existingProduct.Quantity += 1;
  } else {
    uniqueItems.push({ ...product, Quantity: 1 });
  }

  setLocalStorage('so-cart', uniqueItems);

  alert('Product added to cart!');

}

init(); // Re-initialize to update the cart count in the header
