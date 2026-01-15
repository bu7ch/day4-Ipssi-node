const app = require('../server')
const User = require("../models/User")
const mongoose = require("mongoose")
const request = require("supertest");
const Auteur = require('../models/Auteur');
const Livre = require('../models/Livre');
beforeAll(async ()=>{
    process.env.NODE_ENV = 'test';
    await require('../config/mongo.config')()
});
beforeEach(async ()=>{
    await User.deleteMany({})
});
afterAll(async () => {
    await mongoose.connection.close()
});
describe("API authentication with MongoDB", ()=>{
    it("Devrait enregistrer un nouvel utilisateur avec succès", async () =>{
        const email = "test_register@exemple.fr";
        const motDePasse = "password123";

        const res= await request(app)
            .post("/api/auth/register")
            .send({
                email:email,
                motDePasse: motDePasse
            })
            expect(res.statusCode).toEqual(201);
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe("string");
        const user = await User.findOne({email});
            expect(user).toBeTruthy();
            expect(user.email).toEqual(email);

            expect(user.motDePasse).not.toEqual(motDePasse);
            expect(user.motDePasse.length).toBeGreaterThan(20);
    });
    it("devrait apres une connection d'un user retourner un token", async () =>{
        await request(app)
        .post('/api/auth/register')
        .send({
            email:"login_mongo@exemple.com",
            motDePasse:"password123"
        });
        const res = await request(app)
        .post("/api/auth/login")
        .send({
            email:"login_mongo@exemple.com",
            motDePasse:"password123"
        })
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    })
    it("devrait refuser l'enregistrement avec un email existant", async () => {
        await request(app)
          .post("/api/auth/register")
          .send({
            email: "test_mongodb_exist@example.com",
            motDePasse: "password123",
          });
        const res = await request(app)
          .post("/api/auth/register")
          .send({
            email: "test_mongodb_exist@example.com",
            motDePasse: "password123",
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Cet email est déjà utilisé.");
    });
      it("devrait refuser la connexion avec un mauvais mot de passe", async () => {
        await request(app)
          .post("/api/auth/register")
          .send({
            email: "login_mongodb@example.com",
            motDePasse: "password123",
          });
        
        const res = await request(app)
          .post("/api/auth/login")
          .send({
            email: "login_mongodb@example.com",
            motDePasse: "mauvais_password",
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Identifiants invalides.");
    });
})
describe("API Bibliothèque - Auteurs et Livres", () => {
    let token;
  
    beforeAll(async () => {
      await request(app)
      .post("/api/auth/register")
      .send({ email: "user_bibliotheque@test.com", motDePasse: "testpass123" });
      const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user_bibliotheque@test.com", motDePasse: "testpass123" });
      token = res.body.token;
    });
  
    beforeEach(async () => {
      await Auteur.deleteMany({});
      await Livre.deleteMany({});
    });
  
    it("devrait créer un auteur avec succès", async () => {
      const res = await request(app)
        .post("/api/auteurs")
        .send({
          nom: "Victor Hugo",
          nationalite: "Française"
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.nom).toEqual("Victor Hugo");
      expect(res.body.nationalite).toEqual("Française");
    });
  
    it("devrait créer un livre avec authentification", async () => {
      const auteur = await Auteur.create({
        nom: "Jules Verne",
        nationalite: "Française"
      });
  
      const res = await request(app)
        .post("/api/livres")
        .set("Authorization", `Bearer ${token}`)
        .send({
          titre: "Vingt mille lieues sous les mers",
          anneePublication: 1870,
          auteurId: auteur._id.toString()
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.titre).toEqual("Vingt mille lieues sous les mers");
      expect(res.body.anneePublication).toEqual(1870);
      expect(res.body.auteurId).toHaveProperty("nom", "Jules Verne");
    });
  
    it("devrait refuser la création d'un livre sans token", async () => {
      const auteur = await Auteur.create({
        nom: "Albert Camus",
        nationalite: "Française"
      });
  
      const res = await request(app)
        .post("/api/livres")
        .send({
          titre: "L'Étranger",
          anneePublication: 1942,
          auteurId: auteur._id.toString()
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Aucun token, autorisation refusée.");
    });
  });
  
  