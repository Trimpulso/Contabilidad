# Configuración de Permisos para SharePoint

## Estado Actual
✅ Aplicación registrada: **Contabilidad-Dashboard**  
✅ CLIENT_ID: `7f6191c8-099e-4233-9024-1413bc1f458f`  
✅ CLIENT_SECRET: Obtenido  
❌ Permisos: **NECESITAN CONFIGURARSE**

## Problema Encontrado
La aplicación intenta acceder a SharePoint pero devuelve error: `General exception while processing`

Esto ocurre porque la app NO tiene los permisos necesarios en Azure AD para acceder a SharePoint.

## Solución: Agregar Permisos en Azure AD

### Paso 1: Ir a la Aplicación en Entra ID
1. Abre: https://portal.azure.com
2. Busca "Registros de aplicaciones"
3. Selecciona: **Contabilidad-Dashboard**

### Paso 2: Acceder a Permisos de API
1. En el menú izquierdo, haz click en: **Permisos de API**
2. Verás una sección "Permisos configurados"

### Paso 3: Agregar Permisos para Microsoft Graph
1. Haz click en: **+ Agregar un permiso**
2. Selecciona: **Microsoft Graph**
3. Elige: **Permisos de aplicación** (NO delegados)

### Paso 4: Buscar y Seleccionar Permisos
En la búsqueda, busca y selecciona estos permisos:

**REQUERIDOS (mínimo):**
- [ ] `Sites.Read.All` - Leer todos los sitios SharePoint
- [ ] `Files.Read.All` - Leer todos los archivos

**OPCIONALES (para descarga futura):**
- [ ] `Files.ReadWrite.All` - Leer y escribir archivos

### Paso 5: Otorgar Consentimiento como Admin
Una vez agregados los permisos:

1. Verás el botón: **Otorgar consentimiento del administrador para [Organización]**
2. Haz click en ese botón
3. Confirma en el diálogo que aparece

**IMPORTANTE:** Este paso requiere permisos de **administrador**. Si no eres admin:
- Pide a tu administrador de TI que realice este paso
- O usa "Solicitar consentimiento" para que apruebe

### Paso 6: Verificar la Instalación
Los permisos deben aparecer así:

```
✅ Sites.Read.All (Consentimiento otorgado por [Organización])
✅ Files.Read.All (Consentimiento otorgado por [Organización])
```

## URL Rápida
Directo a permisos: 
```
https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/APIPermissions/appId/7f6191c8-099e-4233-9024-1413bc1f458f
```

## Después de Agregar Permisos

Una vez completado, ejecuta nuevamente:

```bash
cd connectors/sharepoint
npm run sync
```

Deberías ver el listado de archivos de SharePoint.

## Permisos Mínimos vs Extendidos

| Objetivo | Permisos de aplicación necesarios | Comentario |
|----------|-----------------------------------|------------|
| Descargar archivo vía enlace (shares API) | Files.Read.All | Suficiente para `GET /shares/{shareId}/driveItem/content` |
| Listar contenido de sitios SharePoint | Sites.Read.All + Files.Read.All | `Sites.Read.All` para estructura, `Files.Read.All` para contenido |
| Escribir (subir/actualizar) archivos | Files.ReadWrite.All (y opcional Sites.ReadWrite.All) | Requiere consentimiento admin |

Si tienes problemas, empieza sólo con `Files.Read.All` y concede consentimiento; prueba la descarga por enlace. Si sigue fallando, añade también `Sites.Read.All`.

## Verificando el Consentimiento

Tras pulsar "Conceder consentimiento de administrador":
1. El estado debe cambiar a "Concedido para Trimpulso".
2. Si no cambia tras unos segundos, pulsa en "Actualizar".
3. Espera hasta 5 minutos para propagación antes de reintentar el script.

## Reintentar la Descarga por Enlace

Una vez concedido el consentimiento, ejecuta:

```powershell
cd connectors/sharepoint
npm run sync -- "<TU_LINK_COMPLETO_DE_SHAREPOINT>"
```

Salida esperada (ejemplo):
```
🔗 Descarga por enlace compartido...
📄 Archivo: Contabilidad.xlsx
✅ Descargado en: .../data/Contabilidad.xlsx
```

## Alternativa: Autenticación Delegada (Device Code Flow)

Si no puedes obtener consentimiento de administrador:

1. Agrega permisos delegados: Files.Read, offline_access.
2. Implementar script de Device Code que genere un código y URL para login.
3. El usuario inicia sesión y el script obtiene un token con alcance de lectura.

Esta alternativa sólo da acceso a los datos del usuario autenticado, NO a todos los sitios.

## Próximos Pasos Sugeridos

1. Conceder consentimiento admin a Files.Read.All (y Sites.Read.All si quieres listar).
2. Ejecutar descarga por enlace.
3. Confirmar archivo guardado en `data/`.
4. (Luego) Procesar el Excel y alimentar el dashboard.

## Ayuda Adicional

### Si ves error "General exception while processing"
- ✅ Verifica que agregaste los permisos correctamente
- ✅ Espera 5-10 minutos para que se propaguen los cambios
- ✅ Confirma que otorgaste el consentimiento del admin

### Si ves error "Invalid token claims"
- La credencial no tiene los permisos. Vuelve a Paso 1.

### Si nada funciona
1. Copia los permisos exactos mostrados arriba
2. Ve a Azure Portal
3. Navega a "Registros de aplicaciones" → "Contabilidad-Dashboard"
4. Sección "Permisos de API"
5. Captura screenshot y comparte los permisos que ves
