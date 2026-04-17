const cardProducto = document.querySelectorAll('.cardProducto');
const cantidadValor = document.querySelectorAll('.cantidadValor');
const subtotalValor = document.getElementById('subtotal');
const ivaValor = document.getElementById('iva');
const totalValor = document.getElementById('total');
const contenedorProductos = document.getElementById('contenedorProductos');
const btnComprar = document.getElementById('btn-comprar');
const btnVolver = document.getElementById('btn-volver');
const contenedorProudctos = document.getElementById('contenedorProductos');
const summaryItems = document.getElementById('summaryItems');

//local storage temporal para probar funciones de calculo de totales y mostrar productos dinamicos
localStorage.setItem('carrito', JSON.stringify([
    { id: 1, title: 'Producto 1', price: 100, cantidad: 10 , image: 'https://placehold.co/600x400'},
    { id: 2, title: 'Producto 2', price: 50, cantidad: 5 , image: 'https://placehold.co/600x400'},
    { id: 3, title: 'Producto 3', price: 150, cantidad: 1 , image: 'https://placehold.co/600x400'}
]));



//funciones para calcular los totales
function calcularTotales() {
    let subtotal = 0;
    getCarrito().forEach(producto => {
        //sumamos el precio por la cantidad de cada producto al subtotal
        subtotal += producto.price * producto.cantidad;
    });

    //calculamos el iva y total
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    //actualizamos los valores
    subtotalValor.textContent = `$ ${subtotal.toLocaleString()}`;
    ivaValor.textContent = `$ ${iva.toLocaleString()}`;
    totalValor.textContent = `$ ${total.toLocaleString()}`;
}


//mostrar los productos del local storage en el checkout
function getCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

function mostrarCarrito() {
    const carrito = getCarrito();
    //vacias el contenedor antes de cargar los productos
    contenedorProductos.innerHTML = '';
    summaryItems.innerHTML = '';

    carrito.forEach(producto => {

        //imprime cada producto como card en el contenedor de productos
        const productoHTML = `<article class="cardCompras cardProducto" data-id="${producto.id}">

                <div class="cardComprasTitulo">
                    <img class="cardImg" src="${producto.image}" alt="">
                    <h4 class="cardTitulo">${producto.title}</h4>
                </div>

                <div class="cardFooter">
                    <div>
                        <span class="btn-eliminar"><i class="fa-solid fa-trash"></i>Eliminar</span>
                        <div class="cantidad">
                            <button class="cantidad-btn btn-resta">−</button>
                            <span class="cantidadValor">${producto.cantidad}</span>
                            <button class="cantidad-btn btn-suma">+</button>
                        </div>
                        <span class="precio">$${producto.price}</span>
                        
                    </div>
                    
                </div>

            </article>`;

            contenedorProductos.innerHTML += productoHTML;

            //agregar el producto al resumen de compra
                const summaryItemHTML = `
                <div class="item">
                    <span><strong>${producto.cantidad}x</strong> ${producto.title}</span>
                    <span>$ ${ (producto.price * producto.cantidad)}</span>
                </div>`;

                summaryItems.innerHTML += summaryItemHTML;
        });



    }

    


//funcion para manejar el evento de suma y resta de articulos y boton eliminar
contenedorProductos.addEventListener('click', (e) => {

    //click eliminar producto
    if (e.target.closest('.btn-eliminar')) {

        const card = e.target.closest('.cardProducto');
        const id = card.dataset.id;

        let carrito = getCarrito();

        carrito = carrito.filter(producto => producto.id != id);

        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        calcularTotales();
    }

    // click boton mas
    if (e.target.closest('.btn-suma')) {

        const card = e.target.closest('.cardProducto');
        const id = card.dataset.id;

        const carrito = getCarrito();

        carrito.forEach(producto => {
            if (producto.id == id) {
                producto.cantidad++;
            }
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        calcularTotales();
    }


    // click boton menos
    if (e.target.closest('.btn-resta')) {

        const card = e.target.closest('.cardProducto');
        const id = card.dataset.id;

        const carrito = getCarrito();

        carrito.forEach(producto => {
            if (producto.id == id && producto.cantidad > 1) {
                producto.cantidad--;
            }
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        calcularTotales();
    }

});

function validarCamposEnvio() {
    const nombre = document.getElementById('inputNombre4').value.trim();
    const apellido = document.getElementById('inputApellido4').value.trim();
    const direccion = document.getElementById('inputDirreccion').value.trim();
    const ciudad = document.getElementById('inputCity').value.trim();
    const provincia = document.getElementById('inputState').value;

    if (!nombre || !apellido || !direccion || !ciudad || !provincia) {
        return false;
    }
    return true;
}

btnComprar.addEventListener('click', () => {
    //comprobar si los campos de envio estan completos
    if (!validarCamposEnvio()) {
        alert('Completa todos los campos de envío antes de finalizar la compra');
        return;
    }
    alert('¡Gracias por tu compra!');

    localStorage.removeItem('carrito');
    mostrarCarrito();
    calcularTotales();

});

btnVolver.addEventListener('click', () => {
    window.location.href = '../index.html';
});

//iniciar la pagina con los productos del carrito y los totales calculados
mostrarCarrito();
calcularTotales();