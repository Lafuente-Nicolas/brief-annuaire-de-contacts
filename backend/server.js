// backend/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connexion à SQLite
const db = new sqlite3.Database('contacts.db');

// Création de la table si elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  poste TEXT NOT NULL,
  typeDeContact TEXT NOT NULL CHECK (typeDeContact IN ('Client', 'Fournisseur')),
  description TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT NOT NULL,
  photoUrl TEXT
)`);

//  Route GET - récupérer tous les contacts
app.get('/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', [], (err, rows) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.json(rows);
  });
});


//  Route POST - ajouter un contact
app.post('/contacts', (req, res) => {
    const { nom, poste, typeDeContact, description, email, telephone, photoUrl } = req.body;
  
    if (typeDeContact !== 'Client' && typeDeContact !== 'Fournisseur') {
      return res.status(400).json({ erreur: 'typeDeContact invalide' });
    }
  
    const sql = `INSERT INTO contacts (nom, poste, typeDeContact, description, email, telephone, photoUrl)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    const params = [nom, poste, typeDeContact, description, email, telephone, photoUrl];
  
    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ erreur: err.message });
  
      res.status(201).json({
        id: this.lastID,
        nom,
        poste,
        typeDeContact,
        description,
        email,
        telephone,
        photoUrl
      });
    });
  });
  
  app.listen(PORT, () => {
    console.log(` Serveur Node.js lancé sur http://localhost:${PORT}`);
  });