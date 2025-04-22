const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const db = require('../config/db')

// GET usuarios
// Obtener todos los usuarios
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Usuario';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.json(results);
  });
});

// POST nuevo usuario
// Crear nuevo usuario
router.post('/', (req, res) => {
    const { nombre, correo, contrasena, rol, estatus } = req.body;

    if (!nombre || !correo || !contrasena || !rol || !estatus) {
        return res.json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO Usuario (nombre, correo, contrasena, rol, estatus) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre, correo, contrasena, rol, estatus], (err, result) => {
        if (err) {
            console.error('Error al insertar usuario:', err);
            return res.json({ error: 'Error al crear el usuario' });
        }

        return res.json({ mensaje: 'Usuario creado con éxito', id: result.insertId });
    });
});

// Actualizar usuario por ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, correo, contrasena, rol, estatus } = req.body;

  const sql = 'UPDATE Usuario SET nombre = ?, correo = ?, contrasena = ?, rol = ?, estatus = ? WHERE UsuarioID = ?';

  db.query(sql, [nombre, correo, contrasena, rol, estatus, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }

    return res.json({ mensaje: 'Usuario actualizado con éxito' });
  });
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM Usuario WHERE UsuarioID = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(results[0]); // Solo enviar el objeto, no el array completo
  });
});

// Cambiar estatus a "baja" (eliminar lógico)
router.put('/:id/baja', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE Usuario SET estatus = ? WHERE UsuarioID = ?';

  db.query(sql, ['baja', id], (err, result) => {
    if (err) {
      console.error('Error al dar de baja al usuario:', err);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    return res.json({ mensaje: 'Usuario dado de baja correctamente' });
  });
});

module.exports = router;