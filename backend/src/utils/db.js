const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erro ao conectar ou criar o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Usamos db.serialize para garantir que as operações de criação e inserção ocorram em ordem
        db.serialize(() => {
            // Tabela Apartments
            db.run(`CREATE TABLE IF NOT EXISTS apartments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                zip_code TEXT NOT NULL,
                number_of_rooms INTEGER NOT NULL,
                number_of_bathrooms INTEGER NOT NULL,
                max_guests INTEGER NOT NULL,
                daily_rate REAL NOT NULL -- <--- IMPORTANTE: GARANTIR QUE ESTÁ AQUI
            )`, (err) => {
                if (err) console.error("Erro ao criar tabela 'apartments':", err.message);
            });

            // Tabela Contacts
            db.run(`CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT
            )`, (err) => {
                if (err) console.error("Erro ao criar tabela 'contacts':", err.message);
            });

            // Tabela Reservations
            db.run(`CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                apartment_id INTEGER NOT NULL,
                contact_id INTEGER NOT NULL,
                checkin_date TEXT NOT NULL,
                checkout_date TEXT NOT NULL,
                guests INTEGER NOT NULL,
                channel TEXT NOT NULL,
                total_price REAL NOT NULL,
                FOREIGN KEY (apartment_id) REFERENCES apartments(id),
                FOREIGN KEY (contact_id) REFERENCES contacts(id)
            )`, (err) => {
                if (err) console.error("Erro ao criar tabela 'reservations':", err.message);
            });

            // Inserir dados de exemplo SE AS TABELAS ESTIVEREM VAZIAS
            // Verifica se a tabela apartments está vazia antes de inserir
            db.get("SELECT COUNT(*) as count FROM apartments", (err, row) => {
                if (err) {
                    console.error("Erro ao verificar apartamentos existentes:", err.message);
                    return;
                }
                if (row && row.count === 0) {
                    console.log("Inserindo dados de exemplo na tabela apartments...");
                    db.run("INSERT INTO apartments (title, address, city, state, zip_code, number_of_rooms, number_of_bathrooms, max_guests, daily_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        ["Apartamento Aconchegante", "Rua das Flores, 100", "Curitiba", "PR", "80000-000", 2, 1, 4, 150.00]
                    );
                    db.run("INSERT INTO apartments (title, address, city, state, zip_code, number_of_rooms, number_of_bathrooms, max_guests, daily_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        ["Loft Moderno", "Av. Paulista, 500", "São Paulo", "SP", "01310-000", 1, 1, 2, 200.00]
                    );
                    db.run("INSERT INTO apartments (title, address, city, state, zip_code, number_of_rooms, number_of_bathrooms, max_guests, daily_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        ["Cobertura com Vista", "Rua Beira Mar, 200", "Florianópolis", "SC", "88000-000", 3, 2, 6, 350.00]
                    );
                }
            });

            // Verifica se a tabela contacts está vazia antes de inserir
            db.get("SELECT COUNT(*) as count FROM contacts", (err, row) => {
                if (err) {
                    console.error("Erro ao verificar contatos existentes:", err.message);
                    return;
                }
                if (row && row.count === 0) {
                    console.log("Inserindo dados de exemplo na tabela contacts...");
                    db.run("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
                        ["Maria Silva", "maria.silva@email.com", "41998765432"]
                    );
                    db.run("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
                        ["João Souza", "joao.souza@email.com", "11987654321"]
                    );
                }
            });

            // Verifica se a tabela reservations está vazia antes de inserir
            db.get("SELECT COUNT(*) as count FROM reservations", (err, row) => {
                if (err) {
                    console.error("Erro ao verificar reservas existentes:", err.message);
                    return;
                }
                if (row && row.count === 0) {
                    console.log("Inserindo dados de exemplo na tabela reservations...");
                    // Certifique-se de que apartment_id e contact_id correspondem aos IDs gerados ou esperados
                    // (assumindo IDs 1, 2, 3 para apartamentos e 1, 2 para contatos dos inserts acima)
                    // total_price será calculado (ex: 150 * 5 = 750)
                    db.run("INSERT INTO reservations (apartment_id, contact_id, checkin_date, checkout_date, guests, channel, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [1, 1, '2024-06-01', '2024-06-06', 2, 'airbnb', 750.00]
                    );
                    // total_price será calculado (ex: 200 * 3 = 600)
                    db.run("INSERT INTO reservations (apartment_id, contact_id, checkin_date, checkout_date, guests, channel, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [2, 2, '2024-06-10', '2024-06-13', 1, 'direto', 600.00]
                    );
                }
            });
        });
    }
});

module.exports = db;