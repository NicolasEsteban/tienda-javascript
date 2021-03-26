'use strict'

//Decalracion de variables
var result = [];
var search_button = null;
var search_input = null;
var shopping_element = null;
var htmlShopping = ``;
var loading = null;
var contents = null;
// mostrar y cerrar se ocupa para manipular elemento que contiene
// productos seleccionados
function show() {
    shopping_element.style.display = '';   
}

function hide() {
    shopping_element.style.display = 'none';
}



//Escribe los datos de los productos en el documento html
function writeProducts(result) {
    var html = ``;
    if (result.length != 0) {
        result.forEach(res => {
            var image = res.url_image;
            //En caso de que se encuentren elementos sin imagen
            if (image === null || image === "") {
                image = 'https://www.te.gob.mx/media/images/portal/imagen-no-disponible.png';
            }
            html += `
        <div  class="col-md-3 mb-4">
            <div class="card">
                <img src="${image}" class="card-img-top" alt="...">
           
                <div class="card-body">
                    <h5 class="card-title">${res.name}</h5>
                    <p class="card-text">$ ${res.price}</p>
                    <span class="badge rounded-pill bg-warning text-dark">% ${res.discount}</span>            
                </div>

                <div class="card-footer text-muted">
                <button type="button" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Agregar al carrito" onclick="selectProduct('${res.id}' );" >  <i class="fa fa-cart-plus" style="font-size:24px"></i> </button>
                </div>
            </div>
        </div>
        
        `;


        });
    }else { // En caso de que no se haya encontrado ningun elemento
        html += `
        <center><h3><span class="badge bg-light text-dark">Sin resultados</span></h3></center>
        `;
    }
    //se ingresa elemento html en div seleccionado  
    document.getElementById('products').innerHTML = html;
}

// Se realiza la consulta a la api para traer los productos
// En caso de que haya o no envio de parametros
async function petition(param, result) {
    //console.log(resultado);
    //console.log(param);
    try {
        var res;
        if (param == null) {
            res = await fetch('https://api-tiendatest.herokuapp.com/api/product');
        } else {
            res = await fetch(`https://api-tiendatest.herokuapp.com/api/product/${param}`);
        }
        const data = await res.json();
        result = data;

        contents.style.display = '';
        loading.style.display = 'none';

        console.log(result);
        writeProducts(result);
    } catch (error) {
        console.log(error);
    }
}
// Funcion que se ocupa para consultar la api
// Al momento de realizar los filtros
async function filterResult(param,result){

    //console.log(param);
    try {
        const res = await fetch('https://api-tiendatest.herokuapp.com/api/category',{
            method: 'POST',
            body: JSON.stringify(param),
            headers:{
                'Content-Type': 'application/json'
            }
        }); 
        const data = await res.json();
        result = data;
        //console.log(result);
        writeProducts(result);
        } catch (error) {
            console.log(error);
        }
}
// Funcion que obtiene el id del producto y asi tener los datos
// y agregarlos al carrito de compras
async function selectProduct(id){
    //console.log(id);
    try {
        const res = await fetch(`https://api-tiendatest.herokuapp.com/api/product/buscar/${id}`);
        const data = await res.json();
        data.forEach(dat =>{
            console.log(dat);
            htmlShopping += `
            <tr>
                <td>${dat.name}</td>
                <td>${dat.nameCategory}</td>
                <td>${dat.price}</td>
                <td>${dat.discount}</td>
            </tr>
            `
        });
        document.getElementById('body-table').innerHTML = htmlShopping;
    } catch (error) {
        console.log(error);
    }
}

//funcion para realizar los filtros dependiendo de la opciones 
//que seleccione el usuario
function selectOption(){

    var categories = document.querySelector('#categories');
    var filters = document.querySelector('#filters');
    var data = {
        categories : categories.value,
        filters : filters.value
    };
    filterResult(data,result);

    
}
// Evento donde se cargan las funciones y variables en la vista
window.addEventListener("load", function (event) {
    search_button = document.querySelector("#search_button");
    search_input = document.querySelector("#search_input");
    shopping_element = document.querySelector("#shopping-cart");

    loading = document.querySelector("#loading");
    contents = document.querySelector("#contents");
    if(result.length === 0){
        contents.style.display = 'none';
    }
    shopping_element.style.display = 'none';
    //Eventos que capturan el click y el enter en la barra utilizada 
    //para buscar algun elemento segun su nombre
    petition(search_input.value, result);
    search_button.addEventListener('click', () => {
        petition(search_input.value, result);
    });
    search_input.addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            petition(search_input.value, result);
        }
    });


});