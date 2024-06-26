//routes\doacoes.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs"); //File system permite apagar logos desnecessario

const Doacao = require("../models/doacao");
const User = require("../models/user");
const Entidade = require("../models/entidade");

// Rota para listar todas as doacoes
router.get("/", async (req, res) => {
  try {
    let query = Doacao.find({}); //consegue ir buscar dados a outro modelo
    if (req.query.user != null && req.query.user != "") {
      query = query
        .populate("user")
        .regex("user", new RegExp(req.query.user, "i")); //populate vai buscar pelo Mongo ao user
    }
    if (req.query.entidade != null && req.query.entidade != "") {
      query = query
        .populate("entidade")
        .regex("entidade", new RegExp(req.query.entidade, "i"));
    }

    if (req.query.dataBefore != null && req.query.dataBefore != "") {
      query = query.lte("data", req.query.dataBefore);
    }

    if (req.query.dataAfter != null && req.query.dataAfter != "") {
      query = query.gte("data", req.query.dataAfter);
    }

    const doacoes = await query.exec();
    res.render("doacoes/index", {
      doacoes: doacoes,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Doacao Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Doacao());
});

// Create Doacao Route
router.post("/", async (req, res) => {

  // Remova espacos em branco do userID
  const userId = req.body.user.trim();
  const entidadeId = req.body.entidade.trim(); 

  const doacao = new Doacao({
    user: userId,
    entidade: entidadeId, 
    preco: req.body.preco,
    estado: req.body.estado,
    data: new Date(req.body.data),
    observacoes: req.body.observacoes,
  });

  try {
    const newDoacao = await doacao.save();
    res.redirect(`doacoes/${newDoacao.id}`);
  } catch {
    renderNewPage(res, doacao, true);
  }
});

//Show Doacao Route
router.get("/:id", async (req, res) => {
  console.log;
  try {
    
    const doacao = await Doacao.findById(req.params.id).populate("user").exec();
    await Doacao.findById(req.params.id).populate("entidade").exec();
    res.render("doacoes/show", { doacao: doacao });

  } catch (err) {
    console.error("Error updating doacao:", err);
    res.redirect("/");
  }
});

// Edit Doacao Route
router.get("/:id/edit", async (req, res) => {
  try {
    const doacao = await Doacao.findById(req.params.id);
    renderEditPage(res, doacao);

  } catch {
    res.redirect("/");
  }
});

// Update Doacao Route
router.put("/:id", async (req, res) => {
  console.log("Update Doacao Route triggered");
  let doacao;

  try {
    console.log("Updating doacao:", req.params.id); // Log para verificar o ID da doacao sendo atualizada

    const doacao = await Doacao.findByIdAndUpdate(
      req.params.id,
      {
        user: req.body.user.trim(),
        entidade: req.body.user.trim(), //ACRESCENTEI
        preco: req.body.preco,
        estado: req.body.estado,
        data: new Date(req.body.data),
        observacoes: req.body.observacoes,
      },
      { new: true }
    ); // O parametro { new: true } retorna o documento atualizado

    console.log("Updated doacao:", doacao); // Log para verificar a doacao apos a atualizacao
    await doacao.save();
    console.log("Doacao updated successfully"); // Log para verificar se a atualizacao foi bem-sucedida
    res.redirect(`/doacoes/${doacao.id}`);
  } catch (error) {
    console.error("Error updating doacao:", error); // Log se houver um erro durante a atualizacao
    
    if (doacao != null) {
      renderEditPage(res, doacao, true);

    } else {
      redirect("/");
    }
  }
});

// Delete Doacao Page
router.delete("/:id", async (req, res) => {
  let doacao;
  try {
    doacao = await Doacao.findById(req.params.id);
    if (!doacao) {
      return res.redirect("/");
    }
    /*
PROVALMENTE VAI TER QUE HAVE AQUI VERIFICACOES TIPO:
SE O PROCESSO DE DOACAO O DINHEIRO JA TIVER SAIDO DO BANCO
OU JA TER PASSADO 3 OU 4 DIAS
*/
    await Doacao.deleteOne({ _id: req.params.id });
    res.redirect("/doacoes");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.redirect("/");
  }
});

async function renderNewPage(res, doacao, hasError = false) {
  renderFormPage(res, doacao, "new", hasError);
}

async function renderEditPage(res, doacao, hasError = false) {
  renderFormPage(res, doacao, "edit", hasError);
}

async function renderFormPage(res, doacao, form, hasError = false) {
  try {
    const users = await User.find({});
    const entidades = await Entidade.find({});
    const params = {
      users: users,
      entidades: entidades,
      doacao: doacao,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating doacao";
      } else {
        params.errorMessage = "Error Creating doacao";
      }
    }
    res.render(`doacoes/${form}`, params);
  } catch {
    res.redirect("/doacoes");
  }
}

module.exports = router;
