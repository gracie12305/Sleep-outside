import { getLocalStorage } from './utils.mjs';


export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
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

        document.querySelector('.cart-subtotal').textContent =
            `$${subTotal.toFixed(2)}`;

        document.querySelector('.cart-tax').textContent =
            `$${this.orderTotals.tax.toFixed(2)}`;

        document.querySelector('.cart-shipping').textContent =
            `$${this.orderTotals.shipping.toFixed(2)}`;

        document.querySelector('.cart-total').textContent =
            `$${this.orderTotals.total.toFixed(2)}`;
    }
}




