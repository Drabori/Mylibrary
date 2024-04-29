//routes\index.js
const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', async (req, res)=> {
  res.render('index')
});

module.exports = router;


/*
//GET model/entidades
const Entidade = require('../models/entidade') 

router.get('/', async (req, res)=> {
  let entidades
  try{
    entidades = await entidade.find().sort({createdAt: 'desc'}).limit(10).exec()
  }catch{
    entidades = []
  }
  res.render('index', {entidades: entidades})
});
*/