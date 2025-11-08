# Sistema Contable Inteligente 📊

**Dashboard contable full-stack con API REST, autenticación JWT y sincronización desde SharePoint.**

[![Dashboard](https://img.shields.io/badge/Dashboard-Online-blue?style=flat-square)](https://trimpulso.github.io/Contabilidad/)
[![API](https://img.shields.io/badge/API-Docs-green?style=flat-square)](https://github.com/Trimpulso/Contabilidad/blob/main/docs/API.md)
[![GitHub](https://img.shields.io/badge/Repo-GitHub-black?style=flat-square)](https://github.com/Trimpulso/Contabilidad)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🎯 Características

### Frontend
✅ **Dashboard interactivo** — Gráficos Chart.js (barras, líneas, tortas)  
✅ **Tabla Pivote** — Análisis dinámico con filas/columnas/valores configurables  
✅ **Exportación PDF** — Genera reportes descargables del dashboard  
✅ **Exportación CSV** — Descarga datos filtrados  
✅ **Autenticación** — Login con JWT o modo offline con JSON estático  
✅ **Responsivo** — Mobile-first design con CSS Grid  

### Backend
✅ **API REST** — Express.js con endpoints protegidos  
✅ **JWT Auth** — Sistema de sesiones con tokens de 24h  
✅ **Estadísticas** — Resumen, por mes, por proveedor  
✅ **Filtros** — Por RUT, fecha, estado, con paginación  
✅ **Seguridad** — Helmet, CORS, Rate Limiting (100 req/15min)  
✅ **In-Memory DB** — Carga datos desde JSON (migrable a SQL)  

### Integración SharePoint
✅ **OAuth2** — Autenticación con Azure AD  
✅ **Microsoft Graph API** — Descarga automática de Excel  
✅ **Conversión fechas** — Seriales Excel → ISO (YYYY-MM-DD)  
✅ **Auto-deploy** — Copia a `docs/data/` para GitHub Pages  

## 🚀 Acceso Rápido

**🌐 Dashboard en vivo:**  
👉 https://trimpulso.github.io/Contabilidad/

**📚 Documentación API:**  
👉 [API.md](docs/API.md)

**📂 Repositorio:**  
👉 https://github.com/Trimpulso/Contabilidad

## 📖 Guía de Uso

### Dashboard Frontend

#### 1️⃣ Autenticación (Opcional)
- **Login**: `admin@trimpulso.cl` / `demo123` para usar API
- **Offline**: Click "Continuar sin login" para usar JSON estático

#### 2️⃣ Visualización
- **Hoja**: Selecciona sheet del Excel
- **Categoría**: Columna para agrupar (ej: Razón Social)
- **Valor**: Columna numérica para sumar (ej: Monto Total)
- **Tipo Gráfico**: Barras / Línea / Torta
- **Filtro**: Búsqueda en tiempo real

#### 3️⃣ Tabla Pivote
- Click **🔄 Tabla Pivote**
- Selecciona:
  - **Filas**: Categoría principal (ej: Proveedor)
  - **Columnas**: Categoría secundaria (ej: Tipo DTE)
  - **Valores**: Campo a sumar (ej: Monto Total)
- Visualiza matriz cruzada con totales

#### 4️⃣ Exportar
- **📥 CSV**: Descarga datos filtrados como Excel
- **� PDF**: Genera snapshot del dashboard actual

### Backend API

#### Instalación
```bash
cd backend
npm install
npm start
```

Servidor: `http://localhost:3000`

#### Ejemplo de Uso

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@trimpulso.cl',
    password: 'demo123'
  })
});

const { token } = await response.json();

// Obtener registros
const records = await fetch('http://localhost:3000/api/records?page=1&limit=50', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Más ejemplos**: [API.md](docs/API.md)

## 🔄 Actualizar Datos desde SharePoint

Ejecuta el script de sincronización:

```bash
cd connectors/sharepoint
npm install
npm run sync -- "TU_ENLACE_COMPARTIDO_SHAREPOINT"
```

**Ejemplo de enlace:**
```
https://trimpulso-my.sharepoint.com/:x:/g/personal/job_llanos_trimpulso_cl/EftXAVUNC-...
```

**Resultado:**
- ✅ `data/Contabilida.xlsx` — Archivo original
- ✅ `data/contabilidad.json` — Datos parseados
- ✅ `docs/data/contabilidad.json` — Copia para GitHub Pages
- 🔄 `git push` — Actualiza dashboard en vivo

## 🏗️ Arquitectura

```
Contabilidad/
├── docs/                      # 🌐 GitHub Pages (frontend)
│   ├── index.html            # Dashboard principal
│   ├── app.js                # Lógica + agregaciones
│   ├── styles.css            # Estilos responsivos
│   └── data/
│       └── contabilidad.json # JSON consumido
├── connectors/sharepoint/    # 🔗 Sincronización
│   ├── sync.js               # Descarga + parseo Excel
│   ├── config.json           # Credenciales (git-ignored)
│   └── package.json
├── data/                     # 💾 Backup local
│   ├── Contabilida.xlsx
│   └── contabilidad.json
└── README.md
```

## 🔐 Seguridad

- ✅ Credenciales Azure en `.gitignore`
- ✅ Dashboard estático sin backend
- ✅ Permisos requeridos: `Files.Read.All`, `Sites.Read.All` (consentimiento admin)
- ✅ Datos JSON públicos en Pages

## 🛠️ Desarrollo Local

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
git clone https://github.com/Trimpulso/Contabilidad.git
cd Contabilidad/connectors/sharepoint
npm install
```

### Configurar Credenciales Azure
```bash
cp config.example.json config.json
# Edita config.json con:
# - tenantId
# - clientId
# - clientSecret
# - siteUrl
# - userEmail
```

### Probar Localmente
```bash
# Opción 1: Live Server (VS Code)
# Click derecho en docs/index.html → "Open with Live Server"

# Opción 2: Python
python -m http.server 8000 --directory docs

# Opción 3: Node
npx http-server docs -p 8000
```

Abre: http://localhost:8000

### Ejecutar Sincronización
```bash
npm run sync -- "https://enlace-compartido-sharepoint"
```

## 📊 Ejemplo de Datos

**Estructura JSON generada desde Excel:**
```json
{
  "fuente": "Contabilida.xlsx",
  "generado": "2025-11-08T04:41:05.040Z",
  "hojas": {
    "Hoja1": [
      {
        "RUT_Emisor": "76192801-K",
        "Razon_Social_Emisor": "Proveedor A S.A.",
        "Tipo_DTE": 33,
        "Fecha_Emision": "2025-10-01",
        "Monto_Total": 595000,
        "Estado_RCV": "Aceptado"
      }
    ]
  }
}
```

## 🔮 Roadmap

- [ ] Backend Node.js + Base de datos
- [ ] Autenticación / Login
- [ ] Tabla dinámica (Pivot)
- [ ] Más gráficos (Cascada, Dispersión)
- [ ] Alertas / Notificaciones
- [ ] API REST
- [ ] Descarga PDF

## 📝 Licencia

MIT — Libre para usar y modificar.

## 🤝 Contacto

Email: job.llanos@trimpulso.cl  
GitHub: https://github.com/Trimpulso/Contabilidad

---

**Última actualización:** 8 de noviembre de 2025

```
contabilidad/
├── connectors/
│   └── sharepoint/
│       ├── sync.js              # Script de sincronización
│       ├── validate.js          # Validación de config
│       ├── config.example.json  # Template (sí se commitea)
│       ├── config.json          # Local, NO se commitea
│       └── package.json
├── docs/
│   ├── security_analysis.md     # Información de seguridad
│   └── SHAREPOINT_CREDENTIALS.md # Guía de credenciales
├── .gitignore                   # Protege credenciales
└── README.md                    # Este archivo
```

## � Seguridad

- ✅ `config.json` está en `.gitignore` (NO se commitea)
- ✅ `security_analysis.md` SÍ está en GitHub (sin credenciales)
- ✅ Cada desarrollador tiene su propio `config.json` local
- ✅ Las credenciales se obtienen de Azure AD

## 📖 Documentación

- **[security_analysis.md](./docs/security_analysis.md)** - Información de seguridad y configuración
- **[SHAREPOINT_CREDENTIALS.md](./docs/SHAREPOINT_CREDENTIALS.md)** - Cómo obtener credenciales de Azure
- **[INICIO.txt](./INICIO.txt)** - Guía paso a paso

## 🛠️ Comandos Disponibles

```bash
# Validar configuración
npm run validate

# Conectar y listar archivos
npm run sync

# Descargar archivo específico
npm run sync nombredelarchivo.docx
```

## 📝 Contribuir

1. Clona el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcion`
3. Haz cambios y commitea: `git commit -am 'Descripción'`
4. Push: `git push origin feature/nueva-funcion`
5. Abre un Pull Request

## 📞 Soporte

- **Email**: job.llanos@trimpulso.cl
- **Organización**: Trimpulso
- **GitHub Issues**: https://github.com/Trimpulso/contabilidad/issues

---

**Última actualización**: 7 de noviembre de 2025
