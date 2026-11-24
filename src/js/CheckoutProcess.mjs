import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.externalServices = new ExternalServices();
    }

    init() {
        const cartItems = getLocalStorage(this.key) || [];

        this.itemCount = cartItems.reduce(
            (sum, item) => sum + (item.Quantity || 1),
            0
        );

        const subTotal = this.calculateItemSubTotal(cartItems);
        this.orderTotals = this.calculateOrderTotal(subTotal);

        this.displayOrderTotals();
    }

    calculateItemSubTotal(cartItems) {
        return cartItems.reduce(
            (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
            0
        );
    }

    calculateOrderTotal(subTotal) {
        const tax = subTotal * 0.06;
        const shipping = this.itemCount > 0
            ? 10 + (this.itemCount - 1) * 2
            : 0;
        const total = subTotal + tax + shipping;

        return { tax, shipping, total };
    }

    displayOrderTotals() {
        const cartItems = getLocalStorage(this.key) || [];
        const subTotal = this.calculateItemSubTotal(cartItems);

        const subtotalElement = document.querySelector('.cart-subtotal');
        const taxElement = document.querySelector('.cart-tax');
        const shippingElement = document.querySelector('.cart-shipping');
        const totalElement = document.querySelector('.cart-total');

        if (subtotalElement) {
            subtotalElement.textContent = `$${subTotal.toFixed(2)}`;
        }

        if (taxElement) {
            taxElement.textContent = `$${this.orderTotals.tax.toFixed(2)}`;
        }

        if (shippingElement) {
            shippingElement.textContent = `$${this.orderTotals.shipping.toFixed(2)}`;
        }

        if (totalElement) {
            totalElement.textContent = `$${this.orderTotals.total.toFixed(2)}`;
        }
    }
    
    packageItems(items) {
        return items.map((item) => ({
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.Quantity || 1,
        }));
    }

    async checkout(form) {
        const formData = new FormData(form);
        const cartItems = getLocalStorage(this.key) || [];

        const order = {
            orderDate: new Date(),
            fname: formData.get('fname'),
            lname: formData.get('lname'),
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            cardNumber: formData.get('cardNumber'),
            expiration: formData.get('expiration'),
            code: formData.get('code'),
            items: this.packageItems(cartItems),
            orderTotal: this.orderTotals.total,
            shipping: this.orderTotals.shipping,
            tax: this.orderTotals.tax,
        };

        return this.externalServices.checkout(order);
    }
}




