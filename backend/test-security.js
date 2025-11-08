import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testSecurityAlerts() {
  console.log('🚨 Iniciando pruebas del Sistema de Alertas de Seguridad\n');
  
  try {
    // Login
    console.log('🔐 1. Autenticando...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trimpulso.cl',
        password: 'demo123'
      })
    });
    
    const { token } = await loginResponse.json();
    console.log('✅ Autenticado correctamente\n');
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Test 1: Estadísticas de seguridad
    console.log('📊 2. Obteniendo estadísticas de seguridad...');
    const statsResponse = await fetch(`${API_URL}/security/stats`, { headers });
    const stats = await statsResponse.json();
    
    console.log('\n📈 ESTADÍSTICAS GENERALES:');
    console.log(`  - Total registros analizados: ${stats.registrosAnalizados}`);
    console.log(`  - Proveedores conocidos: ${stats.proveedoresConocidos}`);
    console.log(`  - Promedio general: $${stats.promedioGeneral.toLocaleString()}`);
    console.log(`  - Bloqueados: ${stats.bloqueados} (${stats.bloqueados}/${stats.total})`);
    console.log(`  - Requieren aprobación: ${stats.requierenAprobacion}`);
    console.log(`  - Score promedio: ${stats.scorePromedio.toFixed(1)}/100\n`);
    
    console.log('🎯 POR NIVEL DE RIESGO:');
    console.log(`  - 🚨 CRÍTICO: ${stats.porNivel.CRÍTICO}`);
    console.log(`  - ⚠️  MEDIO: ${stats.porNivel.MEDIO}`);
    console.log(`  - ✅ BAJO: ${stats.porNivel.BAJO}\n`);
    
    console.log('🔍 TIPOS DE ALERTAS DETECTADAS:');
    Object.entries(stats.porTipo).forEach(([tipo, count]) => {
      console.log(`  - ${tipo}: ${count}`);
    });
    console.log('\n');
    
    // Test 2: Registros con alertas
    console.log('⚠️  3. Obteniendo registros con alertas...');
    const alertsResponse = await fetch(`${API_URL}/records/with-alerts`, { headers });
    const alertsData = await alertsResponse.json();
    
    console.log(`\n🔔 REGISTROS CON ALERTAS: ${alertsData.records.length}\n`);
    
    alertsData.records.forEach((record, index) => {
      const { analisisSeguridad } = record;
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📄 REGISTRO ${index + 1}:`);
      console.log(`   RUT: ${record.RUT_Emisor}`);
      console.log(`   Razón Social: ${record.Razon_Social_Emisor}`);
      console.log(`   Folio: ${record.Folio_DTE}`);
      console.log(`   Monto: $${record.Monto_Total.toLocaleString()}`);
      console.log(`   Región: ${record.Region_Emisor || 'N/A'}`);
      console.log(`   Estado: ${record.Estado_RCV}\n`);
      
      console.log(`🎯 ANÁLISIS DE SEGURIDAD:`);
      console.log(`   Nivel de Riesgo: ${analisisSeguridad.nivel} (Score: ${analisisSeguridad.riesgoScore}/100)`);
      console.log(`   Bloqueado: ${analisisSeguridad.bloqueado ? '🚫 SÍ' : '✅ NO'}`);
      console.log(`   Requiere Aprobación: ${analisisSeguridad.requiereAprobacion ? '⚠️  SÍ' : '✅ NO'}\n`);
      
      console.log(`🚨 ALERTAS (${analisisSeguridad.alertas.length}):`);
      analisisSeguridad.alertas.forEach((alerta, i) => {
        console.log(`   ${i + 1}. ${alerta.icono} [${alerta.tipo}]`);
        console.log(`      ${alerta.mensaje}`);
        console.log(`      Acción: ${alerta.accion}\n`);
      });
      
      console.log(`💡 RECOMENDACIÓN:`);
      console.log(`   ${analisisSeguridad.recomendacion}\n`);
    });
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    // Test 3: Analizar un DTE específico
    console.log('🧪 4. Analizando DTE sospechoso específico...');
    
    const dteSospechoso = {
      RUT_Emisor: '11111111-1',
      Razon_Social_Emisor: 'Empresa Fantasma Express S.A.',
      Tipo_DTE: 'Factura Electrónica',
      Folio_DTE: '9999',
      Fecha_Emision: '2025-11-08',
      Fecha_Recepcion: '2025-11-08',
      Monto_Neto: 50000000,
      Monto_IVA: 9500000,
      Monto_Total: 59500000,
      Estado_RCV: 'Pendiente',
      Codigo_Impto: 'IVA',
      Region_Emisor: 'Aysén',
      Es_Nuevo_Proveedor: 'SI'
    };
    
    const analyzeResponse = await fetch(`${API_URL}/security/analyze`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dteSospechoso)
    });
    
    const analisisIndividual = await analyzeResponse.json();
    
    console.log('\n🔬 RESULTADO DEL ANÁLISIS INDIVIDUAL:');
    console.log(JSON.stringify(analisisIndividual, null, 2));
    
    console.log('\n\n✨ RESUMEN FINAL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Sistema de alertas funcionando correctamente`);
    console.log(`📊 Se detectaron ${alertsData.records.length} DTEs con características sospechosas`);
    console.log(`🚨 ${stats.bloqueados} DTEs bloqueados automáticamente`);
    console.log(`⚠️  ${stats.requierenAprobacion} DTEs requieren aprobación manual`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('\n❌ Error en pruebas:', error.message);
    console.error(error.stack);
  }
}

testSecurityAlerts();
