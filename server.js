const express = require("express")
const connectDB = require("./config/mongo.config")
const app= express();
const port =  3000;

connectDB()


app.use(express.json())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/auteurs", require("./routes/auteur"))
app.use("/api/livres", require("./routes/livre"))


app.listen(port, ()=>{
    console.log(`Serveur demarré sur http://localhosst:${port}`)
})

module.exports = app;
