const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Rota para obter todas as reservas
router.get('/', (req, res) => {
    const query = `
        SELECT
            r.*,
            a.title AS apartment_title,
            a.city AS apartment_city,
            a.state AS apartment_state,
            a.daily_rate AS apartment_daily_rate,
            c.name AS contact_name,
            c.email AS contact_email
        FROM
            reservations r
        JOIN
            apartments a ON r.apartment_id = a.id
        JOIN
            contacts c ON r.contact_id = c.id
        ORDER BY r.id ASC; -- Adicionada a ordenação por ID em ordem crescente
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar reservas:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Rota para obter métricas de reservas para o dashboard
router.get('/metrics', (req, res) => {
    db.get("SELECT COUNT(*) AS totalReservations, SUM(total_price) AS totalRevenue, AVG(guests) AS averageGuestsPerReservation FROM reservations", (err, metrics) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.all("SELECT channel, COUNT(*) AS count FROM reservations GROUP BY channel", (err, reservationsByChannel) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            db.all("SELECT a.title, COUNT(r.id) AS count FROM reservations r JOIN apartments a ON r.apartment_id = a.id GROUP BY a.title", (err, reservationsByApartment) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                db.all("SELECT c.name AS contact_name, c.email AS contact_email, COUNT(r.id) AS reservation_count FROM reservations r JOIN contacts c ON r.contact_id = c.id GROUP BY c.id, c.name, c.email ORDER BY reservation_count DESC LIMIT 5", (err, topContacts) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.json({
                        totalReservations: metrics.totalReservations || 0,
                        totalRevenue: metrics.totalRevenue || 0,
                        averageGuestsPerReservation: metrics.averageGuestsPerReservation || 0,
                        reservationsByChannel: reservationsByChannel.reduce((acc, item) => {
                            acc[item.channel] = item.count;
                            return acc;
                        }, {}),
                        reservationsByApartment: reservationsByApartment.reduce((acc, item) => {
                            acc[item.title] = item.count;
                            return acc;
                        }, {}),
                        topContacts: topContacts
                    });
                });
            });
        });
    });
});


// Rota para buscar reservas por termos de busca e filtros de data/cidade
router.get('/search', (req, res) => {
    const { searchTerm, startDate, endDate, city } = req.query;
    let query = `
        SELECT
            r.*,
            a.title AS apartment_title,
            a.city AS apartment_city,
            a.state AS apartment_state,
            a.daily_rate AS apartment_daily_rate,
            c.name AS contact_name,
            c.email AS contact_email
        FROM
            reservations r
        JOIN
            apartments a ON r.apartment_id = a.id
        JOIN
            contacts c ON r.contact_id = c.id
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        query += ` AND (
            a.title LIKE ? OR
            a.city LIKE ? OR
            a.state LIKE ? OR
            c.name LIKE ? OR
            c.email LIKE ? OR
            r.channel LIKE ?
        )`;
        const likeTerm = `%${searchTerm}%`;
        params.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
    }
    if (startDate) {
        query += ` AND r.checkin_date >= ?`;
        params.push(startDate);
    }
    if (endDate) {
        query += ` AND r.checkin_date <= ?`;
        params.push(endDate);
    }
    if (city) {
        query += ` AND a.city LIKE ?`;
        params.push(`%${city}%`);
    }

    query += ` ORDER BY r.id ASC;`; // Adicionando a ordenação também para a busca

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Erro ao buscar reservas filtradas:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Rota para criar uma nova reserva
router.post('/', (req, res) => {
    const { apartment_id, contact_id, checkin_date, checkout_date, guests, channel } = req.body;

    if (!apartment_id || !contact_id || !checkin_date || !checkout_date || !guests || !channel) {
        return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Calcular o número de diárias
    const start = new Date(checkin_date);
    const end = new Date(checkout_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return res.status(400).json({ error: "A data de check-out deve ser posterior à data de check-in." });
    }

    // Buscar a diária do apartamento para calcular o preço total
    db.get('SELECT daily_rate FROM apartments WHERE id = ?', [apartment_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Apartamento não encontrado." });
        }

        const dailyRate = row.daily_rate;
        const totalPrice = dailyRate * diffDays;

        const insertQuery = `
            INSERT INTO reservations (apartment_id, contact_id, checkin_date, checkout_date, guests, channel, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [apartment_id, contact_id, checkin_date, checkout_date, guests, channel, totalPrice];

        db.run(insertQuery, params, function(err) {
            if (err) {
                console.error("Erro ao inserir reserva:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, ...req.body, total_price: totalPrice });
        });
    });
});

// Rota para obter uma reserva por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT
            r.*,
            a.title AS apartment_title,
            a.city AS apartment_city,
            a.state AS apartment_state,
            a.daily_rate AS apartment_daily_rate,
            c.name AS contact_name,
            c.email AS contact_email
        FROM
            reservations r
        JOIN
            apartments a ON r.apartment_id = a.id
        JOIN
            contacts c ON r.contact_id = c.id
        WHERE r.id = ?
    `;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Reserva não encontrada." });
        }
        res.json(row);
    });
});


// Rota para atualizar uma reserva
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { apartment_id, contact_id, checkin_date, checkout_date, guests, channel } = req.body;

    if (!apartment_id || !contact_id || !checkin_date || !checkout_date || !guests || !channel) {
        return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Calcular o número de diárias e o preço total novamente
    const start = new Date(checkin_date);
    const end = new Date(checkout_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return res.status(400).json({ error: "A data de check-out deve ser posterior à data de check-in." });
    }

    db.get('SELECT daily_rate FROM apartments WHERE id = ?', [apartment_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Apartamento não encontrado." });
        }

        const dailyRate = row.daily_rate;
        const totalPrice = dailyRate * diffDays;

        const updateQuery = `
            UPDATE reservations
            SET apartment_id = ?, contact_id = ?, checkin_date = ?, checkout_date = ?, guests = ?, channel = ?, total_price = ?
            WHERE id = ?
        `;
        const params = [apartment_id, contact_id, checkin_date, checkout_date, guests, channel, totalPrice, id];

        db.run(updateQuery, params, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Reserva não encontrada ou nenhum dado alterado." });
            }
            res.json({ message: "Reserva atualizada com sucesso!", changes: this.changes, ...req.body, total_price: totalPrice });
        });
    });
});

// Rota para deletar uma reserva
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM reservations WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Reserva não encontrada." });
        }
        res.json({ message: "Reserva deletada com sucesso!", changes: this.changes });
    });
});

module.exports = router;