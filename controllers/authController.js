const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { user, password } = req.body;

    try {


        const [rows] = await db.query(
            `SELECT * FROM usuarios WHERE correo = ? OR nombre_usuario = ? LIMIT 1`,
            [user, user]
        );

        const usuario = rows[0];


        if (!usuario) {

            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }



        const passwordOk = await bcrypt.compare(password, usuario.contrasena_hash);


        if (!passwordOk) {

            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        await db.query(`UPDATE usuarios SET fecha_ultimo_login = CURRENT_TIMESTAMP WHERE id = ?`, [usuario.id]);

        console.log('✅ Login exitoso');

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_usuario,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (err) {

        res.status(500).json({ mensaje: 'Error del servidor', error: err.message });
    }
};
