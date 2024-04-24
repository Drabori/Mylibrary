//routes\users.js
const express = require("express");
const router = express.Router();
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
    // res.redirect(`users/${newUser.id}`)
    res.redirect('users');
  } catch {
    res.render("users/new", {
      user: user,
      errorMessage: "Error creating Author",
    });
  }
});
module.exports = router;
