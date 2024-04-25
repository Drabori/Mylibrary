//routes\users.js
const express = require("express");
const router = express.Router();

const Doacao = require("../models/doacao");
const User = require("../models/user");

//Todos utilizadores
router.get("/", async (req, res) => {
  //Cria array para pesquisar
  let searchOptions = {};
  //Verifica se name existe
  if (req.query.name != null && req.query.name !== "") {
    //RegExp -> tanto pode ser Maiuscula ou minuscula
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const users = await User.find(searchOptions);
    res.render("users/index", { users: users, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

//New User Route
router.get("/new", (req, res) => {
  res.render("users/new", { user: new User() });
});

// Create User Route
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
  });

  try {
    const newUser = await user.save();
    res.redirect(`users/${newUser.id}`);
  } catch {
    res.render("users/new", {
      user: user,
      errorMessage: "Error creating Author",
    });
  }
});

//Show user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const doacoes = await Doacao.find({ user: user.id }).limit(6).exec();
    res.render("users/show", {
      user: user,
      doacoesByUser: doacoes,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//Editar user
router.get("/:id/edit", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("users/edit", { user: user });
  } catch {
    res.redirect("/users");
  }
});

//Updating user
router.put("/:id", async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    user.name = req.body.name;
    await user.save();
    res.redirect(`/users/${user.id}`);
  } catch {
    //Se o user nao existir
    if (user == null) {
      res.redirect("/");
    } else {
      res.render("users/edit", {
        user: user,
        errorMessage: "Error updating User",
      });
    }
  }
});

//nunca se deve usar GET para apagar dados
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.redirect("/");
    }
    
    const doacoes = await Doacao.find({ user: user.id });
    if (doacoes.length > 0) {
      return res.redirect(`/users/${user.id}`);
    }
    
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/users");
  } catch(err) {
    console.error("Error deleting user:", err);
    res.redirect("/");
  }
});


module.exports = router;

