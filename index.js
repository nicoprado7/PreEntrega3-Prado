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


    /* ------- VERIFICA SI EL CARRITO ESTA VACIO ANTES DE MOSTRAR EL MODAL ------ */
    if (list.length === 0) {
        // Mostrar un mensaje de error
        Swal.fire({
            title: 'Error',
            text: 'El carrito está vacío. Por favor, agregue productos antes de realizar una compra.',
            icon: 'error',
            confirmButtonColor: "#198754"
        });
    } else {
        cartSum.innerText = cart.getSum();
        redenCart(list);
        modal.show();
    }
});


btnClose.addEventListener('click', () => {
    modal.hide();// Cierra el modal al hacer clic en "cerrar"
});
btnSave.addEventListener('click', () => {
    modal.hide();// Cierra el modal al hacer clic en "Comprar"

    /* SWEET ALERT COMPRA REALIZADA */
    Swal.fire({
        title: "¡Gracias por su compra!",
        text: "Su compra ha sido realizada exitosamente.",
        icon: "success",
        confirmButtonColor: "#198754"
    }).then((result) => {
        // Verifica si el usuario hizo clic en el botón de confirmación
        if (result.isConfirmed) {
            // Limpia el carrito
            cart.clearCart();
            
            // Actualiza el contador del carrito a 0
            cartCount.innerText = 0;
        }
    });
});


inputSearch.addEventListener('input', (event) => {
    const search = event.target.value;
    const newList = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
    renderProducts(newList);
});


/* --------------- FILTRO ORDENAR DE MENOR A MAYOR Y VICEVERSA -------------- */
let ascendingOrder = true; // Variable de estado para seguir el orden actual

btnOrder.addEventListener('click', () => {
    if (ascendingOrder) {
        products.sort((a, b) => a.price - b.price); // Ordenar de menor a mayor
    } else {
        products.sort((a, b) => b.price - a.price); // Ordenar de mayor a menor
    }
    ascendingOrder = !ascendingOrder; // Cambiar el estado del orden
    renderProducts(products);
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
                    <i class="fa-solid fa-cart-shopping"></i> Agregar
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
    Toastify({
        close: true,
        text: "Producto agregado al carrito",
        gravity: "bottom",
        duration: 3000,
        style: {
            background: "linear-gradient(to right,red, black)",
          },
        
        }).showToast();
};

const redenCart = (list) => {
    modalListProducts.innerHTML = '';
    list.forEach(product => {
        modalListProducts.innerHTML += // html
            `<tr>
                <td>${product.name}</td>
                <td class="center-text">${product.units}</td>
                <td>$${product.price}</td>
                <td>$${product.price * product.units}</td>
                <td><button class="btn btn-dark btnRemoveItem" data-id="${product.id}"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>`;
    });

    const btnsRemove = document.querySelectorAll('.btnRemoveItem');
    btnsRemove.forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
};






const removeFromCart = (e) => {
    const id = e.target.dataset.id;

    // Mostrar el diálogo de confirmación
    Swal.fire({
        title: 'Está seguro de eliminar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        confirmButtonColor: "#198754",
        cancelButtonText: 'No, no quiero'
    }).then((result) => {
        // Si el usuario hace clic en "Sí, seguro"
        if (result.isConfirmed) {
            // Eliminar el producto del carrito
            cart.removeProduct(id);
            const updatedList = cart.getProducts();
            redenCart(updatedList);
            cartCount.innerText = cart.getCount();
            cartSum.innerText = cart.getSum();

            // Mostrar un mensaje de éxito
            Swal.fire({
                title: 'Borrado!',
                icon: 'success',
                text: 'El producto ha sido borrado',
                confirmButtonColor: "#198754"
            });
        } else {
            // Si el usuario hace clic en "No, no quiero", no hacer nada
            Swal.fire({
                title: 'Cancelado',
                icon: 'info',
                text: 'La eliminación del producto ha sido cancelada',
                confirmButtonColor: "#198754"
            });
        }
    });
};


renderProducts(products);


/* ----------------------------- LUXON ---------------------------- */
const f = new Date();

const DateTime = luxon.DateTime;
const fecha = DateTime.now();
console.log( 'Zona: ', fecha.zoneName );
console.log( 'Fecha: ', fecha.toLocaleString( DateTime.DATE_FULL ));
