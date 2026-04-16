document.addEventListener("DOMContentLoaded", () => {
    let modalContainer = document.getElementById("detalle-modal-container");
    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "detalle-modal-container";
        document.body.appendChild(modalContainer);
    }
});

/**
 * @param {number|string} productId 
 */
async function mostrarModalDetalle(productId) {
    try {

        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) throw new Error("No se pudo obtener el producto");

        const product = await response.json();

        renderModal(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al cargar los detalles del producto.',
        });
    }
}

/**
 * Inyecta el HTML del modal en el contenedor
 * @param {Object} product 
 */
function renderModal(product) {
    const modalContainer = document.getElementById("detalle-modal-container");


    modalContainer.innerHTML = `
        <div class="detalle-modal-overlay" id="detalle-modal-overlay">
            <div class="detalle-modal-content">
                <button class="detalle-close-button material-symbols-outlined" id="detalle-close-button">close</button>
                <div class="detalle-modal-body">
                    <div class="detalle-image-container">
                        <img src="${product.image}" alt="${product.title}" class="detalle-img">
                    </div>
                    <div class="detalle-info-container">
                        <span class="detalle-category">${product.category}</span>
                        <h2 class="detalle-title">${product.title}</h2>
                        <p class="detalle-price">$${product.price.toFixed(2)}</p>
                        <p class="detalle-description">${product.description}</p>
                        
                        <div class="detalle-actions">
                            <div class="detalle-cantidad-control">
                                <button id="btn-restar-cantidad" class="btn-cantidad" disabled>-</button>
                                <span id="detalle-cantidad-texto">1</span>
                                <button id="btn-sumar-cantidad" class="btn-cantidad">+</button>
                            </div>
                            
                            <button id="btn-agregar-carrito-modal" class="btn-agregar-carrito">
                                <i class="material-symbols-outlined">shopping_cart</i>
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;


    const overlay = document.getElementById("detalle-modal-overlay");
    const closeBtn = document.getElementById("detalle-close-button");
    const btnRestar = document.getElementById("btn-restar-cantidad");
    const btnSumar = document.getElementById("btn-sumar-cantidad");
    const spanCantidad = document.getElementById("detalle-cantidad-texto");
    const btnAgregar = document.getElementById("btn-agregar-carrito-modal");

    let cantidad = 1;


    overlay.style.display = 'flex';


    const cerrarModal = () => {
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.style.display = 'none';
            modalContainer.innerHTML = '';
        }, 300);
    };


    closeBtn.addEventListener('click', cerrarModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarModal();
    });

    btnSumar.addEventListener('click', () => {
        cantidad++;
        spanCantidad.textContent = cantidad;
        btnRestar.disabled = cantidad <= 1;
    });

    btnRestar.addEventListener('click', () => {
        if (cantidad > 1) {
            cantidad--;
            spanCantidad.textContent = cantidad;
            btnRestar.disabled = cantidad <= 1;
        }
    });

    btnAgregar.addEventListener('click', () => {
        agregarAlCarrito(product, cantidad);
        cerrarModal();
    });
}

/**
 * Guarda el producto en el LocalStorage
 * @param {Object} product 
 * @param {number} cantidad 
 */
function agregarAlCarrito(product, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const index = carrito.findIndex(item => item.id === product.id);
    if (index !== -1) {

        carrito[index].cantidad += cantidad;
    } else {
        carrito.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            cantidad: cantidad
        });
    }


    localStorage.setItem('carrito', JSON.stringify(carrito));


    Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Añadido al carrito!',
        text: `Se agregó ${cantidad}x "${product.title}" exitosamente.`,
        showConfirmButton: false,
        timer: 2000,
        customClass: {
            popup: 'swal-custom-popup'
        }
    });
}
