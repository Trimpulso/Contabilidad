# 📊 Sistema Contable Inteligente - Descripción Completa

## ¿Qué es?

**Sistema Contable Inteligente** es un dashboard web moderno diseñado para analizar y gestionar registros contables (DTEs - Documentos Tributarios Electrónicos) con énfasis en **detección automática de fraude**, **análisis de proveedores** e **indicadores de eficiencia**.

## 🎯 Objetivo Principal

Proporcionar una **solución de prueba completa y funcional** que permita:
1. Visualizar datos contables con gráficos interactivos
2. Detectar automáticamente transacciones sospechosas o fraudulentas
3. Analizar KPIs de proveedores y procesos
4. Tomar decisiones basadas en datos en tiempo real

## 🌐 Cómo Acceder

No requiere instalación, credenciales ni servidor. Solo abre los links:

- **Dashboard Principal:** https://trimpulso.github.io/Contabilidad/
- **Dashboard de Alertas:** https://trimpulso.github.io/Contabilidad/alertas.html
- **Dashboard de KPIs:** https://trimpulso.github.io/Contabilidad/kpis.html

## 📊 Los Tres Dashboards

### 1️⃣ **Dashboard Principal** (index.html)

**¿Qué hace?**
Permite visualizar y analizar datos contables de forma interactiva.

**Funcionalidades:**
- 📈 **Gráficos Interactivos:** Selecciona qué columna analizar y cómo visualizarla (barras, líneas, tortas)
- 🔄 **Tabla Pivote Dinámica:** Crea análisis cruzados configurando filas, columnas y valores
- 🔍 **Filtros en Tiempo Real:** Busca registros específicos mientras escribes
- 📥 **Exportación:** Descarga datos como CSV o genera reportes en PDF
- 📱 **Responsive:** Funciona perfectamente en mobile, tablet y desktop

**Ejemplo de Uso:**
1. Abre el dashboard
2. Selecciona una "Categoría" (ej: "Razón Social")
3. Selecciona un "Valor" numérico (ej: "Monto Total")
4. Elige tipo de gráfico
5. Los datos se visualizan automáticamente
6. Usa la tabla pivote para análisis cruzados

---

### 2️⃣ **Dashboard de Alertas** (alertas.html)

**¿Qué hace?**
Sistema automático de detección de fraude que analiza cada transacción usando 8 reglas inteligentes.

**Funcionalidades:**

#### 8 Reglas de Detección de Fraude:

| Regla | Descripción | Puntos | Ejemplo |
|-------|-------------|--------|---------|
| 🆕 **Emisor Nuevo** | Proveedor sin historial en sistema | +30 | RUT nunca visto antes |
| 🌍 **Región Sospechosa** | Fuera de zonas permitidas | +20 | Magallanes cuando siempre fue RM |
| 💰 **Monto Anormal** | Factura > $15 millones | +40 | Factura de $17.85M |
| ⚡ **Recepción Inmediata** | Mismo día emisión-recepción | +10 | Emitida y recibida 01/11 |
| 🔢 **Folio Sospechoso** | Patrones dudosos (9999, 0000) | +15 | Folio: 9999 |
| ⚠️ **Pendiente + Alto Monto** | Estado "Pendiente" + $10M+ | +25 | Pendiente + $29.75M |
| 📊 **IVA Incorrecto** | Cálculo de IVA inconsistente | +30 | IVA no es 19% del neto |
| 🚩 **Razón Social Sospechosa** | Palabras clave de riesgo | +20 | "Fantasma", "Dudoso", "Temporal" |

#### Scoring Automático:
- **0-20 puntos:** ✅ **BAJO** → Aprobado
- **21-50 puntos:** ⚠️ **MEDIO** → Requiere revisión
- **51-100 puntos:** 🚫 **CRÍTICO** → Auto-bloqueado

**Datos de Prueba (5 registros):**

✅ Registros Normales:
- Proveedor A S.A. → $595K (Aprobado)
- Proveedor B Ltda. → $595K (Aprobado)
- Proveedor A variante → $119K (Aprobado)

🚫 Registros Fraudulentos:
- **Empresa Fantasma SpA** → Score: 100 (CRÍTICO - Bloqueado)
  - Nuevo emisor
  - Región Magallanes (sospechosa)
  - Monto: $17.85M (anormal)
  - Recepción inmediata
  - Razón social: "Fantasma"

- **Proveedor Dudoso Ltda.** → Score: 95 (CRÍTICO - Bloqueado)
  - Nuevo emisor
  - Monto: $29.75M (muy alto)
  - Pendiente + alto monto
  - Razón social: "Dudoso"

**¿Cómo funciona?**
1. Carga automáticamente datos locales (sin servidor)
2. Aplica 8 reglas de seguridad a cada registro
3. Calcula scoring en tiempo real
4. Muestra alertas detalladas con recomendaciones
5. Bloquea automáticamente DTEs críticos

---

### 3️⃣ **Dashboard de KPIs** (kpis.html)

**¿Qué hace?**
Muestra indicadores clave de desempeño sobre proveedores y eficiencia de procesos.

**Sección 1: KPIs de Proveedores (Cuenta 400)**

Métricas:
- 💰 **Deuda Total Pendiente:** $48.9M
- 📦 **Proveedores Activos:** 4
- 📈 **Gasto Promedio:** $12.2M por proveedor
- ⏰ **Plazo Pago Promedio:** 28 días

Visualizaciones:
- 📊 Gráfico de línea: Tendencia deuda (últimos 6 meses)
- 🍩 Gráfico de rosca: Gasto por proveedor
- 📉 Proyección de flujo de caja (próximos 3 meses)
- 📋 Tabla detallada por proveedor

