# 📊 Sistema Contable Inteligente# Sistema Contable Inteligente 📊



Dashboard completo de contabilidad con análisis en tiempo real, seguridad avanzada y KPIs de procesos.**Dashboard contable full-stack con API REST, autenticación JWT y sincronización desde SharePoint.**



**🌐 Acceso en vivo:** https://trimpulso.github.io/Contabilidad/[![Dashboard](https://img.shields.io/badge/Dashboard-Online-blue?style=flat-square)](https://trimpulso.github.io/Contabilidad/)

[![API](https://img.shields.io/badge/API-Docs-green?style=flat-square)](https://github.com/Trimpulso/Contabilidad/blob/main/docs/API.md)

[![Dashboard](https://img.shields.io/badge/Dashboard-Online-blue?style=flat-square)](https://trimpulso.github.io/Contabilidad/)[![GitHub](https://img.shields.io/badge/Repo-GitHub-black?style=flat-square)](https://github.com/Trimpulso/Contabilidad)

[![GitHub](https://img.shields.io/badge/Repo-GitHub-black?style=flat-square)](https://github.com/Trimpulso/Contabilidad)[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🎯 Características

## ✨ Tres Dashboards Integrados

### Frontend

| Dashboard | URL | Función |✅ **Dashboard interactivo** — Gráficos Chart.js (barras, líneas, tortas)  

|-----------|-----|---------|✅ **Tabla Pivote** — Análisis dinámico con filas/columnas/valores configurables  

| **Principal** | [Dashboard](https://trimpulso.github.io/Contabilidad/index.html) | Visualización de registros, gráficos, tabla pivote, exportación PDF/CSV |✅ **Exportación PDF** — Genera reportes descargables del dashboard  

| **Alertas** | [Alertas](https://trimpulso.github.io/Contabilidad/alertas.html) | Sistema de seguridad con 8 reglas de detección de fraude (scoring 0-100) |✅ **Exportación CSV** — Descarga datos filtrados  

| **KPIs** | [KPIs](https://trimpulso.github.io/Contabilidad/kpis.html) | Análisis de proveedores y eficiencia de procesos |✅ **Autenticación** — Login con JWT o modo offline con JSON estático  

✅ **Responsivo** — Mobile-first design con CSS Grid  

## 🎯 Características Principales

### Backend

### Frontend✅ **API REST** — Express.js con endpoints protegidos  

- ✅ Gráficos interactivos (Chart.js: barras, líneas, tortas, rosca)✅ **JWT Auth** — Sistema de sesiones con tokens de 24h  

- ✅ Tabla pivote dinámmica con filtros configurables✅ **Estadísticas** — Resumen, por mes, por proveedor  

- ✅ Exportación PDF y CSV de datos✅ **Filtros** — Por RUT, fecha, estado, con paginación  

- ✅ Acceso sin credenciales (modo guest automático)✅ **Seguridad** — Helmet, CORS, Rate Limiting (100 req/15min)  

- ✅ Diseño responsive mobile-first✅ **In-Memory DB** — Carga datos desde JSON (migrable a SQL)  



### Backend API### Integración SharePoint

- ✅ 14 endpoints REST (Express.js)✅ **OAuth2** — Autenticación con Azure AD  

- ✅ Autenticación JWT✅ **Microsoft Graph API** — Descarga automática de Excel  

- ✅ Análisis estadístico en tiempo real✅ **Conversión fechas** — Seriales Excel → ISO (YYYY-MM-DD)  

- ✅ Sistema de alertas con scoring de riesgo (0-100)✅ **Auto-deploy** — Copia a `docs/data/` para GitHub Pages  

- ✅ Endpoints específicos para KPIs

## 🚀 Acceso Rápido

### Seguridad

- ✅ 8 reglas de detección de fraude**🌐 Dashboard en vivo:**  

- ✅ Scoring automático por registro👉 https://trimpulso.github.io/Contabilidad/

- ✅ Auto-bloqueo de DTEs sospechosos (score > 50)

- ✅ Rate limiting y CORS configurado**� Dashboard de Alertas de Seguridad:**  

- ✅ Validación de IVA y razón social👉 https://trimpulso.github.io/Contabilidad/alertas.html  

⚠️ **Requiere servidor backend corriendo en local** — Ver [INSTRUCCIONES_DASHBOARD.md](INSTRUCCIONES_DASHBOARD.md)

## 🚀 Inicio Rápido

**�📚 Documentación API:**  

### Frontend (GitHub Pages - Sin instalación)👉 [API.md](docs/API.md)

```bash

# Ya está desplegado en:**📂 Repositorio:**  

https://trimpulso.github.io/Contabilidad/👉 https://github.com/Trimpulso/Contabilidad



# Tres dashboards disponibles:## 📖 Guía de Uso

- Dashboard principal

- Dashboard de alertas### Dashboard Frontend

- Dashboard de KPIs

```#### 1️⃣ Autenticación (Opcional)

- **Login**: `admin@trimpulso.cl` / `demo123` para usar API

### Backend Local- **Offline**: Click "Continuar sin login" para usar JSON estático

```bash

cd backend#### 2️⃣ Visualización

- **Hoja**: Selecciona sheet del Excel

# Instalar dependencias- **Categoría**: Columna para agrupar (ej: Razón Social)

npm install- **Valor**: Columna numérica para sumar (ej: Monto Total)

- **Tipo Gráfico**: Barras / Línea / Torta

# Iniciar servidor en http://localhost:3000- **Filtro**: Búsqueda en tiempo real

node src/server-simple.js

```#### 3️⃣ Tabla Pivote

- Click **🔄 Tabla Pivote**

## 📁 Estructura del Proyecto- Selecciona:

  - **Filas**: Categoría principal (ej: Proveedor)

```  - **Columnas**: Categoría secundaria (ej: Tipo DTE)

Contabilidad/  - **Valores**: Campo a sumar (ej: Monto Total)

├── docs/                          # Frontend (GitHub Pages)- Visualiza matriz cruzada con totales

│   ├── index.html                 # Dashboard principal

│   ├── alertas.html               # Dashboard de alertas de seguridad#### 4️⃣ Exportar

│   ├── kpis.html                  # Dashboard de KPIs- **📥 CSV**: Descarga datos filtrados como Excel

│   ├── app-enhanced.js            # Lógica frontend unificada- **� PDF**: Genera snapshot del dashboard actual

│   ├── styles-enhanced.css        # Estilos responsivos

│   └── data/### Backend API

│       ├── contabilidad.json      # Datos de prueba (5 registros)

│       └── contabilidad.json      # Compartido con backend#### Instalación

├── backend/                       # API Node.js + Express```bash

│   ├── src/cd backend

│   │   ├── server-simple.js       # Servidor principalnpm install

│   │   ├── database/              # Capa de persistencianpm start

│   │   ├── middleware/            # Auth y validación```

│   │   ├── routes/                # Endpoints API

│   │   └── security/              # Sistema de alertas (8 reglas)Servidor: `http://localhost:3000`

│   └── package.json               # Dependencias

├── data/                          # Datos de prueba#### Ejemplo de Uso

│   └── contabilidad.json

└── README.md                      # Este archivo```javascript

```// Login

const response = await fetch('http://localhost:3000/api/auth/login', {

## 🔌 API REST Endpoints  method: 'POST',

  headers: { 'Content-Type': 'application/json' },

### Autenticación  body: JSON.stringify({

```    email: 'admin@trimpulso.cl',

POST   /api/auth/login              Obtener token JWT    password: 'demo123'

GET    /api/auth/me                 Info del usuario autenticado  })

```});



### Datos & Registrosconst { token } = await response.json();

```

GET    /api/records                 Obtener registros (filtros + paginación)// Obtener registros

GET    /api/records/{id}            Obtener registro específicoconst records = await fetch('http://localhost:3000/api/records?page=1&limit=50', {

GET    /api/records/with-alerts     Registros con alertas de seguridad  headers: { 'Authorization': `Bearer ${token}` }

```});

```

### Estadísticas

```**Más ejemplos**: [API.md](docs/API.md)

GET    /api/stats/summary           Resumen general (total, promedio)

GET    /api/stats/by-month          Estadísticas por mes## 🔄 Actualizar Datos desde SharePoint

GET    /api/stats/by-provider       Estadísticas por proveedor

```Ejecuta el script de sincronización:



### Seguridad```bash

```cd connectors/sharepoint

POST   /api/security/analyze        Analizar DTE individualnpm install

GET    /api/security/stats          Estadísticas de alertas globalesnpm run sync -- "TU_ENLACE_COMPARTIDO_SHAREPOINT"

``````



### KPIs**Ejemplo de enlace:**

``````

GET    /api/kpis/providers          Métricas de proveedores (deuda, flujo)https://trimpulso-my.sharepoint.com/:x:/g/personal/job_llanos_trimpulso_cl/EftXAVUNC-...

GET    /api/kpis/processes          Métricas de procesos (automatización)```

```

**Resultado:**

## 🔐 Autenticación- ✅ `data/Contabilida.xlsx` — Archivo original

- ✅ `data/contabilidad.json` — Datos parseados

### Modo Development (Por defecto - Sin Login)- ✅ `docs/data/contabilidad.json` — Copia para GitHub Pages

```javascript- 🔄 `git push` — Actualiza dashboard en vivo

// Automático: token guest

token = 'guest-token-' + Date.now()## 🏗️ Arquitectura

```

No requiere credenciales. Permite acceso completo a todos los dashboards.```

Contabilidad/

### Modo Production (Con Credenciales)├── docs/                      # 🌐 GitHub Pages (frontend)

```│   ├── index.html            # Dashboard principal

Email: admin@trimpulso.cl│   ├── app.js                # Lógica + agregaciones

Contraseña: demo123│   ├── styles.css            # Estilos responsivos

```│   └── data/

│       └── contabilidad.json # JSON consumido

## 📊 Datos de Prueba├── connectors/sharepoint/    # 🔗 Sincronización

│   ├── sync.js               # Descarga + parseo Excel

El sistema incluye **5 registros de prueba** en `data/contabilidad.json`:│   ├── config.json           # Credenciales (git-ignored)

│   └── package.json

**Registros Normales (Aprobados):**├── data/                     # 💾 Backup local

- Proveedor A S.A. (RUT: 76192801-K) - $595K│   ├── Contabilida.xlsx

- Proveedor B Ltda. (RUT: 77654321-9) - $595K│   └── contabilidad.json

- Proveedor A variante (RUT: 76192801-K) - $119K└── README.md

```

**Registros Críticos (Bloqueados por Fraude):**

- Empresa Fantasma SpA (RUT: 88999888-7) - $17.85M - Score: 100## 🔐 Seguridad

- Proveedor Dudoso Ltda. (RUT: 99888777-K) - $29.75M - Score: 95

- ✅ Credenciales Azure en `.gitignore`

### Scoring de Alertas- ✅ Dashboard estático sin backend

```- ✅ Permisos requeridos: `Files.Read.All`, `Sites.Read.All` (consentimiento admin)

BAJO      (0-20)   → Aprobado- ✅ Datos JSON públicos en Pages

MEDIO    (21-50)   → Requiere revisión  

CRÍTICO (51-100)   → Auto-bloqueado## 🛠️ Desarrollo Local

```

### Requisitos

## 🛡️ Sistema de Alertas (8 Reglas)- Node.js 18+

- npm o yarn

| Regla | Descripción | Puntos |

|-------|-------------|--------|### Instalación

| 1 | Nuevo emisor (no en baseline) | +30 |```bash

| 2 | Región diferente a histórico | +20 |git clone https://github.com/Trimpulso/Contabilidad.git

| 3 | Monto anormalmente alto | +40 |cd Contabilidad/connectors/sharepoint

| 4 | Recepción muy cercana a emisión | +10 |npm install

| 5 | Folio sospechoso/duplicado | +15 |```

| 6 | Pendiente + monto elevado | +25 |

| 7 | IVA incorrecto | +30 |### Configurar Credenciales Azure

| 8 | Razón social sospechosa | +20 |```bash

cp config.example.json config.json

## 📈 KPIs Disponibles# Edita config.json con:

# - tenantId

### KPIs de Proveedores# - clientId

- Deuda total pendiente# - clientSecret

- Proyección de flujo de caja# - siteUrl

- Gastos por proveedor# - userEmail

- Tendencias de gasto```



### KPIs de Procesos### Probar Localmente

- Tiempo ahorrado en contabilización```bash

- Tasa de automatización (%)# Opción 1: Live Server (VS Code)

- Volumen automatizado vs manual# Click derecho en docs/index.html → "Open with Live Server"

- Tasa de errores

- Precisión de clasificación# Opción 2: Python

python -m http.server 8000 --directory docs

## 🛠 Stack Técnico

# Opción 3: Node

**Frontend:**npx http-server docs -p 8000

- HTML5, CSS3, JavaScript ES6```

- Chart.js 4.4.1 (gráficos)

- jsPDF 2.5.1 (exportación PDF)Abre: http://localhost:8000

- html2canvas 1.4.1 (captura de gráficos)

### Ejecutar Sincronización

**Backend:**```bash

- Node.js 18+npm run sync -- "https://enlace-compartido-sharepoint"

- Express 4.18.2 (framework)```

- JWT (autenticación)

- bcryptjs (hashing)## 📊 Ejemplo de Datos

- Helmet (seguridad)

- CORS (cross-origin)**Estructura JSON generada desde Excel:**

- Rate Limiter (100 req/15min)```json

{

**Deployment:**  "fuente": "Contabilida.xlsx",

- GitHub Pages (frontend)  "generado": "2025-11-08T04:41:05.040Z",

- localhost:3000 (backend local)  "hojas": {

- In-memory DB con JSON    "Hoja1": [

      {

## 📝 Ejemplo de Uso        "RUT_Emisor": "76192801-K",

        "Razon_Social_Emisor": "Proveedor A S.A.",

### Fetch de Datos con API        "Tipo_DTE": 33,

        "Fecha_Emision": "2025-10-01",

```javascript        "Monto_Total": 595000,

// 1. Obtener token (dev: guest token)        "Estado_RCV": "Aceptado"

const token = 'guest-token-' + Date.now();      }

    ]

// 2. Obtener registros  }

const response = await fetch(}

  'http://localhost:3000/api/records?page=1&limit=50',```

  { headers: { 'Authorization': `Bearer ${token}` } }

);## 🔮 Roadmap

const records = await response.json();

- [ ] Backend Node.js + Base de datos

// 3. Obtener KPIs de proveedores- [ ] Autenticación / Login

const kpisResponse = await fetch(- [ ] Tabla dinámica (Pivot)

  'http://localhost:3000/api/kpis/providers',- [ ] Más gráficos (Cascada, Dispersión)

  { headers: { 'Authorization': `Bearer ${token}` } }- [ ] Alertas / Notificaciones

);- [ ] API REST

const kpis = await kpisResponse.json();- [ ] Descarga PDF

console.log(kpis.deudaTotal);  // Deuda total en pesos

```## 📝 Licencia



## 🌐 Navegación entre DashboardsMIT — Libre para usar y modificar.



Todos los dashboards tienen header con links:## 🤝 Contacto

```

[📊 Dashboard] [🚨 Alertas] [📈 KPIs]Email: job.llanos@trimpulso.cl  

```GitHub: https://github.com/Trimpulso/Contabilidad



- Haz click para navegar entre panels---

- Cada dashboard es independiente pero compartir datos

**Última actualización:** 8 de noviembre de 2025

## 📱 Responsive Design

```

- ✅ Desktop: Paneles full-width con grid layoutcontabilidad/

- ✅ Tablet: Ajuste a pantalla 768px├── connectors/

- ✅ Mobile: Stacked layout, graphs 350px ancho máximo│   └── sharepoint/

│       ├── sync.js              # Script de sincronización

## 🔄 Actualización de Datos│       ├── validate.js          # Validación de config

│       ├── config.example.json  # Template (sí se commitea)

### Opción 1: Editar JSON local│       ├── config.json          # Local, NO se commitea

```bash│       └── package.json

# Edita: data/contabilidad.json├── docs/

# Los cambios se reflejan en:│   ├── security_analysis.md     # Información de seguridad

# - Backend (carga al iniciar)│   └── SHAREPOINT_CREDENTIALS.md # Guía de credenciales

# - Frontend (con refrescar página)├── .gitignore                   # Protege credenciales

```└── README.md                    # Este archivo

```

### Opción 2: Pasar datos vía API

```bash## � Seguridad

# POST /api/records/batch

# Envía array de registros- ✅ `config.json` está en `.gitignore` (NO se commitea)

```- ✅ `security_analysis.md` SÍ está en GitHub (sin credenciales)

- ✅ Cada desarrollador tiene su propio `config.json` local

## 🚀 Deployment- ✅ Las credenciales se obtienen de Azure AD



### Frontend (GitHub Pages)## 📖 Documentación

```bash

# Los archivos en /docs/ se despliegan automáticamente- **[security_analysis.md](./docs/security_analysis.md)** - Información de seguridad y configuración

git add docs/- **[SHAREPOINT_CREDENTIALS.md](./docs/SHAREPOINT_CREDENTIALS.md)** - Cómo obtener credenciales de Azure

git commit -m "feat: actualizar dashboard"- **[INICIO.txt](./INICIO.txt)** - Guía paso a paso

git push origin main

## 🛠️ Comandos Disponibles

# Disponible en: https://trimpulso.github.io/Contabilidad/

``````bash

# Validar configuración

### Backend (Local)npm run validate

```bash

# Ejecutar en máquina local# Conectar y listar archivos

cd backendnpm run sync

npm install

node src/server-simple.js# Descargar archivo específico

npm run sync nombredelarchivo.docx

# Estará en: http://localhost:3000```

```

## 📝 Contribuir

## 📞 Licencia

1. Clona el repositorio

MIT - Libre para usar y modificar2. Crea una rama: `git checkout -b feature/nueva-funcion`

3. Haz cambios y commitea: `git commit -am 'Descripción'`

---4. Push: `git push origin feature/nueva-funcion`

5. Abre un Pull Request

**Versión:** 2.0.0  

**Última actualización:** 8 de noviembre de 2025  ## 📞 Soporte

**Autor:** Trimpulso © 2025

- **Email**: job.llanos@trimpulso.cl
- **Organización**: Trimpulso
- **GitHub Issues**: https://github.com/Trimpulso/contabilidad/issues

---

**Última actualización**: 7 de noviembre de 2025
