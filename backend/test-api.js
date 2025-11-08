import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Iniciando pruebas de API...\n');
  
  try {
    // Test 1: Login
    console.log('1️⃣ Probando login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trimpulso.cl',
        password: 'demo123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso:', loginData.user);
    console.log('🔑 Token:', loginData.token.substring(0, 20) + '...\n');
    
    const token = loginData.token;
    
    // Test 2: Get user profile
    console.log('2️⃣ Obteniendo perfil de usuario...');
    const profileResponse = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const profileData = await profileResponse.json();
    console.log('✅ Perfil:', profileData, '\n');
    
    // Test 3: Get records
    console.log('3️⃣ Obteniendo registros...');
    const recordsResponse = await fetch(`${API_URL}/records`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const recordsData = await recordsResponse.json();
    console.log(`✅ Registros: ${recordsData.records.length} de ${recordsData.pagination.total} totales`);
    console.log('📄 Primer registro:', recordsData.records[0], '\n');
    
    // Test 4: Get stats summary
    console.log('4️⃣ Obteniendo estadísticas...');
    const statsResponse = await fetch(`${API_URL}/stats/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const statsData = await statsResponse.json();
    console.log('✅ Estadísticas:', statsData, '\n');
    
    // Test 5: Get stats by month
    console.log('5️⃣ Estadísticas por mes...');
    const monthResponse = await fetch(`${API_URL}/stats/by-month`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const monthData = await monthResponse.json();
    console.log('✅ Por mes:', monthData, '\n');
    
    console.log('✨ Todas las pruebas exitosas!');
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
  }
}

testAPI();
