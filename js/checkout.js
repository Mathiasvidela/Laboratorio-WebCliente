//imporacion de funciones JS carrito
import { obtenerCarrito } from './carrito.js';
import { eliminarItem } from './carrito.js';
import { vaciarCarrito } from './carrito.js';
import { guardarItem } from './carrito.js';

const cardProducto = document.querySelectorAll('.cardProducto');
const cantidadValor = document.querySelectorAll('.cantidadValor');
const subtotalValor = document.getElementById('subtotal');
const ivaValor = document.getElementById('iva');
const totalValor = document.getElementById('total');
const contenedorProductos = document.getElementById('contenedorProductos');
const btnComprar = document.getElementById('btn-comprar');
const btnVaciar = document.getElementById('btn-vaciar');
const summaryItems = document.getElementById('summaryItems');


//funciones para calcular los totales
function calcularTotales() {
    let subtotal = 0;
    obtenerCarrito().forEach(producto => {
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

function mostrarCarrito() {
    const carrito = obtenerCarrito();
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
                    <div class="itemsCard">
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

        let carrito = obtenerCarrito();

        eliminarItem(id);
        mostrarCarrito();
        calcularTotales();
    }

    // click boton mas
    if (e.target.closest('.btn-suma')) {

        const card = e.target.closest('.cardProducto');
        const id = card.dataset.id;

        const carrito = obtenerCarrito();

        carrito.forEach(producto => {
            if (producto.id == id) {
                producto.cantidad++;
            }
        });

        guardarItem(carrito);
        mostrarCarrito();
        calcularTotales();
    }


    // click boton menos
    if (e.target.closest('.btn-resta')) {

        const card = e.target.closest('.cardProducto');
        const id = card.dataset.id;

        const carrito = obtenerCarrito();

        carrito.forEach(producto => {
            if (producto.id == id && producto.cantidad > 1) {
                producto.cantidad--;
            }
        });

        guardarItem(carrito);
        mostrarCarrito();
        calcularTotales();
    }

});

function limpiarForm(){
    const nombre = document.getElementById('inputNombre4').value = "";
    const apellido = document.getElementById('inputApellido4').value = "";
    const direccion = document.getElementById('inputDirreccion').value  = "";
    const ciudad = document.getElementById('inputCity').value  = "";
    const provincia = document.getElementById('inputState').value = "";
}

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

         Swal.fire({
        theme: 'bootstrap-5',
        title: 'Error!',
        text: 'Debes completar los campos de envio antes de comprar',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc2626'
        })
        return;

    }

    Swal.fire({
    title: 'Compra realizada con exito!',
    text: 'Muchas gracias por tu compra!',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#96DF7B'
    })

    limpiarForm();
    localStorage.removeItem('carrito');
    mostrarCarrito();
    calcularTotales();

});


btnVaciar.addEventListener('click', () => {

    if (obtenerCarrito().length === 0) {
        
         Swal.fire({
        theme: 'bootstrap-5',
        title: 'Carrito vacío',
        text: 'Tu carrito ya está vacío.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6B7280'
        })
        return;

    } else{

        Swal.fire({
        title: 'Atención',
        text: "Esta seguro que desea vaciar su carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            mostrarCarrito();
            calcularTotales();

            Swal.fire({
                title: 'Carrito vaciado',
                text: 'Tu carrito ha sido vaciado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#96DF7B'
            });
        }
    });
}


//VACIAR EL CARRITO

});

//iniciar la pagina con los productos del carrito y los totales calculados
mostrarCarrito();
calcularTotales();