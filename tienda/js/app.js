'use strict'

//Decalracion de variables
var resultado =  [];
var htmlCarrito = ``;

var elemento_compras = document.getElementById('compras');
//Funciones

// mostrar y cerrar se ocupa para manipular elemento que contiene
// productos seleccionados
function mostrar() {
    elemento_compras.style.display = '';
}

function cerrar() {
    elemento_compras.style.display = 'none';
}

//Escribe los datos en el documento html
function escribirProductos(resultado){
    console.log(resultado);
    var html=``;
    resultado.forEach(result => {
        var image = result.url_image;
        //En caso de que se encuentren elementos sin imagen
        if(image===null || image===""){ 
            image = 'https://www.te.gob.mx/media/images/portal/imagen-no-disponible.png';
        }
        html +=`
        
        <div  class="col-md-3 mb-4">
            <div class="card">
                <img src="${image}" class="card-img-top" alt="...">
           
                <div class="card-body">
                    <h5 class="card-title">${result.name}</h5>
                    <p class="card-text">$ ${result.price}</p>
                    <p class="card-text descuento" >% ${result.discount}</p> 
                                 
                </div>

                <div class="card-footer text-muted">
                    <button type="button" class="btn btn-primary id="botonSeleccionP" onclick="seleccionarProducto('${result.id}' );" > <i class="fa fa-cart-plus" style="font-size:24px"></i> </button>
                </div>
            </div>
        </div>
        
        `;
        

    });
    //se ingresa elemento html en div seleccionado  
    document.getElementById('productos').innerHTML = html;
}



// Se realiza la consulta a la api
async function peticion(param,resultado){
    //console.log(resultado);
    //console.log(param);
    try {
        var res;
        if(param ==null){
            res = await fetch('http://localhost:3000/api/product/');
        }else{
            res = await fetch(`http://localhost:3000/api/product/${param}`);
        }     
        const data = await res.json();
        resultado = data;
        //console.log(resultado);
        escribirProductos(resultado);
    } catch (error) {
        console.log(error);
    }
}

async function peticionFiltros(param,resultado){

   try {
    const res = await fetch('http://localhost:3000/api/category',{
        method: 'POST',
        body: JSON.stringify(param),
        headers:{
            'Content-Type': 'application/json'
        }
    }); 
    const data = await res.json();
    resultado = data;
    //console.log(resultado);
    escribirProductos(resultado);
    } catch (error) {
        console.log(error);
    }
}

// busca el producto seleccionado en la api, para despues agregarla a la tabla
async function seleccionarProducto(id){
    
    //console.log(id);
    try {
        const res = await fetch(`http://localhost:3000/api/product/buscar/${id}`);
        const data = await res.json();
        //console.log(data);
        data.forEach(dat =>{
            console.log(dat);
            htmlCarrito += `
            <tr>
                <td>${dat.name}</td>
                <td>${dat.nameCategory}</td>
                <td>${dat.price}</td>
                <td>${dat.discount}</td>
            </tr>
            `
            
        });
        document.getElementById('cuerpoTabla').innerHTML = htmlCarrito;
        

    } catch (error) {
        console.log(error);
    }
    
    
}


//funcion para realizar los filtros dependiendo de la opciones 
//que seleccione el usuario
function seleccionarOpcion(){
    var categorias = document.querySelector('#categorias');
    var filtros = document.querySelector('#filtros');
    
    //console.log(categorias.value);
    //console.log(filtros.value);
    
    var data = {
        categorias: categorias.value ,
        filtros: filtros.value
    }
    
    peticionFiltros(data,resultado);
}


//se cargan datos al cargarse la pagina
window.addEventListener("load", function(event) {
    elemento_compras.style.display = 'none';
  
    var boton_buscador = document.querySelector('#boton_buscador');
    var input_buscador = document.querySelector('#input_buscador');
        

    peticion(input_buscador.value,resultado);

    boton_buscador.addEventListener('click',()=>{
        peticion(input_buscador.value,resultado);
        
    });
    
   
});






