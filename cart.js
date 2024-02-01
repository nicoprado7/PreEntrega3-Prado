class Cart {
    constructor(list = []) {
        this.cart = list;
        console.log('Inicio del programa');
    }

    addToCart({ id, name, img, price }) {
        const index = this.cart.findIndex(product => product.id == id);
        if (index == -1) {
            this.cart.push({ id, name, price, units: 1 });
        } else {
            this.cart[index].units += 1;
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    removeProduct(id) {
        const index = this.cart.findIndex(product => product.id == id);
        if (index !== -1) {
            this.cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }
    }

    getProducts() {
        return this.cart;
    }

    getCount() {
        return this.cart.reduce((count, product) => count + product.units, 0);
    }

    getSum() {
        return this.cart.reduce((sum, product) => sum + (product.units * product.price), 0);
    }
}
