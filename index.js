const modal = new bootstrap.Modal('#modalCarri', {});
const btnModalCarrito = document.querySelector('#btnModalCarrito');
const cartCount = document.querySelector('#cartCount');
const cartSum = document.querySelector('#cartSum');
const inputSearch = document.querySelector('#inputSearch');
const listProducts = document.querySelector('#listProducts');
const selectCategory = document.querySelector('#selectCategory');
const modalListProducts = document.querySelector('#modalListProducts');
const btnClose = document.querySelector('#btnClose');
const btnSave = document.querySelector('#btnSave');
const btnOrder = document.querySelector('#btnOrder');

const listCart = JSON.parse(localStorage.getItem('cart')) || [];
const cart = new Cart(listCart);

cartCount.innerText = cart.getCount();

btnModalCarrito.addEventListener('click', function () {
    const list = cart.getProducts();
    cartSum.innerText = cart.getSum();

    redenCart(list);

    modal.show();
});

btnClose.addEventListener('click', () => {
    modal.hide();
});
btnSave.addEventListener('click', () => {
    modal.hide();
});



inputSearch.addEventListener('input', (event) => {
    const search = event.target.value;
    const newList = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
    renderProducts(newList);
});

btnOrder.addEventListener('click', () => {
    products.sort((a, b) => a.price - b.price);
    renderProducts(products);
    btnOrder.setAttribute('disabled', true);
    modal.hide(); // Cierra el modal al hacer clic en "Comprar"
});

const renderProducts = (list, categoryFilter = null) => {
    listProducts.innerHTML = '';
    list.forEach(product => {
        if (categoryFilter && product.category !== categoryFilter) {
            return;
        }
        listProducts.innerHTML += // html
            `<div class="col-sm-4 col-md-3">
                <div class="card p-2">
                    <h4>${product.name}</h4>
                    <img class="img-fluid" src="${product.img}" alt="${product.name}">
                    <h3 class="text-center">$${product.price}</h3>
                    <button id="${product.id}" type="button" class="btn btn-danger btnAddCart">
                        <i class="fa-solid fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>`;
    });

    const btns = document.querySelectorAll('.btnAddCart');
    btns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
};

selectCategory.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "todos") {
        renderProducts(products);
    } else {
        renderProducts(products, selectedCategory);
    }
});

const addToCart = (e) => {
    const id = e.target.id;
    const product = products.find(item => item.id == id);
    cart.addToCart(product);
    cartCount.innerText = cart.getCount();
};

const redenCart = (list) => {
    modalListProducts.innerHTML = '';
    list.forEach(product => {
        modalListProducts.innerHTML += // html
            `<tr>
                <td>${product.name}</td>
                <td>${product.units}</td>
                <td>$${product.price}</td>
                <td>$${product.price * product.units}</td>
                <td><button class="btn btn-dark btnRemoveItem" data-id="${product.id}">Eliminar</button></td>
            </tr>`;
    });

    const btnsRemove = document.querySelectorAll('.btnRemoveItem');
    btnsRemove.forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
};

const removeFromCart = (e) => {
    const id = e.target.dataset.id;
    cart.removeProduct(id);
    const updatedList = cart.getProducts();
    redenCart(updatedList);
    cartCount.innerText = cart.getCount();
    cartSum.innerText = cart.getSum();
};

renderProducts(products);