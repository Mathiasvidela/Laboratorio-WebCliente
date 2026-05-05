const AIRTABLE_TOKEN = AIRTABLE_CONFIG.TOKEN;
const AIRTABLE_BASE_ID = AIRTABLE_CONFIG.BASE_ID;
const AIRTABLE_TABLE_NAME = AIRTABLE_CONFIG.TABLE_NAME;

// URL base de la API
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?pageSize=100`;

const menuHamburguesa = document.getElementById('menu-hamburguesa');
const mobileMenu = document.getElementById('mobile-menu');
const closeButton = document.getElementById('close-button');
const abrirModal = document.querySelectorAll('.abrir-modal');
const formModal = document.getElementById('form-modal');

menuHamburguesa.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
});

abrirModal.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        formModal.style.display = 'block';
    });
});


closeButton.addEventListener('click', function () {
    formModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === formModal) {
        formModal.style.display = 'none';
    }
});

//fetch a Airtable

async function obtenerTodosLosProductos() {
    const response = await fetch(AIRTABLE_URL, {
        headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data);
        throw new Error(`Error de Airtable: ${response.status}`);
    }

    return data.records.filter(record => Object.keys(record.fields).length > 0);
}

// Variable para guardar los productos obtenidos de Airtable
let productosCargados = [];

// Cargar productos al iniciar la página

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const registros = await obtenerTodosLosProductos();
        productosCargados = registros.map(record => {
            const fields = record.fields;

            return {
                id: record.id,
                titulo: fields.Titulo || "Producto sin nombre",
                descripcion: fields.Caracteristicas || "Sin descripción",
                imagen: fields.imagen || "images/Products/default-product.jpg",
                precio: fields.precio || "0",
                categoria: fields.categoria || "Sin categoría"
            };
        });
        renderizarProductos(productosCargados);

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
});


// Función para renderizar productos en el HTML

function renderizarProductos(productos) {
    const container = document.querySelector('.product-container');

    if (!container) {
        console.error('No existe .product-container en el HTML');
        return;
    }

    container.innerHTML = productos.map(producto => `
        <article class="product-card" onclick="verDetalleProducto('${producto.id}')">
            <img src="${producto.imagen}" alt="${producto.titulo}" class="product-image">

            <div class="product-info">
                <p class="product-category">${producto.categoria}</p>

                <h3 class="product-title">${producto.titulo}</h3>

                <p class="product-description">${producto.descripcion}</p>

                <div class="product-bottom">
                    <p class="product-price">$${producto.precio}</p>

                    <button class="add-to-cart-btn" data-id="${producto.id}" onclick="event.stopPropagation()">
                        <span class="material-symbols-outlined">shopping_cart</span>
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// Función para activar los botones de "Agregar al carrito"

function activarBotonesAgregar(productos) {
    const botonesAgregar = document.querySelectorAll('.add-to-cart-btn');

    botonesAgregar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const productoId = boton.dataset.id;
            const productoSeleccionado = productos.find(function (producto) {
                return producto.id === productoId;
            });

            Swal.fire({
                title: '¿Agregar al carrito?',
                text: `¿Quieres agregar "${productoSeleccionado.titulo}" al carrito?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#6b7280'
            }).then(function (result) {
                if (result.isConfirmed) {
                    agregarAlCarrito(productoSeleccionado);

                    Swal.fire({
                        title: 'Producto agregado',
                        text: `"${productoSeleccionado.titulo}" fue agregado al carrito.`,
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#2563eb'
                    });
                }
            });
        });
    });
}

function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito.push(producto);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    console.log('Carrito actual:', carrito);
}

// Cargar productos al iniciar la página

function verDetalleProducto(productoId) {
    const producto = productosCargados.find(p => p.id === productoId);
    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }
    document.getElementById('modal-img').src = producto.imagen;
    document.getElementById('modal-title').innerText = producto.titulo;
    document.getElementById('modal-category').innerText = producto.categoria;
    document.getElementById('modal-description').innerText = producto.descripcion;
    document.getElementById('modal-price').innerText = `$${producto.precio}`;

    document.getElementById('product-detail-modal').style.display = 'flex';
}
// Cerrar el modal de detalle del producto
document.getElementById('close-detail-modal').addEventListener('click', () => {
    document.getElementById('product-detail-modal').style.display = 'none';
});
// Cerrar el modal de detalle al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    const detailModal = document.getElementById('product-detail-modal');
    if (event.target === detailModal) {
        detailModal.style.display = 'none';
    }
});