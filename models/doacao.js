//models\doacao.js
const mongoose = require('mongoose')

const doacaoSchema = new mongoose.Schema({
    //Nome Doador
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    //Futura Entidade
    entidade: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Entidade'
    },
    //Quanto vai doar
    preco:{
        type: Number,
        required: true
    },
    //Dia da doacao
    data:{
        type: Date,
        required: true
    },
    //Dia Criacao
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    //Observacoes
    observacoes: {
        type: String
      },
      estado: {
        type: String,
         enum: ['Inicio', 'Curso','Cancelado', 'Fim'], default: 'Inicio' },
})

module.exports = mongoose.model('Doacao', doacaoSchema)
