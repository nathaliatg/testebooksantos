require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reservationsRouter = require('./routes/reservations');
const contactsRouter = require('./routes/contacts'); 
const db = require('./utils/db'); // Garante que a conexão com o banco seja inicializada

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Middleware
app.use(cors()); // Permite requisições de diferentes origens (para o frontend)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rotas
app.use('/api/reservations', reservationsRouter);
app.use('/api/contacts', contactsRouter); 

// Rota para buscar apartamentos e contatos (necessário para o formulário de reserva)
app.get('/api/apartments', (req, res) => {
    db.all('SELECT id, title, city, state, daily_rate FROM apartments', [], (err, rows) => { // <-- ADICIONADO daily_rate AQUI
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/contacts', (req, res) => {
    db.all('SELECT id, name, email FROM contacts', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});