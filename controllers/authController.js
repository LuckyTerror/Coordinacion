const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const sql = 'SELECT * FROM Usuario WHERE correo = ? LIMIT 1';

    db.query(sql, [correo], async (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo no registrado' });
        }

        const usuario = results[0];

        // Comparar contraseña con hash
        const esValido = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!esValido) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.json({
            message: '✔ Login exitoso',
            usuarioID: usuario.UsuarioID,
            nombre: usuario.Nombre,
            correo: usuario.Correo,
            rol: usuario.Rol,
            estatus: usuario.Estatus
        });
    });
};
