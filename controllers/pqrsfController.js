// ✅ Controlador completo usando Supabase Storage en lugar de Cloudinary
const db = require('../config/db');
const { supabase } = require('../config/supabaseClient');

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
        archivos,
        autorizacion_datos
    } = req.body;

    if (!tipo_documento || !numero_documento || !nombres || !apellidos || !correo_electronico || !telefono_principal || !objeto || !descripcion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const jsonArchivos = archivos && Array.isArray(archivos) ? JSON.stringify(archivos) : null;
        console.log("📝 Archivos JSON para insertar:", jsonArchivos);

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
            jsonArchivos,
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

        const registros = rows.map(row => {
            if (row.archivos && typeof row.archivos === 'string') {
                try {
                    row.archivos = JSON.parse(row.archivos);
                } catch (error) {
                    console.warn('⚠️ Error al parsear archivos:', error.message);
                    row.archivos = [];
                }
            } else if (!Array.isArray(row.archivos)) {
                row.archivos = [];
            }
            return row;
        });

        res.status(200).json(registros);
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

        const row = rows[0];
        if (row.archivos && typeof row.archivos === 'string') {
            try {
                row.archivos = JSON.parse(row.archivos);
            } catch (error) {
                console.warn('⚠️ Error al parsear archivos por ID:', error.message);
                row.archivos = [];
            }
        } else if (!Array.isArray(row.archivos)) {
            row.archivos = [];
        }

        res.status(200).json(row);
    } catch (error) {
        console.error('❌ Error al obtener PQRSF por ID:', error);
        res.status(500).json({ message: 'Error al obtener registro' });
    }
};

// Eliminar por ID y archivos en Supabase
exports.eliminarPQRSF = async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.execute('SELECT archivos FROM pqrsf WHERE id = ?', [id]);

        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        let archivos = resultado[0].archivos;

        try {
            if (typeof archivos === 'string' && archivos.startsWith('[')) {
                archivos = JSON.parse(archivos);
            } else if (typeof archivos === 'string') {
                archivos = [archivos];
            }
        } catch (err) {
            console.warn('No se pudo parsear archivos:', archivos);
            archivos = [];
        }

        const rutasASuprimir = archivos.map((url) => {
            const match = url.match(/legal360pdf\/(.+)$/);
            const extraido = match ? decodeURIComponent(match[1]) : null;
            console.log('🔍 URL original:', url);
            console.log('📁 Ruta extraída (decodificada):', extraido);
            return extraido;
        }).filter(Boolean);

        if (rutasASuprimir.length > 0) {
            const { data, error: supaError } = await supabase
                .storage
                .from('legal360pdf')
                .remove(rutasASuprimir);

            if (supaError) {
                console.error('❌ Error al eliminar archivos de Supabase:', supaError.message);
            } else {
                console.log('✅ Archivos eliminados correctamente de Supabase:', data);
            }
        }

        await db.execute('DELETE FROM pqrsf WHERE id = ?', [id]);

        res.status(200).json({ message: 'Registro y archivos eliminados correctamente' });

    } catch (error) {
        console.error('❌ Error al eliminar PQRSF:', error);
        res.status(500).json({ message: 'Error interno al eliminar PQRSF' });
    }
};

// Actualizar PQRSF (aún no implementado)
exports.actualizarPQRSF = async (req, res) => {
    return res.status(200).json({ message: 'Función de actualización aún no implementada' });
};
