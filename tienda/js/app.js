'use strict'


var resultado =  [];

function escribirProductos(resultado){
    console.log(resultado);
    var html=``;
    resultado.forEach(result => {
        console.log(result);
        html +=`<div  class="col-md-3 mb-4">
        <div class="card">
           <img src="${result.url_image}" class="card-img-top" alt="...">
           
           <div class="card-body">
                <h5class="card-title">${result.name}</h5>
                <p class="card-text">$ ${result.price}</p>
                <a href="#" class="btn btn-primary"> <i class="fa fa-cart-plus" style="font-size:24px"></i>  </a>
            </div>
        </div>
        </div>
        `;
        

    });
   
    document.getElementById('productos').innerHTML = html;
}


function peticion(){
    fetch('http://localhost:3000',{
        method: 'GET'
    })
    .then(data =>data.json())
    .then(data =>{
        //console.log(data);
        resultado = data;
        escribirProductos(resultado);
    });
}

//se cargan datos al cargarse la pagina
document.addEventListener("DOMContentLoaded", function(event) {
    peticion();

});

/*fetch('http://localhost:3000',{
    method: 'GET'
})
.then(data =>data.json())
.then(data =>{
    resultado = data;
    console.log(resultado);
});*/




