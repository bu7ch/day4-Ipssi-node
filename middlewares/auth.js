require("dotenv").config()
const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    const authHeader = req.header("Authorization");

    if(!authHeader){
        return res.status(401).json({message:'Aucun token, autorisation refusée.'})
    }
    const parts = authHeader.split(' ');
    if(parts.length !== 2|| parts[0]!== 'Bearer'){
        return res.status(401).json({message:"Format de token invalide. Utilisez : Bearer <token>"})
    }
    const token = parts[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user;
        next()
    }catch(err){
        res.status(401).json({message:"Token non valide."})
    }
}