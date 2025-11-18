const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db'); // conexión a MySQL

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 📤 Ruta para subir entrega
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const { usuarioID, documentoID } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const archivoURL = `/uploads/${req.file.filename}`;
    const fechaEntrega = new Date();

    // Insertar en la base de datos
    const [result] = await pool.query(
      `INSERT INTO Entrega (UsuarioID, DocumentoID, FechaEntrega, ArchivoURL, Estado)
       VALUES (?, ?, ?, ?, 'enviado')`,
      [usuarioID, documentoID, fechaEntrega, archivoURL]
    );

    res.json({
      mensaje: 'Documento entregado correctamente',
      entregaID: result.insertId,
      archivoURL
    });

  } catch (error) {
    console.error('Error al guardar entrega:', error);
    res.status(500).json({ error: 'Error en el servidor al guardar la entrega' });
  }
});

// 📥 Ruta para obtener las entregas de un usuario
router.get('/usuario/:usuarioID', async (req, res) => {
  try {
    const { usuarioID } = req.params;
    const [rows] = await pool.query(
      `SELECT e.*, d.Nombre as DocumentoNombre
       FROM Entrega e
       JOIN Documento d ON e.DocumentoID = d.DocumentoID
       WHERE e.UsuarioID = ?`,
      [usuarioID]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener entregas:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener entregas' });
  }
});
