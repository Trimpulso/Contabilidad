#!/usr/bin/env node

/**
 * Script de Sincronización SharePoint
 * Conecta con Microsoft 365 y descarga/sube archivos
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class SharePointSync {
  constructor(config) {
    this.config = config;
    this.tenantId = config.tenantId;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.siteUrl = config.siteUrl;
    this.accessToken = null;
    this.siteId = null;
  }

  /**
   * Obtener token de acceso
   */
  async authenticate() {
    try {
      console.log('🔐 Autenticando con Azure AD...');
      
      const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
      
      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('scope', 'https://graph.microsoft.com/.default');
      params.append('grant_type', 'client_credentials');
      
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      console.log('✅ Autenticación exitosa\n');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error de autenticación:', error.response?.data?.error_description || error.message);
      process.exit(1);
    }
  }

  /**
   * Obtener el Drive (almacenamiento) del usuario buscando por email
   */
  async getUserDrive() {
    if (!this.accessToken) await this.authenticate();

    try {
      console.log('🔍 Buscando tu OneDrive/SharePoint...');
      
      // Buscar el sitio del usuario por email
      // En SharePoint, el sitio personal normalmente sigue el patrón:
      // /sites/usuario-email (sin dominio)
      // Pero usamos Graph API para buscarlo
      
      const userEmailLocal = this.config.userEmail.split('@')[0]; // job.llanos
      
      // Intentar búsqueda de sitios
      const searchUrl = `https://graph.microsoft.com/v1.0/sites?search=${userEmailLocal}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.value && response.data.value.length > 0) {
        const site = response.data.value[0];
        this.siteId = site.id;
        console.log(`✅ Sitio encontrado: ${site.displayName}\n`);
        return site;
      } else {
        // Fallback: construir URL manualmente
        console.warn('⚠️ Sitio no encontrado por búsqueda, usando URL manual...\n');
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Error buscando sitio:', error.response?.data?.error?.message || error.message);
      console.log('� Intentando con acceso directo a OneDrive...\n');
      return null;
    }
  }

  /**
   * Descargar un archivo usando un enlace para compartir (sharing link)
   * Soporta URLs como:
   *   https://<tenant>-my.sharepoint.com/:x:/g/personal/<user>/....
   */
  async downloadBySharingLink(sharingUrl) {
    if (!this.accessToken) await this.authenticate();

    try {
      console.log(`\n🔗 Descarga por enlace compartido...`);
      // Codificar la URL en base64URL y anteponer 'u!'
      const b64 = Buffer.from(sharingUrl).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
      const shareId = `u!${b64}`;

      // Obtener metadatos del elemento
      const metaUrl = `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem`;
      const metaRes = await axios.get(metaUrl, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      const fileName = metaRes.data?.name || 'archivo_descargado';
      console.log(`📄 Archivo: ${fileName}`);

      // Descargar contenido
      const contentUrl = `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem/content`;
      const contentRes = await axios.get(contentUrl, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        responseType: 'arraybuffer'
      });

      // Guardar en carpeta data
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const outputPath = path.join(dataDir, fileName);
      fs.writeFileSync(outputPath, contentRes.data);
      console.log(`✅ Descargado en: ${outputPath}`);
      return outputPath;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      console.error('❌ Error descargando por enlace:', message);
      if (error.response?.data) {
        try {
          console.error('📦 Detalle Graph:', JSON.stringify(error.response.data, null, 2));
        } catch {}
      }
      if (message?.includes('Access denied') || error.response?.status === 403) {
        console.log('\n💡 Falta consentimiento de permisos para la aplicación.');
        console.log('   Requeridos: Files.Read.All y/o Sites.Read.All (permisos de aplicación).');
      }
      return null;
    }
  }

  /**
   * Listar archivos en SharePoint
   */
  async listFiles(folderPath = '') {
    if (!this.accessToken) await this.authenticate();

    try {
      console.log(`📁 Listando archivos en SharePoint...\n`);
      
      // Para SharePoint personal (OneDrive), el patrón de sitio es:
      // /sites/usuario@organizacion.onmicrosoft.com
      // O podemos usar el email local del usuario
      
      const userEmailLocal = this.config.userEmail.split('@')[0]; // job.llanos
      const domain = 'trimpulso.onmicrosoft.com'; // Dominio de Entra ID
      
      // Formato correcto: /sites/usuario@dominio
      const siteUrl = `/sites/${this.config.userEmail.split('@')[0]}@${domain}`;
      
      let url = `https://graph.microsoft.com/v1.0/sites/trimpulso-my.sharepoint.com${siteUrl}/drive/root/children`;
      
      console.log(`🔗 Intentando acceso a: ${siteUrl}`);
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.value && response.data.value.length > 0) {
        console.log(`\n📂 Archivos encontrados:\n`);
        response.data.value.forEach((item, index) => {
          const icon = item.folder ? '📁' : '📄';
          const size = item.size ? ` (${(item.size / 1024 / 1024).toFixed(2)} MB)` : '';
          console.log(`${index + 1}. ${icon} ${item.name}${size}`);
        });
      } else {
        console.log('No hay archivos en esta ubicación');
      }

      return response.data.value || [];
    } catch (error) {
      console.error('❌ Error listando archivos:', error.response?.data?.error?.message || error.message);
      
      // Mostrar detalles del error para debugging
      if (error.response?.data?.error?.details) {
        console.error('📋 Detalles:', error.response.data.error.details);
      }
      
      console.log('\n💡 Soluciones:');
      console.log('1. Verifica que la aplicación tiene permisos: Sites.Read.All');
      console.log('2. Confirma que el usuario y dominio en config.json son correctos');
      console.log('3. Asegúrate de que el archivo Contabilidad.xlsx existe en SharePoint');
      
      return [];
    }
  }

  /**
   * Descargar archivo
   */
  async downloadFile(fileName) {
    if (!this.accessToken) await this.authenticate();

    try {
      console.log(`\n📥 Descargando: ${fileName}`);
      
      const url = `https://graph.microsoft.com/v1.0/sites/root/drive/root:/${fileName}:/content`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      });

      // Crear carpeta data si no existe
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const outputPath = path.join(dataDir, fileName);
      fs.writeFileSync(outputPath, response.data);
      
      console.log(`✅ Descargado: ${outputPath}\n`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error descargando:', error.response?.data?.error?.message || error.message);
      return null;
    }
  }
}

// Main
async function main() {
  try {
    // Cargar configuración
    const configPath = path.join(__dirname, 'config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ Archivo config.json no encontrado');
      console.log('   Crear: connectors/sharepoint/config.json');
      console.log('   Con tus credenciales de Azure AD');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    // Validar configuración
    if (!config.tenantId || !config.clientId || !config.clientSecret) {
      console.error('❌ Configuración incompleta en config.json');
      console.log('   Necesitas: tenantId, clientId, clientSecret, siteUrl');
      process.exit(1);
    }

    const sync = new SharePointSync(config);

    console.log('\n========================================');
    console.log('🔗 SINCRONIZACIÓN SHAREPOINT');
    console.log('========================================\n');

    // Autenticar
    await sync.authenticate();

    // Obtener drive del usuario
    await sync.getUserDrive();

    // Listar archivos
    const files = await sync.listFiles();

    // Si hay argumentos, descargar archivo específico
    const args = process.argv.slice(2);
    if (args.length > 0) {
      const target = args[0];
      if (/^https?:\/\//i.test(target)) {
        // Es un enlace completo de SharePoint
        await sync.downloadBySharingLink(target);
      } else {
        await sync.downloadFile(target);
      }
    }

    console.log('========================================');
    console.log('✅ Proceso completado');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
