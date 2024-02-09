const productos = [];

fetch("./productos.json")
    .then(response => response.json())
    .then(data => {
        products = data;
        renderProducts(products);
    })

const loadingIndicator = document.getElementById('loadingIndicator');
const modal = new bootstrap.Modal('#modalCarri', {});
const btnModalCarrito = document.querySelector('#btnModalCarrito');
const cartCount = document.querySelector('#cartCount');
const cartSum = document.querySelector('#cartSum');
const inputSearch = document.querySelector('#inputSearch');
const listProductsElement = document.querySelector('#listProducts');
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
        title: 'Carrito Vacio 😥',
        text: 'Por favor, agregue productos antes de realizar una compra.',
        icon: 'info',
        confirmButtonColor: "#198754"
    });
} else {
    // Mostrar indicador de carga
    loadingIndicator.style.display = 'block';

    // Simular una operación asincrónica, por ejemplo, esperar 2 segundos
    setTimeout(() => {
        // Ocultar el indicador de carga después de que las operaciones asincrónicas hayan finalizado
        loadingIndicator.style.display = 'none';

        cartSum.innerText = cart.getSum();
        redenCart(list);
        modal.show();
    }, 1000);  // Modifica el tiempo según sea necesario o reemplázalo con tus operaciones asincrónicas reales.
}
});


btnClose.addEventListener('click', () => {
    modal.hide();// Cierra el modal al hacer clic en "cerrar"
});
btnSave.addEventListener('click', () => {
    // Valida los datos ingresados en el formulario
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const direccion = document.querySelector('#direccion').value;

    // Expresión regular para validar que el nombre solo contiene letras
    const nombreRegex = /^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/;

    // Expresión regular para validar el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Expresión regular para validar que el teléfono solo contiene números
    const telefonoRegex = /^\d+$/;

    if (nombre.trim() === '' || email.trim() === '' || telefono.trim() === '' || direccion.trim() === '') {
        // Muestra un mensaje de error si hay campos vacíos
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    } else if (!nombre.match(nombreRegex)) {
        // Muestra un mensaje de error si el nombre no contiene solo letras
        Swal.fire({
            title: 'Error',
            text: 'El nombre solo puede contener letras',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    } else if (!email.match(emailRegex)) {
        // Muestra un mensaje de error si el email no tiene el formato correcto
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un correo electrónico válido',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    } else if (!telefono.match(telefonoRegex)) {
        // Muestra un mensaje de error si el teléfono no contiene solo números
        Swal.fire({
            title: 'Error',
            text: 'El teléfono solo puede contener números',
            icon: 'error',
            confirmButtonColor: '#198754'
        });
    } else {
        // Realiza la compra
        realizarCompra(nombre, email);
        // Limpiar campos después de la compra
        document.querySelector('#nombre').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#telefono').value = '';
        document.querySelector('#direccion').value = '';
        modal.hide();// Cierra el modal al hacer clic en "Comprar"
    }
});

// Función para realizar la compra
const realizarCompra = (nombre, email,telefono,direccion) => {
    // Simula el proceso de compra
    // Aquí podrías enviar los datos del usuario y los productos comprados a un servidor para procesar la compra
    
    // Muestra un mensaje de compra realizada exitosamente
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
};



 

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

/* --------------------------- CARDS DE PRODUCTOS --------------------------- */
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

/* ------------------------ BOTON AGREGAR AL CARRITO ------------------------ */
    const btns = document.querySelectorAll('.btnAddCart');
    btns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
};

/* -------------------------- FILTRAR POR CATEGORIA ------------------------- */
selectCategory.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === "todos") {
        renderProducts(products);
    } else {
        renderProducts(products, selectedCategory);
    }
});

/* ---------------------- TOASTIFY DE PRODUCTO AGREGADO --------------------- */
const addToCart = (e) => {
    const id = e.target.id;
    const product = products.find(item => item.id == id);
    cart.addToCart(product);
    cartCount.innerText = cart.getCount();
    Toastify({
        close: true,
        text: "Producto agregado al carrito",
        gravity: "bottom",
/*         duration: 3000, */
        style: {
            background: "linear-gradient(to right,green, black)",
          },
        
        }).showToast();
};


/* ---------------------- AGREGAR O DISMINUIR PRODUCTOS --------------------- */
const redenCart = (list) => {
    modalListProducts.innerHTML = '';
    list.forEach(product => {
        modalListProducts.innerHTML += // html
            `<tr>
                <td>${product.name}</td>
                <td>
                    <div class="input-group">
                        <button class="btn btn-dark btnRemoveItem" data-id="${product.id}"><i class="fa-solid fa-minus"></i></button>
                        <input type="number" min="1" value="${product.units}" class="form-control inputUnits" disabled>
                        <button class="btn btn-dark btnAddItem" data-id="${product.id}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
                <td>$${product.price}</td>
                <td>$${product.price * product.units}</td>
                <td><button class="btn btn-dark btnRemoveItem" data-id="${product.id}"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>`;
            
    });

    
    const btnsRemove = document.querySelectorAll('.btnRemoveItem');
    btnsRemove.forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
    
    const btnsAdd = document.querySelectorAll('.btnAddItem');
    btnsAdd.forEach(btn => {
        btn.addEventListener('click', addItemToCart);
    });
};

    const addItemToCart = (e) => {
        const id = e.target.dataset.id;
        const product = products.find(item => item.id == id);
        cart.addToCart(product);
        const updatedList = cart.getProducts();
        redenCart(updatedList);
        cartCount.innerText = cart.getCount();
        cartSum.innerText = cart.getSum();

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


/* renderProducts(products);
 */

/* ----------------------------- LUXON ---------------------------- */
const f = new Date();

const DateTime = luxon.DateTime;
const fecha = DateTime.now();
console.log( 'Zona: ', fecha.zoneName );
console.log( 'Fecha: ', fecha.toLocaleString( DateTime.DATE_FULL ));
