const express = require('express');
const router = express.Router();

const pool = require('../database');

router.post('/', async (req, res) => {
    const { categories, filters } = req.body;
    //console.log('categoria '+categories);
    //console.log('filtro '+filters);
    var query = '';
    if (categories == '0' && filters == '0') {
        query = 'select a.id, a.name, a.url_image, a.price, a.discount, b.name as nameCategory from product a, category b where a.category = b.id group by nameCategory, a.id';
    } else {
        query = 'select * from product';
        if (categories != '0') {
            query = query + ' where category = ' + categories;
        }
        if (filters != '0') {
            if (filters === 'discount' && categories != '0') {
                query = query + ' AND discount > 0';
            }
            if (filters === 'discount' && categories === '0') {
                query = query + ' where discount > 0';
            }
            // para ver como se ordenaran los datos
            if (filters == 'name' || filters == 'price') {
                query = query + ' order by ' + filters + ' asc';
            } else {
                query = query + ' order by ' + filters + ' desc';
            }
        }
    }
    //console.log(query);
    /*await pool.query(query, (error, rows, fields)=>{
        if (error) throw error;
        res.json(rows);
    });*/
    var products = await pool.query(query);
    res.json(products);
});

module.exports = router;