const validate = require("../middlewares/validate");
const Auteur = require("../models/Auteur");
const Livre = require("../models/Livre");
const { auteurSchema } = require("../validation/schemas");

const router = require("express").Router()

router.post("/", validate(auteurSchema), async (req, res) => {
    try {
      const nouvelAuteur = await Auteur.create(req.body);
      res.status(201).json(nouvelAuteur);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
router.get("/", async (req, res) => {
    try {
      const auteurs = await Auteur.find().sort({ createdAt: -1 });
      res.status(200).json(auteurs);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des auteurs: " + error.message });
    }
  });
  
router.get("/:id", async (req, res) => {
    try {
      const auteur = await Auteur.findById(req.params.id);
      if (!auteur) {
        return res.status(404).json({ message: "Auteur non trouvé." });
      }
  
      const livres = await Livre.find({ auteurId: req.params.id });
      
      res.status(200).json({
        ...auteur.toObject(),
        livres: livres
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur: " + error.message });
    }
  });

module.exports = router;