const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Crear nuevo registro PQRSF
exports.crearPQRSF = async (req, res) => {
    const {
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        correo_electronico,
        telefono_principal,
        telefono_adicional,
        objeto,
        descripcion,
        autorizacion_datos
    } = req.body;

    if (!tipo_documento || !numero_documento || !nombres || !apellidos || !correo_electronico || !telefono_principal || !objeto || !descripcion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const archivos = req.files?.map(file => file.filename) || [];

        const sql = `
            INSERT INTO pqrsf (
                tipo_documento,
                numero_documento,
                nombres,
                apellidos,
                correo_electronico,
                telefono_principal,
                telefono_adicional,
                objeto,
                descripcion,
                archivos,
                autorizacion_datos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            tipo_documento,
            numero_documento,
            nombres,
            apellidos,
            correo_electronico,
            telefono_principal,
            telefono_adicional || null,
            objeto,
            descripcion,
            archivos.length ? JSON.stringify(archivos) : null,
            autorizacion_datos ? 1 : 0
        ];

        const [result] = await db.query(sql, valores);
        res.status(201).json({ message: 'Formulario PQRSF enviado con éxito', id: result.insertId });
    } catch (error) {
        console.error('❌ Error al insertar PQRSF:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// Obtener todos los registros
exports.obtenerPQRSF = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pqrsf ORDER BY id DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('❌ Error al obtener PQRSF:', error);
        res.status(500).json({ message: 'Error al obtener registros' });
    }
};

// Obtener uno por ID
exports.obtenerPQRSFPorId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pqrsf WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('❌ Error al buscar PQRSF:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar por ID
exports.actualizarPQRSF = async (req, res) => {
    const {
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        correo_electronico,
        telefono_principal,
        telefono_adicional,
        objeto,
        descripcion,
        archivos,
        autorizacion_datos
    } = req.body;

    try {
        const sql = `
            UPDATE pqrsf SET
                tipo_documento = ?,
                numero_documento = ?,
                nombres = ?,
                apellidos = ?,
                correo_electronico = ?,
                telefono_principal = ?,
                telefono_adicional = ?,
                objeto = ?,
                descripcion = ?,
                archivos = ?,
                autorizacion_datos = ?
            WHERE id = ?
        `;

        const valores = [
            tipo_documento,
            numero_documento,
            nombres,
            apellidos,
            correo_electronico,
            telefono_principal,
            telefono_adicional || null,
            objeto,
            descripcion,
            archivos ? JSON.stringify(archivos) : null,
            autorizacion_datos ? 1 : 0,
            req.params.id
        ];

        const [result] = await db.query(sql, valores);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado para actualizar' });
        }

        res.status(200).json({ message: 'Registro actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error al actualizar PQRSF:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar por ID
exports.eliminarPQRSF = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT archivos FROM pqrsf WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        let archivos = [];
        try {
            archivos = JSON.parse(rows[0].archivos);
            if (!Array.isArray(archivos)) archivos = [];
        } catch (err) {
            console.warn('⚠️ Error al parsear archivos:', err.message);
            archivos = [];
        }

        const [result] = await db.query('DELETE FROM pqrsf WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        console.log("🧹 Archivos a eliminar:", archivos);

        archivos.forEach(nombreArchivo => {
            const rutaArchivo = path.join(__dirname, '..', 'uploads', nombreArchivo);
            fs.access(rutaArchivo, fs.constants.F_OK, (err) => {
                if (err) {
                    console.warn(`⚠️ Archivo no encontrado: ${rutaArchivo}`);
                } else {
                    fs.unlink(rutaArchivo, (err) => {
                        if (err) {
                            console.error(`❌ Error al eliminar archivo ${rutaArchivo}:`, err.message);
                        } else {
                            console.log(`✅ Archivo eliminado correctamente: ${rutaArchivo}`);
                        }
                    });
                }
            });
        });

        res.status(200).json({ message: 'Registro y archivos eliminados correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar PQRSF:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
