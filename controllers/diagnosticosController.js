const db = require('../config/db'); // Asegúrate que este archivo use pool.promise()

// Crear un nuevo diagnóstico
exports.crearDiagnostico = async (req, res) => {
    console.log('📥 Datos recibidos en backend:', req.body);

    const {
        nombre,
        apellido,
        correo_electronico,
        pais_codigo,
        telefono,
        cargo,
        tamano_empresa,
        mensaje,
        autorizacion_datos
    } = req.body;

    if (!nombre || !apellido || !correo_electronico || !telefono || !cargo || !tamano_empresa) {
        console.warn('⚠️ Faltan campos obligatorios');
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const sql = `
        INSERT INTO diagnosticos_gratuitos 
        (nombre, apellido, correo_electronico, pais_codigo, telefono, cargo, tamano_empresa, mensaje, autorizacion_datos) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nombre,
        apellido,
        correo_electronico,
        pais_codigo,
        telefono,
        cargo,
        tamano_empresa,
        mensaje || '',
        autorizacion_datos ? 1 : 0
    ];

    try {
        const [result] = await db.query(sql, valores);
        console.log('✅ Diagnóstico guardado con éxito. ID:', result.insertId);
        return res.status(200).json({ message: 'Diagnóstico registrado con éxito' });
    } catch (err) {
        console.error('❌ Error al guardar el diagnóstico:', err.message);
        return res.status(500).json({ message: 'Error al guardar el diagnóstico' });
    }
};

// Obtener todos los diagnósticos
exports.obtenerDiagnosticos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM diagnosticos_gratuitos ORDER BY fecha_registro DESC');
        return res.status(200).json(rows);
    } catch (err) {
        console.error('❌ Error al obtener diagnósticos:', err.message);
        return res.status(500).json({ message: 'Error al obtener los diagnósticos' });
    }
};

// Eliminar un diagnóstico por ID
exports.eliminarDiagnostico = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM diagnosticos_gratuitos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Diagnóstico no encontrado' });
        }

        return res.status(200).json({ message: 'Diagnóstico eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar diagnóstico:', err.message);
        return res.status(500).json({ message: 'Error al eliminar el diagnóstico' });
    }
};
