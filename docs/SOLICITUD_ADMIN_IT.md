# 📋 SOLICITUD PARA ADMINISTRADOR DE TI - Registrar Aplicación en Azure

**Para**: Administrador de TI de Trimpulso
**De**: job.llanos@trimpulso.cl
**Asunto**: Registrar aplicación en Azure AD para acceso a SharePoint

---

## 🎯 Objetivo

Necesitamos registrar una aplicación en Azure AD para conectar automáticamente con SharePoint y descargar archivos de forma programática.

## 📝 Información de la Aplicación

| Propiedad | Valor |
|-----------|-------|
| **Nombre de la Aplicación** | Contabilidad-Dashboard |
| **Descripción** | Sincronización automática de datos de SharePoint para dashboard de contabilidad |
| **Tipo de Aplicación** | Aplicación de escritorio / Script |
| **Cuenta Soportadas** | Solo mi organización (Trimpulso) |
| **Propósito** | Lectura y descarga de archivos Excel desde SharePoint |

## 🔑 Pasos a Realizar

### 1. Registrar la Aplicación en Azure AD

1. Ve a: https://portal.azure.com
2. Busca: "Azure Active Directory"
3. Ve a: "Registros de aplicaciones"
4. Haz clic: "+ Nuevo registro"
5. Completa:
   - Nombre: `Contabilidad-Dashboard`
   - Tipos de cuenta: `Solo mi organización`
   - URI de redirección: (dejar vacío)
6. Haz clic: "Registrar"

### 2. Copiar Client ID

1. En la app registrada, ve a: "Información general"
2. Copia: "ID de aplicación (cliente)"
3. **Esto es importante: CLIENT_ID**

### 3. Crear Client Secret

1. Ve a: "Certificados y secretos"
2. Haz clic: "+ Nuevo secreto de cliente"
3. Completa:
   - Descripción: `Contabilidad-Dashboard-Secret`
   - Expira en: `24 meses`
4. Haz clic: "Agregar"
5. **Copia el "Valor"** (solo aparece una vez)
6. **Esto es importante: CLIENT_SECRET**

### 4. Agregar Permisos

1. Ve a: "Permisos de API"
2. Haz clic: "+ Agregar permiso"
3. Selecciona: "Microsoft Graph"
4. Busca y agrega estos permisos:
   - ✅ `Files.Read.All`
   - ✅ `Files.ReadWrite.All`
   - ✅ `Sites.Read.All`
   - ✅ `Sites.ReadWrite.All`
5. Haz clic: "Agregar permisos"

### 5. Conceder Consentimiento del Administrador (IMPORTANTE)

1. En "Permisos de API"
2. Haz clic: "Conceder consentimiento del administrador para Trimpulso"
3. Confirma

## 📤 Enviar Información

Una vez completados los pasos, por favor envía:

```
CLIENT_ID: ______________________________
CLIENT_SECRET: ______________________________
TENANT_ID: 9c33f678-1021-46f8-8573-516a0de0929c
```

## 🔒 Seguridad

- Los valores CLIENT_ID y CLIENT_SECRET serán guardados en un archivo local (.gitignore)
- NO se commitearán a GitHub
- Solo se usarán en la máquina de desarrollo
- El CLIENT_SECRET es sensible - guardar de forma segura

## 💼 Caso de Uso

Esta aplicación permitirá:
- Conectar automáticamente con SharePoint
- Descargar archivo: `Contabilidad.xlsx`
- Extraer datos y crear dashboard
- Automatizar sincronización de datos

---

**Contacto**: job.llanos@trimpulso.cl
**Repositorio**: https://github.com/Trimpulso/Contabilidad
