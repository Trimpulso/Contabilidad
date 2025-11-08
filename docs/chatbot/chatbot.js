/**
 * CAI - Chatbot de Asistencia Contable Inteligente
 * MVP v2 - Respuestas fijas + Intent Listar Proveedores + Help mejorado
 * v2.1 - Fix: Shortcuts numéricos (1-6) funcionando
 * Updated: 8/11/2025 14:30
 */

class ChatbotCAI {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.isMinimized = false;
    this.conversationHistory = [];
    this.contextData = {
      dtes: [],
      historial: [],
      excepciones: []
    };
    
    // Datos de proveedores (FIJOS para consistencia - ACTUALIZADOS CON DATOS REALES)
    this.datosProveedores = [
      { rut: '76192801-K', nombre: 'Proveedor A S.A.', region: 'Metropolitana', facturas: 2, monto: 714000, riesgo: 'BAJO', score: 10 },
      { rut: '77654321-9', nombre: 'Proveedor B Ltda.', region: 'Metropolitana', facturas: 1, monto: 595000, riesgo: 'BAJO', score: 15 },
      { rut: '88999888-7', nombre: 'Empresa Fantasma SpA', region: 'Magallanes', facturas: 1, monto: 17850000, riesgo: 'CRÍTICO', score: 100 },
      { rut: '99888777-K', nombre: 'Proveedor Dudoso Ltda.', region: 'Arica', facturas: 1, monto: 29750000, riesgo: 'CRÍTICO', score: 95 }
    ];
    
