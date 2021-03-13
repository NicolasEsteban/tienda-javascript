const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/',(req,res)=>{
    mysqlConnection.query('select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

module.exports = router;
