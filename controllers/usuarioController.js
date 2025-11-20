const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña obligatorios' });
  }

  const sql = 'SELECT * FROM Usuario WHERE correo = ? LIMIT 1';

  db.query(sql, [correo], async (err, results) => {
    if (err) {
      console.error('❌ Error al consultar usuario:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo no registrado' });
    }

    const usuario = results[0];

    // 👀 Comparar con bcrypt
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({
      message: 'Login exitoso',
      usuarioID: usuario.UsuarioID,
      nombre: usuario.Nombre,
      correo: usuario.Correo,
      tipo_usuario: usuario.tipo_usuario,
      estatus: usuario.estatus
    });
  });
};


  // Verificar si el correo ya existe
  db.query('SELECT * FROM Usuario WHERE correo = ?', [correo], async (err, results) => {
    if (err) {
      console.error('❌ Error al verificar el correo:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    try {
      // 🔐 HASHEAR CONTRASEÑA AQUÍ
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const sql = `
        INSERT INTO Usuario (nombre, correo, contrasena, tipo_usuario, id_carrera, estatus)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [nombre, correo, hashedPassword, tipo_usuario, id_carrera, estatus],
        (err, result) => {
          if (err) {
            console.error('❌ Error al crear usuario:', err);
            return res.status(500).json({ error: 'Error al crear el usuario' });
          }

          res.status(201).json({
            message: '✅ Usuario creado correctamente',
            id: result.insertId
          });
        }
      );

    } catch (error) {
      console.error('❌ Error al hashear la contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
};
