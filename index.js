const modal = new bootstrap.Modal('#modalCarrito', {});
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

const listCart = JSON.parse( localStorage.getItem('cart') ) || [];
const cart = new cart(listCart);

cartCount.innerText = cart.getCount();


btnModalCarrito.addEventListener('click', function(){
    const list = cart.getProducts();
    cartSum.innerText = cart.getSum();

    redenCart( list );

    modal.show();
})

btnClose.addEventListener('click', ()=> {
    modal.hide();
})

inputSearch.addEventListener('input', (event) => {
    const search = event.target.value;
    const newList = products.filter(  (product) => product.name.toLowerCase().includes( search.toLowerCase() )  );
    renderProducts(newList);
})

btnOrder.addEventListener('click', ()=> {
    products.sort(  (a, b ) => {
        if(  a.price < b.price  ){
            return -1
        }
        if ( a.price > b.price){
            return 1
        }

        return 0
    } )

    renderProducts(products)
    btnOrder.setAttribute('disabled', true)
})


 /* -------- RECIBE LA LISTA DE PRODUCTOS, LA RECORRE Y LOS RENDERIZA -------- */
 const renderProducts = (list, categoryFilter = null) => {
    listProducts.innerHTML = '';
    list.forEach(product => {
        // Si hay un filtro de categoría y el producto no pertenece a esa categoría, salta a la próxima iteración
        if (categoryFilter && product.category !== categoryFilter) {
            return;
        }
        listProducts.innerHTML += // html
            `<div class="col-sm-4 col-md-3">
                <div class="card p-2">
                    <h4>${product.name} </h4>
                    <img class="img-fluid" src="${product.img}" alt="${product.name}">
                    <h3 class="text-center">$${product.price} </h3>
                    <button id="${product.id}" type="button" class="btn btn-primary btnAddCart">
                        <i class="fa-solid fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>`;
    });

/* ------------ SE AGREGA EL ESCUCHADOR DE EVENTOS A LOS BOTONES ------------ */
const btns = document.querySelectorAll('.btnAddCart');
btns.forEach(btn => {
    btn.addEventListener('click', addToCart);
});
}


/* ------------ AGREGA UN EVENT LISTENER AL SELECT DE CATEGORIAS ------------ */
selectCategory.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    // Si se selecciona "Todos", muestra todos los productos sin filtrar
    if (selectedCategory === "todos") {
        renderProducts(products);
    } else {
        // Filtra los productos según la categoría seleccionada y vuelve a renderizarlos
        renderProducts(products, selectedCategory);
    }
});

const addToCart = ( e )=> {
    const id = e.target.id;
    const product = products.find( item => item.id == id );
    console.table(product);
    cart.addToCart( product);
    cartCount.innerText = cart.getCount();
}

const redenCart = (list) => {
    modalListProducts.innerHTML = '';
    list.forEach( product => {
        modalListProducts.innerHTML += // html
            `<tr>
                <td> ${product.name} </td>
                <td> ${product.units}</td>
                <td>$${product.price}</td>
                <td>$${product.price * product.units}</td>

            </tr>`
    });
}
renderProducts( products);