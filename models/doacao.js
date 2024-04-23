//models\doacao.js
const mongoose = require('mongoose')
const path = require('path')
//Define caminho onde sao armazenados os logotipos
const companyLogoBasePath = 'uploads/companyLogos'

const doacaoSchema = new mongoose.Schema({
    //Nome Doador
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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
    //logo Empresa
    companyLogo:{
        type:String,
        required:true
    },
    observacoes: {
        type: String
      }
    })

    //Retorna caminho para logo empresa da doacao
    doacaoSchema.virtual('coverImagePath').get(function() {
      if (this.companyLogo != null) {
          return path.join('/', companyLogoBasePath, this.companyLogo);
      }
})

module.exports = mongoose.model('Doacao', doacaoSchema)
module.exports.companyLogoBasePath = companyLogoBasePath