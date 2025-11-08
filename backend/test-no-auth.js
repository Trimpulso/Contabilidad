import fetch from 'node-fetch';

async function testNoAuth() {
  try {
    console.log('🔓 Probando acceso sin autenticación...\n');
    
    // Obtener estadísticas SIN token
    const response = await fetch('http://localhost:3000/api/security/stats');
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Datos recibidos SIN autenticación:');
      console.log(`   Total DTEs: ${data.total}`);
      console.log(`   Bloqueados: ${data.bloqueados}`);
      console.log(`   Score promedio: ${data.scorePromedio}`);
    } else {
      console.log('❌ Error:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testNoAuth();
