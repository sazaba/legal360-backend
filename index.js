const express = require('express');
const cors = require('cors');
// 👉 Cargar configuración según el entorno
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.local' });
} else {
    require('dotenv').config();
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
app.use('/api/pqrsf', pqrsfRoutes); // Ruta para el formulario PQRSF
app.use('/uploads', express.static('uploads'));
app.use('/uploads/blog', express.static('uploads/blog'));
app.use('/api/blog', blogRoutes);


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});
