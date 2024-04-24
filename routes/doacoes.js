const express = require('express');
const router = express.Router();

const multer = require('multer')
const path = require('path')
const fs = require('fs') //File system permite apagar logos desnecessario

const Doacao = require("../models/doacao");
const User = require("../models/user");

// Função para renderizar a página de nova doação
async function renderNewPage(res, doacao, hasError = false) {
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
}

// Rota para exibir o formulário de nova doação
router.get("/new", async (req, res) => {
    renderNewPage(res, new Doacao());
});

// Rota para criar uma nova doação
router.post("/", async (req, res) => {
    console.log(req.body);
    console.log(req.file);       
    
    // Remova espacos em branco do userID
    const userId = req.body.user.trim();

    const doacao = new Doacao({
        user: userId,
        preco: req.body.preco,
        data: new Date(req.body.data),
        observacoes: req.body.observacoes
    });

    try {
        const newDoacao = await doacao.save();
        res.redirect('doacoes');
    } catch {
        renderNewPage(res, doacao, true);
    }
});

// Rota para listar todas as doações
router.get("/", async (req, res) => {
    let query = Doacao.find();
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

module.exports = router;
