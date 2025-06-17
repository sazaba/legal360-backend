// controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nombre_usuario, correo, rol, activo, fecha_creacion FROM usuarios');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT id, nombre_usuario, correo, rol, activo, fecha_creacion FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener usuario', error: err.message });
    }
};

exports.createUser = async (req, res) => {
    const { nombre_usuario, correo, contrasena, rol } = req.body;
    try {
        const contrasena_hash = await bcrypt.hash(contrasena, 10);
        await db.query(
            'INSERT INTO usuarios (nombre_usuario, correo, contrasena_hash, rol) VALUES (?, ?, ?, ?)',
            [nombre_usuario, correo, contrasena_hash, rol]
        );
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al crear usuario', error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, correo, contrasena, rol, activo } = req.body;
    try {
        const campos = [];
        const valores = [];

        if (nombre_usuario) {
            campos.push('nombre_usuario = ?');
            valores.push(nombre_usuario);
        }
        if (correo) {
            campos.push('correo = ?');
            valores.push(correo);
        }
        if (contrasena) {
            const hash = await bcrypt.hash(contrasena, 10);
            campos.push('contrasena_hash = ?');
            valores.push(hash);
        }
        if (rol) {
            campos.push('rol = ?');
            valores.push(rol);
        }
        if (activo !== undefined) {
            campos.push('activo = ?');
            valores.push(activo);
        }

        if (campos.length === 0) return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar' });

        valores.push(id);
        const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
        await db.query(sql, valores);

        res.json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log('[DELETE] ID recibido:', id); // <-- Este log te dirá si llega
    try {
        const [resultado] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        console.log('[DELETE] Resultado SQL:', resultado); // <-- Verifica el resultado
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error('[ERROR] al eliminar:', err.message);
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err.message });
    }
};
