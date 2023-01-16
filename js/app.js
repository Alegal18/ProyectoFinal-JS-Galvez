const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('.listado-productos');
const btneliminarCarrito = document.querySelector('.borrar-producto');
let articulosCarrito = [];


cargarEventListeners();
function cargarEventListeners () {
    
    // cuando agregamos un producto presionando "Agregar al carrito"
    listaProductos.addEventListener('click', agregarProducto);
    // Elimina producto del carrito
    carrito.addEventListener('click', eliminarProducto);
    //Dispara sweetalert
    document.addEventListener('click', (e) => {
        
        if(e.target.classList.contains('agregar-carrito')){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Agregado Correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        }        
    });  

    // Trae carrito del localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        carritoHTML();
    });

    // Vaciar carrito de compras
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Reseteamos el arreglo

        limpiarHTML(); // Eliminamos todo nuestro HTML
        //carritoHTML();
    } );
     
    
}

async function agregarProducto (e) {
    e.preventDefault();    

    if (e.target.classList.contains('agregar-carrito')) {
        const productoId = e.target.getAttribute('data-id');
        try{
            const url = 'data/stock.json';
            const resp = await fetch(url)
            const data = await resp.json();
            
            const productoSeleccionado = data.find(producto => producto.id === productoId)
            if(!productoSeleccionado){
                articulosCarrito.push(productoSeleccionado);
            }          
            
            leerDatosProducto(productoSeleccionado);
            }
        catch (error){
            console.log(error);
        }
    }
}

//Eliminar un producto del carrito

function eliminarProducto(e) {
    if(e.target.classList.contains('borrar-producto')){
        const productoId = e.target.getAttribute('data-id');                
        const existe = articulosCarrito.some( producto => producto.id === productoId );
           
        if (existe){
             const productos = articulosCarrito.map( producto => {                
                
                if(producto.cantidad > 0 && producto.id === productoId) {
                    producto.cantidad--;
                    return producto;
                }else {
                    return producto
                }                
            });
            
            articulosCarrito = [...productos];            
            
            articulosCarrito = articulosCarrito.filter( producto => producto.cantidad > 0);            
            
        }    
                 
    
    carritoHTML(); // Iterar sobre carrito y mostrar su HTML
    
    }
}

function leerDatosProducto(producto) {
   const {id, nombre, precio, img, cantidad} = producto;
//Crea un objeto con el contenido del producto actual
    const infoProducto = {
        id: id,
        titulo: nombre,
        precio: precio,
        imagen: img,        
        cantidad: cantidad
                
    }
    
    const existe = articulosCarrito.some( producto => producto.id === infoProducto.id );

    if (existe){
        const productos = articulosCarrito.map( producto => {
            if(producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto;
            }
            else {
                return producto;
            }
        });        
        articulosCarrito = [...productos];
    }else {    
        articulosCarrito = [...articulosCarrito, infoProducto]    
    }
    carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
    //limpia el HTML
    limpiarHTML();

    articulosCarrito.forEach( producto => {
        const {imagen, titulo, precio, cantidad, id} = producto;     
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src= "${imagen}" width="100"
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td class='cantidad'>${cantidad}</td>
            <td>
                <a href="#" class="borrar-producto" data-id="${id}"> X </a>
            </td>
            
            `;

            contenedorCarrito.appendChild(row);
    });

    sincronizarStorage();
    
}
// Sincroniza localStorage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Elimina los productos del tbody

function limpiarHTML() {
    //contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
};

