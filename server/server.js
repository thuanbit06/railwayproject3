const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/schedules', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, t.train_name 
            FROM schedules s 
            JOIN trains t ON s.train_id = t.train_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    const { passenger_name, passenger_email, schedule_id, seat_number } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO bookings (passenger_name, passenger_email, schedule_id, seat_number, status) 
             VALUES (?, ?, ?, ?, 'PENDING')`,
            [passenger_name, passenger_email, schedule_id, seat_number]
        );
        res.json({ booking_id: result.insertId, message: 'Tạo đơn đặt vé thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/payments', async (req, res) => {
    const { booking_id, amount, payment_method } = req.body;
    try {
        await db.query(
            `INSERT INTO payments (booking_id, amount, payment_method, payment_status) VALUES (?, ?, ?, 'SUCCESS')`,
            [booking_id, amount, payment_method]
        );
        await db.query(`UPDATE bookings SET status = 'CONFIRMED' WHERE booking_id = ?`, [booking_id]);
        
        res.json({ success: true, message: 'Thanh toán thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));