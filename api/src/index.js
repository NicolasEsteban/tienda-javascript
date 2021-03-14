const express = require('express');
const cors = require('cors');
const app = express();

//configuracion del servidor y otros
app.set('port',process.env.PORT || 3000);

//middlewares
app.use(express.json());
app.use(cors());
//rutas
app.use('/api/product',require('./routes/products'));

// iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en puerto',app.get('port'));
});