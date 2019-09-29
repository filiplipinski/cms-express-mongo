const express = require('express');
const router = express.Router();

const LOGIN = 'admin';
const PASSWORD = '123';

router.get('/', (req, res) => {
  res.render('index', {
    title: 'CMS: Express + MongoDB'
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Logowanie'
  });
})

router.post('/login', (req, res) => {
  const {
    body
  } = req;
  if (body.login === LOGIN && body.password === PASSWORD) {
    req.session.isAdminLogged = true;
    res.redirect('/admin');
  } else {
    res.redirect('/login');
  }

})


module.exports = router;