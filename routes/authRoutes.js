// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña obligatorios' });
  }

  const sql = 'SELECT * FROM Usuario WHERE correo = ? LIMIT 1';

  db.query(sql, [correo], (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo no registrado' });
    }

    const usuario = results[0];

    console.log('🔍 Comparando:', usuario.contrasena, '<--->', contrasena);
    if (
        String(usuario.Contrasena).trim().toLowerCase() !==
        String(contrasena).trim().toLowerCase()
      ) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }          

    res.json({
      usuarioID: usuario.UsuarioID,
      nombre: usuario.Nombre,
      correo: usuario.Correo,
      rol: usuario.Rol,
      estatus: usuario.Estatus
    });
  });
});

module.exports = router;