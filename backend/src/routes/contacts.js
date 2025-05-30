const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Importa a conexão com o banco de dados

// [GET] Listar todos os contatos
router.get('/', (req, res) => {
  const sql = `SELECT id, name, email, phone FROM contacts ORDER BY name ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// [POST] Criar um novo contato
router.post('/', (req, res) => {
  const { name, email, phone } = req.body;

  // Validação básica
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios para o contato.' });
  }

  const sql = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, phone], function(err) {
    if (err) {
      // Em caso de erro, verificar se é de contato duplicado (ex: email único)
      if (err.message.includes('UNIQUE constraint failed: contacts.email')) {
        return res.status(409).json({ error: 'Este email já está cadastrado para outro contato.' });
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, name, email, phone, message: 'Contato criado com sucesso!' });
  });
});

module.exports = router;