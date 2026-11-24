
import CheckoutProcess from './CheckoutProcess.mjs';

const checkout = new CheckoutProcess('so-cart', '.checkout-summary');

checkout.init();

const form = document.querySelector('#checkout-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const expiration = form.elements.expiration.value.trim();
    const expirationMatch = expiration.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

    if (!expirationMatch) {
        alert('Incorrect expiration date. Please use MM/YY, for example 08/27.');
        return;
    }

    const month = Number(expirationMatch[1]);
    const year = 2000 + Number(expirationMatch[2]);

    const expirationDate = new Date(year, month, 1);
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);

    if (expirationDate <= today) {
        alert('Your card has expired. Please enter a valid expiration date.');
        return;
    }

    const button = document.querySelector('#checkout-button');
    button.disabled = true;
    button.textContent = 'Processing...';

    try {
        const response = await checkout.checkout(form);

        alert('Order submitted successfully! Thank you for shopping with us.');

        console.log('Order submitted successfully:', response);

    } catch (error) {
        if (error.name === 'servicesError') {
            console.error('Backend error details:', error.message);
            alert('We could not process your order. Please check your details and try again.');
        } else {
            console.error('Checkout failed:', error);
            alert('Something went wrong. Please try again.');
        }
    } finally {
        button.disabled = false;
        button.textContent = 'Place Order';
    }
});
