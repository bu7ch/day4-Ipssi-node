const mongoose = require('mongoose')
const auteurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    nationalite: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Auteur = mongoose.model("Auteur", auteurSchema)
module.exports = Auteur;