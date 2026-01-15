const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()
const connectDB = async () =>{
    try {
        const dbUri = process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_URI_TEST
        : process.env.MONGODB_URI
        await mongoose.connect(dbUri)
        console.log(`Connexion à MongoDB (${process.env.NODE_ENV || 'development'})`);
        
    } catch (error) {
        console.error("Erreur de connexion à MongoDB:", error.message)
        process.exit(1)
    }
}
module.exports = connectDB