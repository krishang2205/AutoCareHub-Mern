const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // For using environment variables

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust as needed for frontend
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vehicle_portal'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Create tables if they do not exist
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL
    );
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log('Users table created successfully');
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      model VARCHAR(255) NOT NULL,
      registration_number VARCHAR(255) NOT NULL,
      vehicle_type ENUM('car', 'bike') NOT NULL,
      purchase_date DATE NOT NULL,
      image_url TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `, (err) => {
    if (err) console.error('Error creating vehicles table:', err);
    else console.log('Vehicles table created successfully');
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS maintenance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_id INT,
      maintenance_type VARCHAR(255) NOT NULL,
      maintenance_date DATE NOT NULL,
      cost DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );
  `, (err) => {
    if (err) console.error('Error creating maintenance table:', err);
    else console.log('Maintenance table created successfully');
  });
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
      [username, hashedPassword, name],
      (err) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).json({ error: 'Error registering user' });
          return;
        }
        res.json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err || results.length === 0) {
        console.error('Login error:', err);
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
      res.json({ token, name: user.name });
    }
  );
});

// Middleware for authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Vehicle Routes
app.post('/api/vehicles', authenticateToken, (req, res) => {
  const { model, registration_number, vehicle_type, purchase_date, image_url } = req.body;

  db.query(
    'INSERT INTO vehicles (user_id, model, registration_number, vehicle_type, purchase_date, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, model, registration_number, vehicle_type, purchase_date, image_url],
    (err) => {
      if (err) {
        console.error('Error adding vehicle:', err);
        res.status(500).json({ error: 'Error adding vehicle' });
        return;
      }
      res.json({ message: 'Vehicle added successfully' });
    }
  );
});

app.get('/api/vehicles', authenticateToken, (req, res) => {
  db.query(
    'SELECT * FROM vehicles WHERE user_id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error('Error fetching vehicles:', err);
        res.status(500).json({ error: 'Error fetching vehicles' });
        return;
      }
      res.json(results);
    }
  );
});

// Maintenance Routes
app.post('/api/maintenance', authenticateToken, (req, res) => {
  const { vehicle_id, maintenance_type, maintenance_date, cost } = req.body;

  db.query(
    'INSERT INTO maintenance (vehicle_id, maintenance_type, maintenance_date, cost) VALUES (?, ?, ?, ?)',
    [vehicle_id, maintenance_type, maintenance_date, cost],
    (err) => {
      if (err) {
        console.error('Error adding maintenance record:', err);
        res.status(500).json({ error: 'Error adding maintenance record' });
        return;
      }
      res.json({ message: 'Maintenance record added successfully' });
    }
  );
});

app.get('/api/maintenance/:vehicleId', authenticateToken, (req, res) => {
  db.query(
    'SELECT * FROM maintenance WHERE vehicle_id = ?',
    [req.params.vehicleId],
    (err, results) => {
      if (err) {
        console.error('Error fetching maintenance records:', err);
        res.status(500).json({ error: 'Error fetching maintenance records' });
        return;
      }
      res.json(results);
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
