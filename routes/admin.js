const express = require('express');
const router = express.Router();

// Rota principal do administrador
router.get('/', (req, res) => {
  res.render('auth/admin'); // Renderiza a pagina do administrador
});

module.exports = router;
