const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.post('/',(req,res)=>{
    const {categorias,filtros} = req.body; 
    //console.log(parseInt(categorias));
    var query = 'select * from product';
    //para agregar el o las condiciones
    if(categorias != 'Todos'){
        var category = parseInt(categorias);
        query = query + ' where category = '+category;
        if(filtros == 'discount'){
            query = query + ' AND discount > 0';
        }
    }else{
        query = query + ' where discount > 0';
    }


    // para ver como se ordenaran los datos
    if(filtros == 'name' || filtros == 'price'){
        query = query + ' order by '+filtros+ ' asc';
    }else{
        query = query + ' order by '+filtros+ ' desc';
    }
    
    console.log(query);
    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

module.exports = router;