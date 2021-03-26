const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/',async(req,res)=>{

    /*await pool.query('select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id group by nameCategory, a.id', (error, rows, fields)=>{
        if (error) throw error;
        res.json(rows);
    });*/
    var products = await pool.query('select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id group by nameCategory, a.id');
    res.json(products); 
});

router.get('/:param',async(req,res)=>{
    //para buscar elemento ingresado en el buscador
    var parameter = '"%'+req.params.param+'%"';
    var query = 'select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id AND a.name LIKE '+parameter+' order by a.name';
    //console.log(query);

    /*await pool.query(query, (error, rows, fields)=>{
        if (error) throw error;
        res.json(rows);
    });*/
    var products = await pool.query(query);
    res.json(products);
  
});

router.get('/buscar/:id',async(req,res)=>{
    const id = req.params.id;

    /*await pool.query(  'select a.name , b.name as nameCategory, a.price, a.discount  from product a, category b where a.category = b.id AND a.id = ?',[id] , (error, rows, fields)=>{
        if (error) throw error;
        res.json(rows);
    });*/
    var products = await pool.query('select a.name , b.name as nameCategory, a.price, a.discount  from product a, category b where a.category = b.id AND a.id = ?',[id]);
    res.json(products);

});

module.exports = router;