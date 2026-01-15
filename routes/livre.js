const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const Auteur = require("../models/Auteur");
const Livre = require("../models/Livre");
const { livreSchema } = require("../validation/schemas");

const router = require("express").Router()

router.post("/", auth, validate(livreSchema), async (req, res) => {
    try {
      const auteur = await Auteur.findById(req.body.auteurId);
      if (!auteur) {
        return res.status(404).json({ message: "Auteur non trouvé." });
      }
  
      const nouveauLivre = await Livre.create(req.body);
      
      const livreAvecAuteur = await Livre.findById(nouveauLivre._id).populate('auteurId', 'nom nationalite');
      
      res.status(201).json(livreAvecAuteur);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const livres = await Livre.find()
        .populate('auteurId', 'nom nationalite')
        .sort({ createdAt: -1 });
      res.status(200).json(livres);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des livres: " + error.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const livre = await Livre.findById(req.params.id)
        .populate('auteurId', 'nom nationalite');
  
      if (!livre) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }
  
      res.status(200).json(livre);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur: " + error.message });
    }
  });
  
  router.put("/:id", async (req, res) => {
    try {
      const livre = await Livre.findById(req.params.id);
      if (!livre) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }
  
      if (req.body.auteurId) {
        const auteur = await Auteur.findById(req.body.auteurId);
        if (!auteur) {
          return res.status(404).json({ message: "Auteur non trouvé." });
        }
      }
  
      const livreMisAJour = await Livre.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('auteurId', 'nom nationalite');
  
      res.status(200).json(livreMisAJour);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la mise à jour du livre: " + error.message });
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const livre = await Livre.findById(req.params.id);
      if (!livre) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }
  
      await Livre.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Livre supprimé avec succès." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du livre: " + error.message });
    }
  });

  module.exports = router;
  