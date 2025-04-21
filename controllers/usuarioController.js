const db = require('../config/db');

exports.obtenerUsuarios = (req, res) => {
  db.query('SELECT * FROM Usuario', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.crearUsuario = (req, res) => {
  const { nombre, correo, contrasena, tipo_usuario, id_carrera, estatus } = req.body;

  // Validación básica
  if (!nombre || !correo || !contrasena || !tipo_usuario || !id_carrera || !estatus) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const estatusPermitidos = ['activo', 'baja', 'temporal'];
  if (!estatusPermitidos.includes(estatus)) {
    return res.status(400).json({ error: 'Estatus inválido' });
  }

  // Verificar si el correo ya existe
  db.query('SELECT * FROM Usuario WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar el correo:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Insertar usuario
    const sql = `
      INSERT INTO Usuario (nombre, correo, contrasena, tipo_usuario, id_carrera, estatus)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [nombre, correo, contrasena, tipo_usuario, id_carrera, estatus], (err, result) => {
      if (err) {
        console.error('❌ Error al crear usuario:', err);
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }

      res.status(201).json({ message: '✅ Usuario creado correctamente', id: result.insertId });
    });
  });
};

