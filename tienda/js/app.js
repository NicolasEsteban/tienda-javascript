'use strict'

//Decalracion de variable que contendra los datos
var resultado =  [];



//Funciones
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
                    <h5class="card-title">${result.name}</h5>
                    <p class="card-text">$ ${result.price}</p>
                    <p class="card-text">% ${result.discount}</p>                    
                </div>

                <div class="card-footer text-muted">
                    <a href="#" class="btn btn-primary"> <i class="fa fa-cart-plus" style="font-size:24px"></i>  </a>
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
    console.log(resultado);
    escribirProductos(resultado);
} catch (error) {
    console.log(error);
}
}

function seleccionarOpcion(){
    var categorias = document.querySelector('#categorias');
    var filtros = document.querySelector('#filtros');
    var data = {
        categorias: categorias.value ,
        filtros: filtros.value
    }
    
    peticionFiltros(data,resultado);
}

//se cargan datos al cargarse la pagina
window.addEventListener("load", function(event) {
    
    var boton_buscador = document.querySelector('#boton_buscador');
    var input_buscador = document.querySelector('#input_buscador');

    peticion(input_buscador.value,resultado);

    boton_buscador.addEventListener('click',()=>{
        peticion(input_buscador.value,resultado);
    });
    
});

/*fetch('http://localhost:3000',{
    method: 'GET'
})
.then(data =>data.json())
.then(data =>{
    resultado = data;
    console.log(resultado);
});*/




