const express = require('express');
const router = express.Router();
const News = require('../models/news');

router.get('/', (req, res) => {
    // url param, bierze sie z formluarza 'search' z news.pug
    const search = req.query.search || '';


    // fin pozwala wykonac funkcje po odebranu danych z dowolnym momencien, a nie tylko w callbacku finda, dzieki temu mozemy np. zrobic sort ( taki middleware)
    const findNews = News.find({
        title: new RegExp(search.trim(), 'i')
    }).sort({
        created: -1
    });


    // -1 to malejaco
    findNews.exec((err, data) => {
        res.render('news', {
            title: 'News',
            data,
            search
        });
    })
});

module.exports = router;