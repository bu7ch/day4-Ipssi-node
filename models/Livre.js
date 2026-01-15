const mongoose = require("mongoose")
const livreSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
    },
    anneePublication: {
        type: Number,
        required: true
    },
    auteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auteur',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Livre = mongoose.model("Livre", livreSchema)
module.exports = Livre;