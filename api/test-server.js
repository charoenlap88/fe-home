const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost', 'http://localhost:80', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Test API without MySQL dependency
app.get('/api/db/databases', async (req, res) => {
  console.log('API /api/db/databases called');
  
  // Mock data for testing
  res.json(['information_schema', 'mysql', 'performance_schema', 'sys', 'iot_db']);
});

app.get('/api/db/tables', async (req, res) => {
  const { db } = req.query;
  console.log('API /api/db/tables called for db:', db);
  
  // Mock data for testing
  if (db === 'iot_db') {
    res.json(['User', 'Device', 'Log']);
  } else {
    res.json([]);
  }
});

app.get('/api/db/table-data', async (req, res) => {
  const { db, table } = req.query;
  console.log('API /api/db/table-data called for:', db, table);
  
  // Mock data for testing
  if (table === 'User') {
    res.json({
      rows: [
        { id: 1, username: 'admin', password: 'admin123', createdAt: '2024-01-01' }
      ],
      columns: ['id', 'username', 'password', 'createdAt']
    });
  } else {
    res.json({ rows: [], columns: [] });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Test server running without MySQL'
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Test Server running on port ${PORT}`);
  console.log(`📊 Mock database endpoints available`);
});
