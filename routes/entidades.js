//routes\entidade.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs"); //File system permite apagar logos desnecessarios

const Doacao = require("../models/doacao");
const User = require("../models/user");
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
router.get("/new", async (req, res) => {
  res.render("entidades/new", { entidade: new Entidade() });
});

// Create Entidade Route
router.post("/", upload.single("logo"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;

  const entidade = new Entidade({
    name: req.body.name,
    email: req.body.email,
    companyLogo: fileName,
  });

  try {
    const newEntidade = await entidade.save();
    res.redirect(`entidades/${newEntidade.id}`);
  } catch {
    res.render("entidades/new", {
      entidade: entidade,
      errorMessage: "Error creating Entidade",
    });
    }
  })

  // Show Entidade Route
  router.get("/:id", async (req, res) => {
    try {
      const entidade = await Entidade.findById(req.params.id);
      //Mostrar Pontos do user
      res.render("entidades/show", {
        entidade: entidade,
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });


//Edit Entidade Route
router.get("/:id/edit", async (req, res) => {
  try {
    const entidade = await Entidade.findById(req.params.id);
    res.render("entidades/edit", { entidade: entidade });
  } catch {
    res.redirect("/entidades");
  }
});


//Update Entidade Route
router.put("/:id", upload.single("logo"), async (req, res) => {
  let entidade;

  try {
    entidade = await Entidade.findById(req.params.id);
    entidade.name = req.body.name
    entidade.email = req.body.email

    if (req.file != null)  {
      removeLogo(entidade.companyLogo);
      entidade.companyLogo = req.file.filename;
    }

    await entidade.save();
    res.redirect(`/entidades/${entidade.id}`);
    
  } catch  {
    if (entidade == null){
      res.redirect("/");
    }else{
      res.render("entidades/edit", {
        entidade: entidade,
        errorMessage: "Error updating Entidade",
      });
        }
  }
});

  // Delete Entidade Page
  router.delete("/:id", async (req, res) => {
    try {
      const entidade = await Entidade.findById(req.params.id)
      await Entidade.deleteOne({ _id: req.params.id });
      res.redirect("/entidades");

    } catch  {
      if (entidade != null) {
        res.render("entidades/show" , {
           entidade: entidade,
            errorMessage: "Could not remove entidade"
          })
      } else {
      res.redirect("/");
      }
    }
  })


function removeLogo(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

module.exports = router;









    /*
PROVALMENTE VAI TER QUE HAVE AQUI VERIFICACOES TIPO:
SE O PROCESSO DE DOACAO O DINHEIRO JA TIVER SAIDO DO BANCO
OU JA TER PASSADO 3 OU 4 DIAS
*/
