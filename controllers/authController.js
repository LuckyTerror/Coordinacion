// controllers/authController.js
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Comparar la contraseña con el hash guardado
        const esValido = await bcrypt.compare(password, usuario.password);

        if (!esValido) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        res.json({ mensaje: 'Login exitoso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
