const express = require('express');
const router = express.Router();

const {
    crearPQRSF,
    obtenerPQRSF,
    obtenerPQRSFPorId,
    actualizarPQRSF,
    eliminarPQRSF
} = require('../controllers/pqrsfController');

// Crear nuevo PQRSF
router.post('/', crearPQRSF);

// Obtener todos los registros
router.get('/', obtenerPQRSF);

// Obtener uno por ID
router.get('/:id', obtenerPQRSFPorId);

// Actualizar un registro (en el futuro si implementas actualización)
router.put('/:id', actualizarPQRSF);

// Eliminar uno por ID (también elimina archivos en Supabase)
router.delete('/:id', eliminarPQRSF);

module.exports = router;