**Sección 2: KPIs de Procesos (Eficiencia)**

Métricas:
- ⚡ **Tiempo Ahorrado:** 4.5 horas/cliente/mes
- 🤖 **Automatización:** 92% de facturas
- 📝 **Facturas Manuales:** 8%
- ✓ **Tasa de Errores:** 0.2%

Visualizaciones:
- 📊 Automatizadas vs Manuales (últimos 6 meses)
- 📈 Tiempo ahorrado acumulado
- 📋 Tabla de métricas con metas vs cumplimiento

**Resumen Ejecutivo:**
Información consolidada sobre eficiencia general y alertas clave.

---

## 💡 Casos de Uso

### 1. Auditoría de Proveedores
```
👤 Auditor abre Dashboard Principal
├─ Filtra por "Región_Emisor" = "Magallanes"
├─ Visualiza gráfico de facturas sospechosas
└─ Exporta datos a PDF para informe
```

### 2. Detección de Fraude
```
🚨 Sistema de Alertas carga automáticamente
├─ Analiza 5 registros contra 8 reglas
├─ Identifica 2 registros críticos
├─ Genera scoring de riesgo (100 y 95)
└─ Bloquea automáticamente transacciones
```

### 3. Análisis de Deuda de Proveedores
```
💰 Ejecutivo finanzas abre KPIs
├─ Ve deuda total: $48.9M
├─ Identifica proveedor con mayor deuda
├─ Revisa proyección flujo caja
└─ Toma decisión de pagos
```

### 4. Monitoreo de Eficiencia
```
⚙️ Gerente procesos revisa KPIs
├─ Ve automatización: 92%
├─ Verifica tiempo ahorrado: 4.5h/cliente
├─ Identifica puntos de mejora
└─ Define metas mensuales
```

---

## 🛠 Tecnología

**Frontend Puro (Sin dependencias complejas):**
- HTML5 semántico
- CSS3 responsivo (mobile-first)
- JavaScript ES6 vanilla (sin frameworks)
- Chart.js 4.4.1 para gráficos
- jsPDF 2.5.1 para exportar PDF
- html2canvas 1.4.1 para capturar gráficos

**Datos:**
- JSON estático (contabilidad.json)
- 5 registros de prueba
- Cargas automáticamente al abrir

**Hosting:**
- GitHub Pages (gratuito, ilimitado)
- HTTPS incluido
- Actualizaciones instantáneas

---

## ⚡ Características Principales

### ✨ Acceso Inmediato
- Sin credenciales
- Sin instalación
- Sin servidor
- Click y listo

### 🔒 Seguridad Inteligente
- 8 reglas de fraude
- Scoring automático (0-100)
- Auto-bloqueo de críticos
- Análisis en tiempo real

### 📊 Análisis Completo
- Múltiples gráficos
- Tabla pivote dinámica
- Filtros en vivo
- Exportación PDF/CSV

### 📈 KPIs Detallados
- Proveedores y deuda
- Eficiencia de procesos
- Tendencias y proyecciones
- Metas vs cumplimiento

### 📱 Responsive Design
- Desktop: Layout completo
- Tablet: Optimizado
- Mobile: Funcional al 100%

---

## 📋 Datos Incluidos

El sistema viene con 5 registros de prueba que demuestran:

1. **Registros válidos** (aprobados automáticamente)
2. **Registros fraudulentos** (detectados y bloqueados)
3. **Diferentes montos y regiones** (para probar todas las reglas)

---

## 🚀 Próximas Mejoras Posibles

Si quieres extender el proyecto:
- 🔌 Conectar a API real de contabilidad
- 💾 Base de datos para histórico
- 📧 Notificaciones por email
- 🔐 Autenticación de usuarios
- 📊 Reportes automatizados
- 🤖 Machine Learning para predicciones

---

## 📞 Información de Contacto

- **Organización:** Trimpulso
- **Proyecto:** Sistema Contable Inteligente
- **Versión:** 2.1.0 (Frontend Only)
- **Fecha:** 8 de noviembre de 2025
- **Licencia:** MIT

---

## 🎓 Cómo Entender el Código

### Archivo Principal: `app-enhanced.js`
- Líneas 1-40: Inicialización y carga de datos
- Líneas 41-100: Renderización de gráficos
- Líneas 101-200: Tabla pivote
- Líneas 201-300: Exportación PDF/CSV
- Líneas 301+: Funciones auxiliares

### Dashboard Alertas: `alertas.html`
- Script al final: Análisis de seguridad
- Función `analizarDTELocal()`: Aplica 8 reglas
- Función `loadAlerts()`: Carga y procesa datos

### Dashboard KPIs: `kpis.html`
- Datos simulados (líneas 400-450)
- Gráficos Chart.js (líneas 451-544)
- Tabla de métricas (HTML, líneas 250-350)

---

## ✅ Checklist de Funcionalidades

- [x] Dashboard principal con gráficos
- [x] Tabla pivote dinámica
- [x] Exportación PDF
- [x] Exportación CSV
- [x] 8 reglas de fraude
- [x] Scoring automático (0-100)
- [x] Auto-bloqueo de críticos
- [x] KPIs de proveedores
- [x] KPIs de procesos
- [x] Responsive design
- [x] Acceso sin credenciales
- [x] Funciona en GitHub Pages
- [x] Datos de prueba incluidos

---

¡**Proyecto completamente funcional y listo para demostración!** 🎉
