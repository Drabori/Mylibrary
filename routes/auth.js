//routes\auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Supondo que voce tem um modelo User

// Pagina de Login
router.get('/login', (req, res) => {
  res.render('auth/login'); 
});

// Processar o Login
router.post('/login', (req, res) => {
  // Aqui voce deve implementar a logica de autenticacao

  res.redirect('/admin'); 
});

// Pagina de Registro
router.get('/register', (req, res) => {
  res.render('auth/register'); 
});

// Processar o Registro
router.post('/register', (req, res) => {
  // Aqui voce deve adicionar o usuario ao banco de dados
  
  res.redirect('/login'); 
});

module.exports = router;


