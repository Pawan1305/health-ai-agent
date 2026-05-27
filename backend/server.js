const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

function parseAllowedOrigins() {
  const single = process.env.CLIENT_URL || '';
  const multi = process.env.CLIENT_URLS || '';

  return [...new Set(
    [single, ...multi.split(',')]
      .map((v) => v.trim())
      .filter(Boolean)
  )];
}

const allowedOrigins = parseAllowedOrigins();
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/context', require('./routes/context'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🏥 MediMind AI API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 MediMind Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/health\n`);
  console.log(`[cors] allowed origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : '(none set)'}`);
  console.log(`[cors] allow vercel previews: ${allowVercelPreviews}\n`);
});
