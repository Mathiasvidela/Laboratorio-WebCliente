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

menuHamburguesa.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
});

abrirModal.forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        formModal.style.display = 'block';
    });
});


closeButton.addEventListener('click', function() {
    formModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
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

// Función para renderizar productos en el HTML

function renderizarProductos(productos) {
    const container = document.querySelector('.product-container');

    if (!container) {
        console.error('No existe .product-container en el HTML');
        return;
    }

    container.innerHTML = productos.map(producto => `
        <article class="product-card">
            <img src="${producto.imagen}" alt="${producto.titulo}" class="product-image">

            <div class="product-info">
                <p class="product-category">${producto.categoria}</p>

                <h3 class="product-title">${producto.titulo}</h3>

                <p class="product-description">${producto.descripcion}</p>

                <div class="product-bottom">
                    <p class="product-price">$${producto.precio}</p>

                    <button class="add-to-cart-btn" data-id="${producto.id}">
                        <span class="material-symbols-outlined">shopping_cart</span>
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// Cargar productos al iniciar la página

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const registros = await obtenerTodosLosProductos();

    const misProductos = registros.map(record => {
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

        console.log(misProductos);
        renderizarProductos(misProductos);

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
});