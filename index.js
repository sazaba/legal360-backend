const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 👉 Cargar configuración según el entorno
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.local' });
} else {
    require('dotenv').config();
}

// 👉 Crear carpetas de subida si no existen
const uploadsDir = path.join(__dirname, 'uploads');
const blogDir = path.join(uploadsDir, 'blog');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('🗂️ Carpeta /uploads creada');
}
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir);
    console.log('🗂️ Carpeta /uploads/blog creada');
}


// Rutas existentes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const diagnosticoRoutes = require('./routes/diagnosticoRoutes');
const pqrsfRoutes = require('./routes/pqrsfRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://legal360.co', 'https://www.legal360.co'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api', diagnosticoRoutes);
app.use('/api/pqrsf', pqrsfRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/blog', express.static('uploads/blog'));
app.use('/api/blog', blogRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});
