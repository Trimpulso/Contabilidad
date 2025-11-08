# 🚨 Sistema de Alertas de Seguridad - DTEs Sospechosos

## Casos de Ejemplo para Pruebas

Agregar estos registros al Excel en SharePoint para demostrar el sistema de alertas:

### 📋 Datos de Ejemplo

| RUT_Emisor | Razon_Social_Emisor | Tipo_DTE | Folio_DTE | Fecha_Emision | Fecha_Recepcion | Monto_Neto | Monto_IVA | Monto_Total | Estado_RCV | Codigo_Impto | Region_Emisor | Es_Nuevo_Proveedor |
|------------|---------------------|----------|-----------|---------------|-----------------|------------|-----------|-------------|------------|--------------|---------------|-------------------|
| 76192801-K | Proveedor A S.A. | Factura Electrónica | 1234 | 2025-10-01 | 2025-10-02 | 500000 | 95000 | 595000 | Registrada | IVA | Metropolitana | NO |
| 77654321-9 | Proveedor B Ltda. | Factura Electrónica | 5678 | 2025-10-15 | 2025-10-16 | 500000 | 95000 | 595000 | Registrada | IVA | Metropolitana | NO |
| 88999888-7 | Empresa Fantasma SpA | Factura Electrónica | 9999 | 2025-11-01 | 2025-11-01 | 15000000 | 2850000 | 17850000 | Pendiente | IVA | Magallanes | SI |
| 99888777-K | Proveedor Dudoso Ltda. | Factura Electrónica | 1111 | 2025-11-05 | 2025-11-05 | 25000000 | 4750000 | 29750000 | Pendiente | IVA | Arica | SI |
| 76192801-K | Proveedor A S.A. | Boleta Electrónica | 2222 | 2025-11-07 | 2025-11-07 | 100000 | 19000 | 119000 | Registrada | IVA | Metropolitana | NO |

### 🔍 Características de los Casos Sospechosos

**Registro 3 - Empresa Fantasma SpA (⚠️ ALTA PRIORIDAD)**
- ✅ **Emisor nuevo**: Primera vez que aparece en el sistema
- ✅ **Región diferente**: Magallanes (lejos de operación normal en RM)
- ✅ **Monto anormal**: $17.850.000 (3000% sobre promedio)
- ✅ **Recepción inmediata**: Mismo día de emisión
- ✅ **Estado pendiente**: No registrada aún

**Registro 4 - Proveedor Dudoso Ltda. (⚠️ CRÍTICO)**
- ✅ **Emisor nuevo**: No existe historial
- ✅ **Región extrema**: Arica (zona de riesgo)
- ✅ **Monto muy alto**: $29.750.000 (5000% sobre promedio)
- ✅ **Recepción inmediata**: Sin tiempo de validación
- ✅ **Estado pendiente**: Requiere aprobación

### 📊 Reglas de Detección

#### 1. Emisor Nuevo (🆕)
- **Criterio**: RUT no aparece en registros históricos
- **Nivel**: Advertencia
- **Acción**: Solicitar validación de existencia SII

#### 2. Región Diferente (🌍)
- **Criterio**: Región del emisor != Región operacional base (RM)
- **Nivel**: Advertencia Media
- **Acción**: Verificar razón comercial

#### 3. Monto Anormal (💰)
- **Criterio**: Monto > 3x promedio histórico del emisor
- **Nivel**: Advertencia Alta
- **Acción**: Aprobación manual requerida

#### 4. Recepción Inmediata (⏱️)
- **Criterio**: Fecha_Recepcion == Fecha_Emision
- **Nivel**: Advertencia
- **Acción**: Revisar autenticidad

#### 5. Combinación Crítica (🚨)
- **Criterio**: Emisor nuevo + Región diferente + Monto alto
- **Nivel**: CRÍTICO
- **Acción**: Bloquear registro automático

### 🎯 Score de Riesgo

```javascript
riesgoScore = 0;
if (esNuevoProveedor) riesgoScore += 30;
if (regionDiferente) riesgoScore += 20;
if (montoAnormal) riesgoScore += 40;
if (recepcionInmediata) riesgoScore += 10;

// Clasificación
0-20:   ✅ Bajo Riesgo (Aprobar automáticamente)
21-50:  ⚠️ Riesgo Medio (Revisar manualmente)
51-100: 🚨 Alto Riesgo (Bloquear hasta validación)
```

### 📝 Formato Excel para SharePoint

Copiar y pegar en el archivo `Contabilida.xlsx`:

```
RUT_Emisor	Razon_Social_Emisor	Tipo_DTE	Folio_DTE	Fecha_Emision	Fecha_Recepcion	Monto_Neto	Monto_IVA	Monto_Total	Estado_RCV	Codigo_Impto	Region_Emisor	Es_Nuevo_Proveedor
76192801-K	Proveedor A S.A.	Factura Electrónica	1234	2025-10-01	2025-10-02	500000	95000	595000	Registrada	IVA	Metropolitana	NO
77654321-9	Proveedor B Ltda.	Factura Electrónica	5678	2025-10-15	2025-10-16	500000	95000	595000	Registrada	IVA	Metropolitana	NO
88999888-7	Empresa Fantasma SpA	Factura Electrónica	9999	2025-11-01	2025-11-01	15000000	2850000	17850000	Pendiente	IVA	Magallanes	SI
99888777-K	Proveedor Dudoso Ltda.	Factura Electrónica	1111	2025-11-05	2025-11-05	25000000	4750000	29750000	Pendiente	IVA	Arica	SI
76192801-K	Proveedor A S.A.	Boleta Electrónica	2222	2025-11-07	2025-11-07	100000	19000	119000	Registrada	IVA	Metropolitana	NO
```

### 🔄 Proceso de Actualización

1. Abrir SharePoint: https://trimpulso-my.sharepoint.com/
2. Navegar al archivo `Contabilida.xlsx`
3. Agregar las nuevas columnas:
   - `Region_Emisor` (texto)
   - `Es_Nuevo_Proveedor` (SI/NO)
4. Pegar los datos de ejemplo
5. Guardar cambios
6. Ejecutar sincronización: `npm run sync`

---

**Nota**: Estos datos son ficticios para demostración del sistema de alertas.
