import express from 'express';
import db from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/summary
router.get('/summary', authMiddleware, (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM records').get().count;
    const totalMonto = db.prepare('SELECT SUM(monto_total) as sum FROM records').get().sum || 0;
    const avgMonto = db.prepare('SELECT AVG(monto_total) as avg FROM records').get().avg || 0;
    const porEstado = db.prepare(`
      SELECT estado_rcv, COUNT(*) as count 
      FROM records 
      GROUP BY estado_rcv
    `).all();

    res.json({
      total_registros: total,
      monto_total: Math.round(totalMonto),
      monto_promedio: Math.round(avgMonto),
      por_estado: porEstado
    });
  } catch (error) {
    console.error('Error stats:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// GET /api/stats/by-month
router.get('/by-month', authMiddleware, (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        strftime('%Y-%m', fecha_emision) as mes,
        COUNT(*) as cantidad,
        SUM(monto_total) as monto_total
      FROM records
      WHERE fecha_emision IS NOT NULL
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 12
    `).all();

    res.json(stats);
  } catch (error) {
    console.error('Error stats by month:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas mensuales' });
  }
});

// GET /api/stats/by-provider
router.get('/by-provider', authMiddleware, (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const stats = db.prepare(`
      SELECT 
        razon_social,
        COUNT(*) as cantidad,
        SUM(monto_total) as monto_total
      FROM records
      WHERE razon_social IS NOT NULL
      GROUP BY razon_social
      ORDER BY monto_total DESC
      LIMIT ?
    `).all(limit);

    res.json(stats);
  } catch (error) {
    console.error('Error stats by provider:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas por proveedor' });
  }
});

export default router;
