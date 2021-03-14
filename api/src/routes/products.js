const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/',(req,res)=>{
 
    mysqlConnection.query('select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id order by a.name',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});



router.get('/:param',(req,res)=>{
    const params = req.params;
    //console.log(params.param);
    var variable = '"%'+params.param+'%"'; 
    var query = 'select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id AND a.name LIKE '+variable+' order by a.name';
    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            //console.log(rows);
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

router.get('/buscar/:id',(req,res)=>{
    const id = req.params.id;
    //console.log(id);
    
    mysqlConnection.query('select a.name , b.name as nameCategory, a.price, a.discount  from product a, category b where a.category = b.id AND a.id = ?',[id],(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

module.exports = router;
