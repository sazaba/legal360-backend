const express = require('express');
const router = express.Router();
const {
    crearDiagnostico,
    obtenerDiagnosticos,
    eliminarDiagnostico
} = require('../controllers/diagnosticosController');

// Crear un nuevo diagnóstico
router.post('/diagnostico', crearDiagnostico);

// Obtener todos los diagnósticos
router.get('/diagnosticos', obtenerDiagnosticos);

// Eliminar un diagnóstico por ID
router.delete('/diagnosticos/:id', eliminarDiagnostico);

module.exports = router;