    this.init();
  }

  init() {
    this.loadContextData();
    this.setupEventListeners();
    this.showWelcomeMessage();
  }

  /**
   * Cargar datos del contexto
   */
  loadContextData() {
    try {
      // Cargar DTEs desde JSON
      fetch('./data/contabilidad.json')
        .then(res => res.json())
        .then(data => {
          this.contextData.dtes = data.hojas?.Hoja1 || [];
        })
        .catch(err => console.warn('No se pudo cargar contabilidad.json:', err));

      // Cargar historial de localStorage
      const historial = localStorage.getItem('historialAcciones');
      this.contextData.historial = historial ? JSON.parse(historial) : [];

      // Cargar excepciones de localStorage
      const excepciones = localStorage.getItem('excepcionesAprobadas');
      this.contextData.excepciones = excepciones ? JSON.parse(excepciones) : [];
    } catch (error) {
      console.error('Error cargando contexto:', error);
    }
  }

  /**
   * Setup de Event Listeners
   */
  setupEventListeners() {
    const toggle = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const minimizeBtn = document.getElementById('chatbotMinimize');
    const sendBtn = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');

    if (toggle) toggle.addEventListener('click', () => this.toggleChat());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeChat());
    if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.minimizeChat());
    if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
  }

  /**
   * Toggle chat window
   */
  toggleChat() {
    const window = document.getElementById('chatbotWindow');
    if (!window) return;

    this.isOpen = !this.isOpen;
    this.isMinimized = false;

    if (this.isOpen) {
      window.classList.add('open');
      window.classList.remove('minimized');
      document.getElementById('chatbotInput')?.focus();
    } else {
      window.classList.remove('open');
    }
  }

  /**
   * Cerrar chat
   */
  closeChat() {
    const window = document.getElementById('chatbotWindow');
    if (window) {
      window.classList.remove('open');
      window.classList.remove('minimized');
    }
    this.isOpen = false;
    this.isMinimized = false;
  }

  /**
   * Minimizar chat
   */
  minimizeChat() {
    const window = document.getElementById('chatbotWindow');
    if (!window) return;

    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      window.classList.add('minimized');
    } else {
      window.classList.remove('minimized');
    }
  }

  /**
   * Enviar mensaje
   */
  sendMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    // Agregar mensaje del usuario
    this.addMessage(text, 'user');
    input.value = '';

    // Mostrar indicador de escritura
    this.showTyping();

    // Procesar respuesta después de 500ms
    setTimeout(() => {
      this.processInput(text);
      this.hideTyping();
    }, 500);
  }

  /**
   * Procesar entrada del usuario
   */
  processInput(text) {
    const intent = this.detectIntent(text);
    const response = this.getResponse(intent, text);
    this.addMessage(response, 'bot');
  }

  /**
   * Detectar intención del usuario
   */
  detectIntent(text) {
    const lower = text.toLowerCase().trim();

    // SHORTCUTS POR NÚMERO
    if (lower === '1' || lower === 'uno') return 'riesgo_critico';
    if (lower === '2' || lower === 'dos') return 'deuda_total';
    if (lower === '3' || lower === 'tres') return 'excepciones';
    if (lower === '4' || lower === 'cuatro') return 'aprobados';
    if (lower === '5' || lower === 'cinco') return 'listar_proveedores';
    if (lower === '6' || lower === 'seis') return 'proveedor_info';

    // Intent 1: Riesgo Crítico
    if (
      lower.includes('riesgo crítico') ||
      lower.includes('critico') ||
      lower.includes('bloqueado') ||
      lower.includes('peligro') ||
      lower.includes('cuántos en riesgo')
    ) {
      return 'riesgo_critico';
    }

    // Intent 2: Deuda Total
    if (
      lower.includes('deuda') ||
      lower.includes('pendiente') ||
      lower.includes('debo') ||
      lower.includes('monto total') ||
      lower.includes('cuánto debo')
    ) {
      return 'deuda_total';
    }

    // Intent 3: Excepciones
    if (
      lower.includes('excepción') ||
      lower.includes('excepcion') ||
      lower.includes('aprobada') ||
      lower.includes('supervisada') ||
      lower.includes('cuántas excepciones')
    ) {
      return 'excepciones';
    }

    // Intent 4: Aprobados
    if (
      lower.includes('aprobado') ||
      lower.includes('aprob') ||
      lower.includes('cuántas aprobadas') ||
      lower.includes('fueron aprobadas')
    ) {
      return 'aprobados';
    }

    // Intent 5: Listar Proveedores (NUEVO)
    if (
      lower.includes('listar proveedor') ||
      lower.includes('proveedores activos') ||
      lower.includes('cuantos proveedor') ||
      lower.includes('todos los proveedor')
    ) {
      return 'listar_proveedores';
    }

    // Intent 6: Info Proveedor
    if (
      lower.includes('proveedor') ||
      lower.includes('rut') ||
      lower.includes('empresa') ||
      lower.includes('información') ||
      lower.includes('informacion')
    ) {
      return 'proveedor_info';
    }

    // Intent por defecto
    return 'help';
  }

  /**
   * Generar respuesta según intent
   */
  getResponse(intent, userText) {
    switch (intent) {
      case 'riesgo_critico':
        return this.getRiesgoCritico();
      case 'deuda_total':
        return this.getDeudaTotal();
      case 'excepciones':
        return this.getExcepciones();
      case 'aprobados':
        return this.getAprobados();
      case 'listar_proveedores':
        return this.getListarProveedores();
      case 'proveedor_info':
        return this.getProveedorInfo(userText);
      default:
        return this.getHelpMessage();
    }
  }

  /**
   * INTENT 1: Riesgo Crítico (RESPUESTA FIJA - DATOS REALES)
   */
  getRiesgoCritico() {
    return (
      `⚠️ FACTURAS EN RIESGO CRÍTICO: 2\n\n` +
      `🚫 DTE #3 - Empresa Fantasma SpA\n   Score: 100/100\n   Monto: $17,850,000\n   RUT: 88999888-7\n\n` +
      `🚫 DTE #4 - Proveedor Dudoso Ltda.\n   Score: 95/100\n   Monto: $29,750,000\n   RUT: 99888777-K`
    );
  }

  /**
   * INTENT 2: Deuda Total (RESPUESTA FIJA - DATOS REALES)
   */
  getDeudaTotal() {
    return (
      `💰 DEUDA TOTAL:\n\n` +
      `Monto Total: $48,909,000\n` +
      `Proveedores: 4\n` +
      `Facturas: 5\n` +
      `Promedio por factura: $9,781,800`
    );
  }

  /**
   * INTENT 3: Excepciones (RESPUESTA FIJA)
   */
  getExcepciones() {
    return (
      `⚠️ EXCEPCIONES APROBADAS: 1\n\n` +
      `📋 DTE #3 - Empresa Fantasma S.A.\n` +
      `Justificación: Cliente importante - verificado por CEO\n` +
      `Fecha de aprobación: 8/11/2025\n` +
      `Aprobado por: Supervisor Contable`
    );
  }

  /**
   * INTENT 4: Aprobados (RESPUESTA FIJA - DATOS REALES)
   */
  getAprobados() {
    return (
      `✅ FACTURAS APROBADAS: 3\n\n` +
      `✓ DTE #1 - Proveedor A S.A. (RUT: 76192801-K)\n  Monto: $595,000\n  Estado: Registrada\n\n` +
      `✓ DTE #2 - Proveedor B Ltda. (RUT: 77654321-9)\n  Monto: $595,000\n  Estado: Registrada\n\n` +
      `✓ DTE #5 - Proveedor A S.A. (RUT: 76192801-K)\n  Monto: $119,000\n  Estado: Registrada`
    );
  }

  /**
   * INTENT 5: Listar Proveedores (NUEVO - DATOS REALES)
   */
  getListarProveedores() {
    let response = `📊 PROVEEDORES ACTIVOS: ${this.datosProveedores.length}\n\n`;
    
    this.datosProveedores.forEach((prov, idx) => {
      const riesgoEmoji = prov.riesgo === 'CRÍTICO' ? '🚫' : '✅';
      response += `${idx + 1}. ${prov.nombre}\n   RUT: ${prov.rut}\n   Región: ${prov.region}\n   Facturas: ${prov.facturas}\n   Monto Total: $${prov.monto.toLocaleString('es-CL')}\n   ${riesgoEmoji} Riesgo: ${prov.riesgo} (${prov.score}/100)\n\n`;
    });

    return response;
  }

  /**
   * INTENT 6: Info Proveedor (MEJORADO - BÚSQUEDA FLEXIBLE)
   */
  getProveedorInfo(userText) {
    // Buscar si menciona RUT (con formato flexible)
    const rutMatch = userText.match(/\d{1,2}\.?\d{3}\.?\d{3}-?[0-9K]/i);
    let rutBuscado = rutMatch ? rutMatch[0] : null;
    
    // Normalizar RUT (convertir a formato con puntos y guion)
    if (rutBuscado) {
      rutBuscado = rutBuscado.replace(/\./g, '').replace(/-/g, '');
      rutBuscado = rutBuscado.slice(0, -1) + '-' + rutBuscado.slice(-1);
      // Agregar puntos si no los tiene
      if (!rutBuscado.includes('.')) {
        rutBuscado = rutBuscado.slice(0, 2) + '.' + rutBuscado.slice(2, 5) + '.' + rutBuscado.slice(5);
      }
    }
    
    let proveedor = null;

    // Primero buscar por RUT si lo encuentra
    if (rutBuscado) {
      proveedor = this.datosProveedores.find(p => p.rut.toLowerCase() === rutBuscado.toLowerCase());
    }

    // Si no encuentra por RUT, buscar por nombre (búsqueda flexible)
    if (!proveedor) {
      const textoBusqueda = userText.toLowerCase();
      proveedor = this.datosProveedores.find(p => {
        const nombreBajo = p.nombre.toLowerCase();
        // Buscar coincidencias parciales
        const palabras = p.nombre.toLowerCase().split(' ');
        return palabras.some(palabra => textoBusqueda.includes(palabra)) || 
               textoBusqueda.includes(nombreBajo);
      });
    }

    if (!proveedor) {
      return `❌ No encontré información del proveedor.\n\n📋 Proveedores disponibles:\n1. Proveedor A S.A.\n2. Proveedor B Ltda.\n3. Empresa Fantasma SpA\n4. Proveedor Dudoso Ltda.\n\nIntenta con:\n• Nombre completo: "Empresa Fantasma SpA"\n• RUT: "88999888-7"`;
    }

    const riesgoEmoji = proveedor.riesgo === 'CRÍTICO' ? '🚫' : '✅';
    return (
      `📋 PROVEEDOR: ${proveedor.nombre}\n\n` +
      `RUT: ${proveedor.rut}\n` +
      `Región: ${proveedor.region}\n` +
      `Facturas Asociadas: ${proveedor.facturas}\n` +
      `Monto Total: $${proveedor.monto.toLocaleString('es-CL')}\n\n` +
      `${riesgoEmoji} RIESGO: ${proveedor.riesgo} (${proveedor.score}/100)`
    );
  }

  /**
   * Mensaje de ayuda mejorado (CON PREGUNTAS NUMERADAS)
   */
  getHelpMessage() {
    return (
      `¡Hola! Soy CAI, tu asistente contable. Puedo ayudarte con:\n\n` +
      `� **PREGUNTAS QUE PUEDO RESPONDER:**\n\n` +
      `1️⃣ "¿Cuántas facturas en riesgo crítico?"\n   → Muestra facturas bloqueadas\n\n` +
      `2️⃣ "¿Cuál es la deuda total?"\n   → Calcula deuda total y promedios\n\n` +
      `3️⃣ "¿Excepciones aprobadas?"\n   → Lista excepciones supervisadas\n\n` +
      `4️⃣ "¿Cuántas facturas aprobadas?"\n   → Muestra aprobaciones recientes\n\n` +
      `5️⃣ "Listar proveedores"\n   → Muestra todos con facturas y riesgos\n\n` +
      `6️⃣ "Información de [Proveedor]"\n   → Detalles específicos del proveedor\n\n` +
      `💡 **TIP:** Puedes escribir "1", "2", "3", "4", "5" o "6"`
    );
  }

  /**
   * Mostrar mensaje de bienvenida
   */
  showWelcomeMessage() {
    setTimeout(() => {
      this.addMessage(this.getHelpMessage(), 'bot');
    }, 300);
  }

  /**
   * Agregar mensaje al chat
   */
  addMessage(text, sender = 'bot') {
    const messagesDiv = document.getElementById('chatbotMessages');
    if (!messagesDiv) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);

    // Scroll al último mensaje
    setTimeout(() => {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 0);
  }

  /**
   * Mostrar indicador de escritura
   */
  showTyping() {
    const messagesDiv = document.getElementById('chatbotMessages');
    if (!messagesDiv) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.innerHTML = `
      <div class="chatbot-message-content">
        <div class="chatbot-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    typingDiv.id = 'chatbot-typing';

    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * Ocultar indicador de escritura
   */
  hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.remove();
  }

  /**
   * Analizar riesgo de un DTE (copiado de alertas.html)
   */
  analizarDTE(dte, historico) {
    let riesgoScore = 0;
    let nivel = 'BAJO';

    const proveedoresConocidos = new Set(historico.map(r => r.RUT_Emisor));
    
    if (!proveedoresConocidos.has(dte.RUT_Emisor)) riesgoScore += 30;
    
    const regionesPermitidas = ['Metropolitana', 'Valparaíso', "O'Higgins"];
    if (!regionesPermitidas.includes(dte.Region_Emisor)) riesgoScore += 20;
    
    if (dte.Monto_Total > 15000000) riesgoScore += 40;
    
    const fechaEmision = new Date(dte.Fecha_Emision);
    const fechaRecepcion = new Date(dte.Fecha_Recepcion);
    const difDias = Math.floor((fechaRecepcion - fechaEmision) / (1000 * 60 * 60 * 24));
    if (difDias === 0) riesgoScore += 10;
    
    if (dte.Folio_DTE === '9999' || dte.Folio_DTE === '0000') riesgoScore += 15;
    
    if (dte.Estado_RCV === 'Pendiente' && dte.Monto_Total > 10000000) riesgoScore += 25;
    
    const ivaEsperado = Math.round(dte.Monto_Neto * 0.19);
    if (dte.Monto_IVA && Math.abs(dte.Monto_IVA - ivaEsperado) > 1000) riesgoScore += 30;
    
    const palabrasSospechosas = ['Fantasma', 'Dudoso', 'Temporal', 'S.A.S.', 'XX'];
    if (palabrasSospechosas.some(p => dte.Razon_Social_Emisor.includes(p))) riesgoScore += 20;

    if (riesgoScore >= 51) nivel = 'CRÍTICO';
    else if (riesgoScore >= 21) nivel = 'MEDIO';
    else nivel = 'BAJO';

    return { riesgoScore, nivel, bloqueado: nivel === 'CRÍTICO' };
  }
}

// Inicializar chatbot cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  // Inyectar HTML del chatbot
  const chatbotHTML = `
    <div class="chatbot-container">
      <button class="chatbot-button" id="chatbotToggle" title="Abrir Chat">💬</button>
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <h3>🤖 CAI - Asistente Contable</h3>
          <div class="chatbot-header-buttons">
            <button class="chatbot-header-btn" id="chatbotMinimize" title="Minimizar">_</button>
            <button class="chatbot-header-btn" id="chatbotClose" title="Cerrar">✕</button>
          </div>
        </div>
        <div class="chatbot-messages" id="chatbotMessages"></div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Escribe tu pregunta..." autocomplete="off" />
          <button class="chatbot-send-btn" id="chatbotSend" title="Enviar">📤</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // Inicializar la instancia del chatbot
  window.chatbotCAI = new ChatbotCAI();
});
