const express = require('express');
const router = express.Router();

const multer = require('multer')
const path = require('path')
const fs = require('fs') //File system permite apagar logos desnecessario

const Doacao = require("../models/doacao");
const User = require("../models/user");
const Entidade = require("../models/entidade");


// Rota para listar todas as doacoes
router.get("/", async (req, res) => {
    let query = Doacao.find().populate('user'); //consegue ir buscar dados a outro modelo(vai ao user)
    if (req.query.user != null && req.query.user != '') {
        query = query.regex('user', new RegExp(req.query.user, 'i'));
    }
    if (req.query.dataBefore != null && req.query.dataBefore != '') {
        query = query.lte('data', req.query.dataBefore);
    }
    if (req.query.dataAfter != null && req.query.dataAfter != '') {
        query = query.gte('data', req.query.dataAfter);
    }
    try {
        const doacoes = await query.exec();
        res.render('doacoes/index', {
            doacoes: doacoes,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
});

// New Doacao Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Doacao());
});

// Create Doacao Route
router.post("/", async (req, res) => {
    console.log(req.body);
    console.log(req.file);       
    
    // Remova espacos em branco do userID
    const userId = req.body.user.trim();

    const doacao = new Doacao({
        user: userId,
        entidade: req.body.entidade,
        preco: req.body.preco,
        data: new Date(req.body.data),
        observacoes: req.body.observacoes
    });

    try {
        const newDoacao = await doacao.save();
        res.redirect(`doacoes/${newDoacao.id}`);
    } catch {
        renderNewPage(res, doacao, true);
    }
});

//Show Doacao Route
router.get('/:id', async (req, res) => {
    try {
        const doacao = await Doacao.findById(req.params.id).populate('user').exec();
        res.render('doacoes/show', {doacao: doacao})
    } catch {
      res.redirect('/')
    }
  })


// Edit Doacao Route
router.get('/:id/edit', async (req, res) => {
  try {
    const doacao = await Doacao.findById(req.params.id)
    renderEditPage(res, doacao)
  } catch {
    res.redirect('/')
  }
})
  

  // Update Doacao Route
router.put('/:id', async (req, res) => {
  console.log('Update Doacao Route triggered')
    let doacao
  
    try {
      console.log('Updating doacao:', req.params.id); // Log para verificar o ID da doacao sendo atualizada
     
      const doacao = await Doacao.findByIdAndUpdate(req.params.id, {
      user: req.body.user.trim(),
      preco: req.body.preco,
      data: new Date(req.body.data),
      observacoes: req.body.observacoes
    }, { new: true }); // O parametro { new: true } retorna o documento atualizado


      console.log('Updated doacao:', doacao); // Log para verificar a doacao após a atualização
      await doacao.save()
      console.log('Doacao updated successfully'); // Log para verificar se a atualização foi bem-sucedida
      res.redirect(`/doacoes/${doacao.id}`); 
    } catch (error){
      console.error('Error updating doacao:', error); // Log se houver um erro durante a atualização
      if (doacao != null) {
        renderEditPage(res, doacao, true)
      } else {
        redirect('/')
      }
    }
  })
  
// Delete Doacao Page
router.delete('/:id', async (req, res) => {
    let doacao
    try {
        doacao = await Doacao.findById(req.params.id)
      await doacao.remove()
      res.redirect('/doacoes')
    } catch {
      if (doacao != null) {
        res.render('doacoes/show', {
            doacao: doacao,
          errorMessage: 'Could not remove doacao'
        })
      } else {
        res.redirect('/')
      }
    }
  })

  async function renderNewPage(res, doacao, hasError = false) {
    renderFormPage(res, doacao, 'new', hasError)
  }
  
  async function renderEditPage(res, doacao, hasError = false) {
    renderFormPage(res, doacao, 'edit', hasError)
  }
  async function renderFormPage(res, doacao, form, hasError = false) {
    try {
      const users = await User.find({})
      const params = {
        users: users,
        doacao: doacao
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating doacao'
        } else {
          params.errorMessage = 'Error Creating doacao'
        }
      }
      res.render(`doacoes/${form}`, params)
    } catch {
      res.redirect('/doacoes')
    }
  }
// Funcao para renderizar a pagina de nova doacao
/*async function renderNewPage(res, doacao, hasError = false) {
    try {
        const users = await User.find({});
        const params = {
            users: users,
            doacao: doacao
        };
        if (hasError) params.errorMessage = 'Error Creating Doacao';
        res.render('doacoes/new', params);
    } catch (err) {
        console.error(err);
        res.redirect('/doacoes');
    }
}*/



module.exports = router;
