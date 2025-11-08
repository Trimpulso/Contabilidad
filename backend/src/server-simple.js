import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SecurityAlertSystem } from './security/alerts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-cambiar-en-produccion';

// Sistema de alertas de seguridad
const alertSystem = new SecurityAlertSystem();

// In-memory storage (reemplazar con DB en producción)
let users = [
  {
    id: 1,
    email: 'admin@trimpulso.cl',
    password: await bcrypt.hash('demo123', 10),
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@trimpulso.cl',
    password: await bcrypt.hash('demo123', 10),
    name: 'Usuario Demo',
    role: 'user'
  }
];

let sessions = [];
let records = [];

// Cargar datos desde JSON
async function loadData() {
  try {
    const dataPath = path.join(__dirname, '../../data/contabilidad.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    
    // Convertir hojas a array de records
    const allRecords = [];
    let id = 1;
    
    for (const [sheetName, rows] of Object.entries(data.hojas || {})) {
      rows.forEach(row => {
        allRecords.push({
          id: id++,
          ...row,
          sheet_name: sheetName,
          imported_at: new Date().toISOString(),
          user_id: 1
        });
      });
    }
    
    records = allRecords;
    
    // Cargar historial en sistema de alertas
    alertSystem.cargarHistorico(records);
    
    console.log(`✅ Cargados ${records.length} registros desde JSON`);
    console.log(`🔒 Sistema de alertas inicializado con ${alertSystem.proveedoresConocidos.size} proveedores conocidos`);
  } catch (error) {
    console.warn('⚠️ No se pudo cargar JSON, usando datos vacíos');
  }
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8000', 'https://trimpulso.github.io'],
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = sessions.find(s => s.token === token);
    
    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Routes

// Info
app.get('/api', (req, res) => {
  res.json({
    name: 'Contabilidad API',
    version: '1.0.0',
    endpoints: ['/api/auth/login', '/api/auth/logout', '/api/auth/me', '/api/records', '/api/stats']
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const session = {
      id: sessions.length + 1,
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
    
    sessions.push(session);
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

// Logout
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization.substring(7);
  sessions = sessions.filter(s => s.token !== token);
  res.json({ message: 'Sesión cerrada' });
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
});

// Get records
app.get('/api/records', authMiddleware, (req, res) => {
  const { page = 1, limit = 100, rut, fecha_desde, fecha_hasta, estado } = req.query;
  
  let filtered = [...records];
  
  if (rut) {
    filtered = filtered.filter(r => r.RUT_Emisor && r.RUT_Emisor.includes(rut));
  }
  
  if (fecha_desde) {
    filtered = filtered.filter(r => r.Fecha_Emision >= fecha_desde);
  }
  
  if (fecha_hasta) {
    filtered = filtered.filter(r => r.Fecha_Emision <= fecha_hasta);
  }
  
  if (estado) {
    filtered = filtered.filter(r => r.Estado_RCV === estado);
  }
  
  const total = filtered.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedRecords = filtered.slice(offset, offset + parseInt(limit));
  
  res.json({
    records: paginatedRecords,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages
    }
  });
});

// Get single record
app.get('/api/records/:id', authMiddleware, (req, res) => {
  const record = records.find(r => r.id === parseInt(req.params.id));
  
  if (!record) {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }
  
  res.json(record);
});

// Stats summary
app.get('/api/stats/summary', authMiddleware, (req, res) => {
  const totales = records.filter(r => typeof r.Monto_Total === 'number');
  const monto_total = totales.reduce((sum, r) => sum + r.Monto_Total, 0);
  const monto_promedio = totales.length ? monto_total / totales.length : 0;
  
  const por_estado = {};
  records.forEach(r => {
    const estado = r.Estado_RCV || 'Sin Estado';
    if (!por_estado[estado]) {
      por_estado[estado] = { count: 0, monto: 0 };
    }
    por_estado[estado].count++;
    if (typeof r.Monto_Total === 'number') {
      por_estado[estado].monto += r.Monto_Total;
    }
  });
  
  res.json({
    total_registros: records.length,
    monto_total,
    monto_promedio,
    por_estado: Object.entries(por_estado).map(([estado, data]) => ({
      estado,
      count: data.count,
      monto_total: data.monto
    }))
  });
});

// Stats by month
app.get('/api/stats/by-month', authMiddleware, (req, res) => {
  const byMonth = {};
  
  records.forEach(r => {
    if (r.Fecha_Emision) {
      const month = r.Fecha_Emision.substring(0, 7); // YYYY-MM
      if (!byMonth[month]) {
        byMonth[month] = { count: 0, monto: 0 };
      }
      byMonth[month].count++;
      if (typeof r.Monto_Total === 'number') {
        byMonth[month].monto += r.Monto_Total;
      }
    }
  });
  
  const result = Object.entries(byMonth)
    .map(([mes, data]) => ({
      mes,
      registros: data.count,
      monto_total: data.monto
    }))
    .sort((a, b) => b.mes.localeCompare(a.mes))
    .slice(0, 12);
  
  res.json(result);
});

// Stats by provider
app.get('/api/stats/by-provider', authMiddleware, (req, res) => {
  const { limit = 10 } = req.query;
  const byProvider = {};
  
  records.forEach(r => {
    const provider = r.Razon_Social_Emisor || 'Sin Razón Social';
    if (!byProvider[provider]) {
      byProvider[provider] = { count: 0, monto: 0 };
    }
    byProvider[provider].count++;
    if (typeof r.Monto_Total === 'number') {
      byProvider[provider].monto += r.Monto_Total;
    }
  });
  
  const result = Object.entries(byProvider)
    .map(([proveedor, data]) => ({
      proveedor,
      registros: data.count,
      monto_total: data.monto
    }))
    .sort((a, b) => b.monto_total - a.monto_total)
    .slice(0, parseInt(limit));
  
  res.json(result);
});

// Analizar DTE con sistema de alertas
app.post('/api/security/analyze', authMiddleware, (req, res) => {
  try {
    const dte = req.body;
    
    if (!dte || !dte.RUT_Emisor) {
      return res.status(400).json({ error: 'DTE inválido: RUT_Emisor requerido' });
    }
    
    const analisis = alertSystem.analizarDTE(dte);
    const reporte = alertSystem.generarReporte(analisis);
    
    res.json(reporte);
  } catch (error) {
    console.error('Error en análisis de seguridad:', error);
    res.status(500).json({ error: 'Error al analizar DTE' });
  }
});

// Analizar lote de DTEs
app.post('/api/security/analyze-batch', authMiddleware, (req, res) => {
  try {
    const { dtes } = req.body;
    
    if (!Array.isArray(dtes) || dtes.length === 0) {
      return res.status(400).json({ error: 'Se requiere array de DTEs' });
    }
    
    const analisis = alertSystem.analizarLote(dtes);
    const estadisticas = alertSystem.obtenerEstadisticas(analisis.map(a => a.analisisSeguridad));
    
    res.json({
      resultados: analisis,
      estadisticas
    });
  } catch (error) {
    console.error('Error en análisis batch:', error);
    res.status(500).json({ error: 'Error al analizar lote de DTEs' });
  }
});

// Obtener registros con análisis de seguridad
app.get('/api/records/with-alerts', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    
    // Analizar todos los registros
    const conAlertas = alertSystem.analizarLote(records);
    
    // Filtrar solo los que tienen alertas
    const soloAlertas = conAlertas.filter(r => r.analisisSeguridad.alertas.length > 0);
    
    const total = soloAlertas.length;
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRecords = soloAlertas.slice(offset, offset + parseInt(limit));
    
    const estadisticas = alertSystem.obtenerEstadisticas(soloAlertas.map(r => r.analisisSeguridad));
    
    res.json({
      records: paginatedRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      },
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener registros con alertas:', error);
    res.status(500).json({ error: 'Error al procesar registros' });
  }
});

// Obtener estadísticas de seguridad
app.get('/api/security/stats', authMiddleware, (req, res) => {
  try {
    const analisis = alertSystem.analizarLote(records);
    const estadisticas = alertSystem.obtenerEstadisticas(analisis.map(a => a.analisisSeguridad));
    
    res.json({
      ...estadisticas,
      proveedoresConocidos: alertSystem.proveedoresConocidos.size,
      registrosAnalizados: records.length,
      promedioGeneral: Math.round(alertSystem.calcularPromedioGeneral())
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de seguridad:', error);
    res.status(500).json({ error: 'Error al calcular estadísticas' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Start server
await loadData();

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Registros cargados: ${records.length}`);
  console.log(`👥 Usuarios disponibles: ${users.map(u => u.email).join(', ')}`);
});
