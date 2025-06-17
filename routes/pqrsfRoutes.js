const express = require('express');
const upload = require('../config/multerConfig');

const router = express.Router();
const {
    crearPQRSF,
    obtenerPQRSF,
    obtenerPQRSFPorId,
    actualizarPQRSF,
    eliminarPQRSF
} = require('../controllers/pqrsfController');

// Crear nuevo PQRSF
router.post('/', upload.array('archivos[]', 5), crearPQRSF);

// Obtener todos los registros
router.get('/', obtenerPQRSF);

// Obtener uno por ID
router.get('/:id', obtenerPQRSFPorId);

// Actualizar uno por ID
router.put('/:id', actualizarPQRSF);

// Eliminar uno por ID
router.delete('/:id', eliminarPQRSF);

module.exports = router;
