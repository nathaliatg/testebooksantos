const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    db.serialize(() => {
      // Criar tabela apartments
      db.run(`CREATE TABLE IF NOT EXISTS apartments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        max_guests INTEGER NOT NULL,
        daily_rate REAL NOT NULL
      )`);

      // Criar tabela contacts
      db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        type TEXT CHECK(type IN ('individual', 'company')) NOT NULL,
        document TEXT UNIQUE NOT NULL
      )`);

      // Criar tabela reservations
      db.run(`CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        apartment_id INTEGER NOT NULL,
        contact_id INTEGER NOT NULL,
        checkin_date TEXT NOT NULL,
        checkout_date TEXT NOT NULL,
        guests INTEGER NOT NULL,
        total_price REAL NOT NULL,
        channel TEXT CHECK(channel IN ('airbnb', 'booking.com', 'direto')) NOT NULL,
        FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
      )`);

      console.log('Tabelas criadas ou já existentes.');

      // Opcional: Inserir dados de exemplo
      db.run(`INSERT OR IGNORE INTO apartments (id, title, city, state, max_guests, daily_rate) VALUES
        (1, 'Apartamento Acolhedor', 'Curitiba', 'PR', 4, 150.00),
        (2, 'Loft Moderno', 'São Paulo', 'SP', 2, 200.00),
        (3, 'Casa na Praia', 'Florianópolis', 'SC', 6, 300.00)
      `);

      db.run(`INSERT OR IGNORE INTO contacts (id, name, email, phone, type, document) VALUES
        (1, 'João Silva', 'joao.silva@email.com', '41999998888', 'individual', '11122233344'),
        (2, 'Maria Oliveira', 'maria.olivera@email.com', '11988887777', 'individual', '55566677788'),
        (3, 'Empresa XYZ Ltda.', 'contato@xyz.com', '21977776666', 'company', '00111222000133')
      `);

      // As datas devem estar no formato 'YYYY-MM-DD'
      // Coloque o db.close() no callback da última inserção
      db.run(`INSERT OR IGNORE INTO reservations (id, apartment_id, contact_id, checkin_date, checkout_date, guests, total_price, channel) VALUES
        (1, 1, 1, '2025-06-10', '2025-06-15', 2, 750.00, 'airbnb'),
        (2, 2, 2, '2025-06-12', '2025-06-14', 1, 400.00, 'booking.com'),
        (3, 1, 3, '2025-07-01', '2025-07-05', 3, 600.00, 'direto'),
        (4, 3, 1, '2025-05-20', '2025-05-25', 4, 1500.00, 'airbnb')
      `, function(err) { // <<< Adicione um callback aqui
        if (err) {
          console.error('Erro ao inserir dados de exemplo de reservas:', err.message);
        } else {
          console.log('Dados de exemplo inseridos ou já existentes.');
        }

        // Agora sim, feche a conexão DEPOIS que a última operação (inserção de reservas) terminar
        db.close((err) => {
          if (err) {
            console.error('Erro ao fechar a conexão do banco de dados:', err.message);
          } else {
            console.log('Conexão com o banco de dados fechada.');
          }
        });
      }); // <<< Fechamento do db.run da última inserção
    }); // <<< Fechamento do db.serialize
  }
});