
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














