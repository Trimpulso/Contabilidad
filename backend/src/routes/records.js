import express from 'express';
import db from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/records — Listar registros con filtros
router.get('/', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 100, rut, fecha_desde, fecha_hasta, estado } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM records WHERE 1=1';
    const params = [];

    if (rut) {
      query += ' AND rut_emisor = ?';
      params.push(rut);
    }
    if (fecha_desde) {
      query += ' AND fecha_emision >= ?';
      params.push(fecha_desde);
    }
    if (fecha_hasta) {
      query += ' AND fecha_emision <= ?';
      params.push(fecha_hasta);
    }
    if (estado) {
      query += ' AND estado_rcv = ?';
      params.push(estado);
    }

    query += ' ORDER BY fecha_emision DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const records = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM records').get().count;

    res.json({
      records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Error obteniendo registros' });
  }
});

// GET /api/records/:id
router.get('/:id', authMiddleware, (req, res) => {
  const record = db.prepare('SELECT * FROM records WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }
  res.json(record);
});

// POST /api/records — Crear registro
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      rut_emisor, razon_social, tipo_dte, folio_dte,
      fecha_emision, fecha_recepcion, monto_neto, monto_iva,
      monto_total, estado_rcv, codigo_impto
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO records (
        rut_emisor, razon_social, tipo_dte, folio_dte,
        fecha_emision, fecha_recepcion, monto_neto, monto_iva,
        monto_total, estado_rcv, codigo_impto, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      rut_emisor, razon_social, tipo_dte, folio_dte,
      fecha_emision, fecha_recepcion, monto_neto, monto_iva,
      monto_total, estado_rcv, codigo_impto, req.user.id
    );

    const newRecord = db.prepare('SELECT * FROM records WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Error creando registro' });
  }
});

// PUT /api/records/:id
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    db.prepare(`UPDATE records SET ${fields} WHERE id = ?`).run(...values);
    const updated = db.prepare('SELECT * FROM records WHERE id = ?').get(id);
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Error actualizando registro' });
  }
});

// DELETE /api/records/:id
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM records WHERE id = ?').run(req.params.id);
    res.json({ message: 'Registro eliminado' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Error eliminando registro' });
  }
});

export default router;
