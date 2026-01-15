require("dotenv").config()
const router = require("express").Router()
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const validate = require('../middlewares/validate');
const { userSchema } = require("../validation/schemas");



router.post("/register", validate(userSchema),async (req, res) => {
    const { email, motDePasse } = req.body;
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." })
        }
        const salt = await bcrypt.genSalt(10);
        const motDePasseHashed = await bcrypt.hash(motDePasse, salt);
        user = await User.create({
            email, 
            motDePasse: motDePasseHashed 
        });
        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Erreur serveur.");
    }
})
router.post("/login", validate(userSchema), async (req,res)=>{
    const {email, motDePasse} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'Identifiants invalides.'})
        }
        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if(!isMatch){
            return res.status(400).json({message: 'Identifiants invalides.'})
        }
        const payload = {user: {id:user._id}};
        const token  = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"})
        res.status(200).json({user,token})
    }catch(error){
            console.error(error.message);
            res.status(500).json("Erreur serveur")
    }
})


module.exports = router