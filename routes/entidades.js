//routes\entidade.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs"); //File system permite apagar logos desnecessarios

const Entidade = require("../models/entidade");

const uploadPath = path.join("public", Entidade.companyLogoBasePath);
//tipos de imagens que vai aceitar
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});
  
//Todas entidades
router.get("/", async (req, res) => {
  //Cria array para pesquisar
  let searchOptions = {};

  //Verifica se name existe
  if (req.query.name != null && req.query.name !== "") {
    //RegExp -> tanto pode ser Maiuscula ou minuscula
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const entidades = await Entidade.find(searchOptions);
    res.render("entidades/index", {
      entidades: entidades,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//New Entidade Route
router.get("/new", (req, res) => {
  res.render("entidades/new", { entidade: new Entidade() });
});

// Create Entidade Route
router.post("/", upload.single("logo"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const fileName = req.file != null ? req.file.filename : null;

  const entidade = new Entidade({
    name: req.body.name,
    email: req.body.email,
    companyLogo: fileName,
  });

  try {
    console.log(entidade);
    const newEntidade = await entidade.save();
    // res.redirect(`entidades/${newEntidade.id}`)
    res.redirect("entidades");
  } catch (error) {
    console.error(error);
    
    if (entidade.fileName != null) {
      removeLogo(entidade.fileName);
    }
    res.render("entidades/new", {
      entidade: entidade,
      errorMessage: "Error creating Entidade",
    });
  }
  //nao da
  function removeLogo(fileName) {
    fs.unlink(path.join(uploadPath, fileName), (err) => {
      if (err) console.error(err);
    });
  }
});

module.exports = router;
