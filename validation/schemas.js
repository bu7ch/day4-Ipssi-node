const Joi = require('joi')

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().min(6).required()
});

const auteurSchema = Joi.object({
    nom: Joi.string().required(),
    nationalite: Joi.string().required()
})

const livreSchema = Joi.object({
    titre: Joi.string().required(),
    anneePublication: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
    auteurId: Joi.string().required()
});

module.exports = {
    userSchema, auteurSchema, livreSchema
}