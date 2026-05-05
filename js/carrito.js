//local storage temporal para probar funciones de calculo de totales y mostrar productos dinamicos LUEGO BORRAR
localStorage.setItem('carrito', JSON.stringify([
    { id: 1, title: 'Producto 1', price: 100, cantidad: 10 , image: 'https://placehold.co/600x400'},
    { id: 2, title: 'Producto 2', price: 50, cantidad: 5 , image: 'https://placehold.co/600x400'},
    { id: 3, title: 'Producto 3', price: 150, cantidad: 1 , image: 'https://placehold.co/600x400'}
]));


//retorna  los datos del carrito
export function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}


//guarda modificacion en el localstorage
export function guardarItem(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


//se guarda un producto al carrito y si es duplicado se suma la cantidad
export function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();

  //verifica si ya existe
  const productoExistente = carrito.find(item => item.id == producto.id);

  if (productoExistente) {
    productoExistente.cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }

  guardarItem(carrito);
}


//elimina un producto pasando como parametro el id
export function eliminarItem(id) {
  const carrito = obtenerCarrito();

  const carritoActualizado = carrito.filter(producto => producto.id != id);

  guardarItem(carritoActualizado);
}


//vacia todo el carrito
export function vaciarCarrito() {
  localStorage.removeItem("carrito");
}














