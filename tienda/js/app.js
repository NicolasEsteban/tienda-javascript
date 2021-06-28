'use strict'
var result = [];
var search_button = null;
var search_input = null;
var category = null;
var filter = null;
var shopping_element = null;
var htmlShopping = ``;
var totalToPlay = 0;

//variables paginacion
var pageNumber;
var pageSize;
var pagination;
var pageCont;
var ranks = [];

// Funciones paginacion
// Se selecciona la cantidad de elementos que se mostra por pagina
function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};
// Funcion utilizada para la pagina siguiente
function nextPage() {
  pageNumber++;
  showData(result);
};
// Funcion utilizada para ir a la pagina anterior
function previusPage() {
  pageNumber--;
  showData(result);
};
// Funcion para seleccionar la pagina que indica cada uno de los botones
function selectPage(number) {
  //console.log('numero de pagina: '+number);
  pageNumber = parseInt(number);
  showData(result);
}
// Define numero de los botones entre el boton 'anterior' y 'siguiente'
function calculateButtons(ranks) {
  var numbers = [];
  if (pageNumber < ranks[0]) {
    ranks[0] = pageNumber;
    ranks[1] = pageNumber + 4;
  }
  if (pageNumber > ranks[1]) {
    ranks[1] = pageNumber;
    ranks[0] = pageNumber - 4;
  }

  console.log(pageNumber);
  console.log('rangos: ' + ranks);
  for (let i = ranks[0]; i <= ranks[1]; i++) {

    numbers.push(i);
  }
  return numbers;
};

// Funcion principal que realiza la paginacion y se escriben los botones en la vista
function showData(data) {
  var pagination = paginate(data, pageSize, pageNumber);
  //cantidad de pagina es mayor a 5
  var html = "";

  writeProducts(pagination);
  html = `<div class="btn-group me-2" role="group" aria-label="First group"></div>`;
  html += pageNumber > 1 ? `<button type="button" id="previus" class="btn btn-outline-primary" onclick='previusPage()' >  &laquo; </button> ` : ``;
  //Si la cantidad de pagina es mayor que 5, se imprimiran los botones del medio
  if (pageCont > 5) {
    var numberButtons = calculateButtons(ranks);
    console.log('numero botones: ' + numberButtons);
    numberButtons.forEach(numberB => {
      //console.log(numberB);
      if (numberB === pageNumber) {
        html += `<button type="button" class="btn btn-primary" onclick="selectPage('${numberB}' );" >${numberB}</button>`;
      } else {
        html += `<button type="button" class="btn btn-outline-primary" onclick="selectPage('${numberB}' );" >${numberB}</button>`;
      }
    });
  }
  html += pageNumber < pageCont ? `<button type="button" id="next" class="btn btn-outline-primary" onclick='nextPage()' > &raquo; </button>  ` : ``;
  html += ` </div>`;
  document.getElementById("pagination").innerHTML = "";
  document.getElementById("pagination").innerHTML = html;




};


// Resto de funciones

function selectProduct(id) {

  var myInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  petitionShopping(`https://api-tiendatest.herokuapp.com/api/product/buscar/${id}`, myInit);

}

function shoppingElements(resultShopping) {

  resultShopping.forEach(res => {
    console.log(res);
    var totalPrice = null;
    if(res.discount == 0){
      totalPrice = res.price;
    }else{
      totalPrice = res.price - ( res.price*res.discount/100);
    }
    totalToPlay = totalToPlay + totalPrice;
    document.querySelector("#total_to_play").innerHTML = 'Pagar: $'+totalToPlay;
    htmlShopping += `
    <tr>
        <td>${res.name}</td>
        <td>${res.nameCategory}</td>
        <td>${res.price}</td>
        <td>${res.discount}</td>
        <td>${totalPrice}</td>
    </tr>
    `
  });
  document.getElementById('body-table').innerHTML = htmlShopping;


}

function petitionShopping(url, myInit) {

  getJSON(url, myInit)
    .then((json) => {
      var resultShopping = json;
      console.log(resultShopping);
      shoppingElements(resultShopping);
    })
    .catch((err) => {
      console.log("Error encontrado:", err);
    });
}


