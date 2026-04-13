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