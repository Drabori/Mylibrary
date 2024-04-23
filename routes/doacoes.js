//routes\doacoes.js
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs') //File system permite apagar logos desnecessarios

const Doacao = require("../models/doacao");
const User = require("../models/user");

const uploadPath = path.join('public', Doacao.companyLogoBasePath )
const imageMimeTypes = ['image/jpeg', 'image/png','images/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

//Todas Doacoes
router.get("/", async (req, res) => {
    let query = Doacao.find()
    if(req.query.user != null && req.query.user != ''){
        query = query.regex('user', new RegExp(req.query.user, 'i'))
    }
    if (req.query.dataBefore != null && req.query.dataBefore != '') {
        query = query.lte('data', req.query.dataBefore)
      }
      if (req.query.dataAfter != null && req.query.dataAfter != '') {
        query = query.gte('data', req.query.dataAfter)
      }
      try{
        const doacoes = await query.exec()
        res.render('doacoes/index', {
            doacoes: doacoes,
            searchOptions: req.query
        })
      }catch{
        res.redirect('/')
      }
});

//New Doacao Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Doacao())
});

// Create Doacao Route
router.post("/", upload.single('logo'), async (req, res) => {
    console.log(req.body)
    console.log(req.file)

    const fileName = req.file != null ?  req.file.filename : null;
    const doacao = new Doacao({
        user: req.body.user,
        preco: req.body.preco,
        data: new Date(req.body.data),
        companyLogo: fileName,
        observacoes: req.body.observacoes
    })
    try{
        const newDoacao = await doacao.save()
        // res.redirect(`doacoes/${newDoacao.id}`)
        res.redirect('doacoes')
    }catch{
        if(doacao.fileName != null){
        removeLogo(doacao.fileName)
    }
        renderNewPage(res, doacao, true)
    }
});

function removeLogo(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if (err) console.error(err)
    })
}

async function renderNewPage(res, doacao, hasError =false){
    try{
        const users = await User.find({})
        const params = {
            users: users,
            doacao: doacao
        }
        if (hasError) params.errorMessage = 'Error Creating Doacao'
        res.render('doacoes/new', params)
    } catch {
        console.error(err);
        res.redirect('/doacoes')
    }
}

module.exports = router;