// mostrar y cerrar se ocupa para manipular elemento que contiene
// productos seleccionados
function show() {
  shopping_element.style.display = '';
}

function hide() {
  shopping_element.style.display = 'none';
}

// Indica las posicion de las listas
function listPosition() {
  var pos = []
  //se obtiene posicion actual en categorias
  category.forEach((cat, i) => {
    if (cat.classList.contains('active')) {
      pos.push(i);
    }
  });
  //se obtiene posicion actual en filtros
  filter.forEach((fil, i) => {
    if (fil.classList.contains('active')) {
      pos.push(i);
    }
  });
  return pos;
}
// Se realiza la conulta a la api para filtrar los datos
function filterRequest(cat, fil) {

  var data = {
    categories: cat,
    filters: fil
  };

  var headboard = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  petition('https://api-tiendatest.herokuapp.com/api/category', headboard);

}
// Selecciona filtros
function selectFilter(pos) {
  var hashtag_category = listPosition()[0];
  var hashtag_filter = listPosition()[1];

  //se agrega categoria al elemento que corresponda
  filter[hashtag_filter].classList.remove('active');
  filter[pos].classList.add('active');

  //Se enviara elementos correspondientes al api
  filterRequest(category[hashtag_category].id, filter[pos].id);
}
// Selecciona categoria
function selectCategory(pos) {
  var hashtag_category = listPosition()[0];
  var hashtag_filter = listPosition()[1];

  //se agrega categoria al elemento que corresponda
  category[hashtag_category].classList.remove('active');
  category[pos].classList.add('active');

  //Se enviara elementos correspondientes al api
  filterRequest(category[pos].id, filter[hashtag_filter].id);

}

function getJSON(url, myInit) {
  return new Promise((resolve, reject) => {
    fetch(url, myInit)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        reject(
          "No hemos podido recuperar ese json. El código de respuesta del servidor es: " +
          response.status
        );
      })
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });
}

function petition(url, myInit) {

  getJSON(url, myInit)
    .then((json) => {
      result = json;
      console.log(result);
      // Pagina de inicio
      pageNumber = 1;
      // Elementos por pagina
      pageSize = 8;
      // Elemento utilizados para obtener los botones que estaran al medio 
      ranks.push(pageNumber, pageNumber + 4);
      // Cantidad de paginas
      pageCont = Math.ceil(result.length / pageSize);
      //writeProducts(result);
      showData(result);

    })
    .catch((err) => {
      console.log("Error encontrado:", err);
    });
}
// Se escribe el producto
function writeProducts(result) {
  var html = ``;
  if (result.length != 0) {
    result.forEach(res => {
      var image = res.url_image;
      //En caso de que se encuentren elementos sin imagen
      if (image === null || image === "") {
        image = './images/imagen-no-disponible.png';
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
  } else { // En caso de que no se haya encontrado ningun elemento
    html += `
      <center><h3><span class="badge bg-light text-dark">Sin resultados</span></h3></center>
      `;
  }
  //se ingresa elemento html en div seleccionado  
  document.getElementById('products').innerHTML = html;
}


window.addEventListener("load", function (event) {
  search_button = document.querySelector("#search_button");
  search_input = document.querySelector("#search_input");
  shopping_element = document.querySelector("#shopping-cart");

  document.querySelector("#total_to_play").innerHTML = 'Pagar: $'+totalToPlay;

  category = document.querySelectorAll("div.category ul.dropdown-menu li a");
  category[0].className += " active";
  shopping_element.style.display = 'none';
  //category.remove("active");
  //console.log(category);
  //Se selecciona elemento con clase active
  //console.log(document.querySelectorAll("div.category ul.dropdown-menu li a.active"));
  //console.log(category[1].classList.contains('active'));
  filter = document.querySelectorAll("div.filter ul.dropdown-menu li a");
  filter[0].className += " active";
  var myInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  petition('https://api-tiendatest.herokuapp.com/api/product', myInit);

  search_button.addEventListener('click', () => {
    petition(`https://api-tiendatest.herokuapp.com/api/product/${search_input.value}`, myInit);
  });
  search_input.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      petition(`https://api-tiendatest.herokuapp.com/api/product/${search_input.value}`, myInit);
    }
  });




});