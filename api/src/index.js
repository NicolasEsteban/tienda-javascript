const express = require('express');

const app = express();

//configuracion del servidor y otros
app.set('port',process.env.PORT || 3000);

//middlewares
app.use(express.json());

//rutas
app.use(require('./routes/products'));

// iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en puerto',app.get('port'));
});