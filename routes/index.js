//routes\index.js
const express = require('express');
const router = express.Router();
//GET model/doacao
const Doacao = require('../models/doacao') 

/* GET home page. */
router.get('/', async (req, res)=> {
  let doacoes
  try{
    doacoes = await Doacao.find().sort({createdAt: 'desc'}).limit(10).exec()
  }catch{
    doacoes = []
  }
  res.render('index', {doacoes: doacoes})
});

module.exports = router;
