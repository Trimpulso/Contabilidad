/**
 * CAI - Chatbot de Asistencia Contable Inteligente
 * MVP v1 - Interfaz Flotante + 5 Intents Básicos
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
    const lower = text.toLowerCase();

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

    // Intent 5: Info Proveedor
    if (
      lower.includes('proveedor') ||
      lower.includes('rut') ||
      lower.includes('empresa') ||
      lower.includes('información')
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
      case 'proveedor_info':
        return this.getProveedorInfo(userText);
      default:
        return this.getHelpMessage();
    }
  }

  /**
   * INTENT 1: Riesgo Crítico
   */
  getRiesgoCritico() {
    const dtes = this.contextData.dtes;
    
    // Analizar riesgos
    const riesgos = dtes.map((dte, idx) => {
      const analisis = this.analizarDTE(dte, dtes);
      return {
        id: idx + 1,
        nombre: dte.Razon_Social_Emisor,
        score: analisis.riesgoScore,
        nivel: analisis.nivel,
        bloqueado: analisis.bloqueado
      };
    });

    const criticos = riesgos.filter(r => r.nivel === 'CRÍTICO');

    if (criticos.length === 0) {
      return '✅ Excelente noticia: No hay facturas en riesgo CRÍTICO en este momento.';
    }

    let response = `⚠️ Hay ${criticos.length} factura${criticos.length > 1 ? 's' : ''} en riesgo CRÍTICO:\n\n`;
    criticos.slice(0, 5).forEach(dte => {
      response += `🚫 DTE #${dte.id} - ${dte.nombre}\n   Score: ${dte.score}/100\n\n`;
    });

    return response;
  }

  /**
   * INTENT 2: Deuda Total
   */
  getDeudaTotal() {
    const dtes = this.contextData.dtes;
    const deudaTotal = dtes.reduce((sum, dte) => sum + (dte.Monto_Total || 0), 0);
    const cantProveedores = new Set(dtes.map(d => d.RUT_Emisor)).size;
    const promedio = dtes.length > 0 ? Math.round(deudaTotal / dtes.length) : 0;

    return (
      `💰 DEUDA TOTAL:\n\n` +
      `Monto Total: $${deudaTotal.toLocaleString('es-CL')}\n` +
      `Proveedores: ${cantProveedores}\n` +
      `Facturas: ${dtes.length}\n` +
      `Promedio por factura: $${promedio.toLocaleString('es-CL')}`
    );
  }

  /**
   * INTENT 3: Excepciones
   */
  getExcepciones() {
    const excepciones = this.contextData.excepciones;

    if (excepciones.length === 0) {
      return '✅ No hay excepciones aprobadas hasta el momento.';
    }

    let response = `⚠️ EXCEPCIONES APROBADAS: ${excepciones.length}\n\n`;
    excepciones.slice(0, 5).forEach(exc => {
      const fecha = new Date(exc.fecha).toLocaleDateString('es-CL');
      response += `📋 DTE #${exc.dteId} - ${exc.razonSocial}\n`;
      response += `   Justificación: ${exc.comentario}\n`;
      response += `   Fecha: ${fecha}\n\n`;
    });

    return response;
  }

  /**
   * INTENT 4: Aprobados
   */
  getAprobados() {
    const historial = this.contextData.historial;
    const aprobados = historial.filter(h => h.accion === 'aprobado');

    if (aprobados.length === 0) {
      return '📋 No hay facturas aprobadas en el historial.';
    }

    let response = `✅ FACTURAS APROBADAS: ${aprobados.length}\n\n`;
    aprobados.slice(0, 5).forEach(aprobado => {
      const fecha = new Date(aprobado.fecha).toLocaleDateString('es-CL');
      response += `✓ DTE #${aprobado.dteId}\n`;
      response += `  Comentario: ${aprobado.comentario || 'Sin comentario'}\n`;
      response += `  Fecha: ${fecha}\n\n`;
    });

    return response;
  }

  /**
   * INTENT 5: Info Proveedor
   */
  getProveedorInfo(userText) {
    const dtes = this.contextData.dtes;
    
    // Extraer RUT o nombre del proveedor
    const rutMatch = userText.match(/\d{1,2}\.\d{3}\.\d{3}-[0-9K]/);
    const nombreMatch = userText.match(/(?:proveedor|empresa|de)\s+([A-Za-záéíóúñ\s]+)/i);

    let proveedor = null;

    if (rutMatch) {
      const rut = rutMatch[0];
      proveedor = dtes.find(d => d.RUT_Emisor === rut);
    } else if (nombreMatch) {
      const nombre = nombreMatch[1].trim();
      proveedor = dtes.find(d => 
        d.Razon_Social_Emisor.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    if (!proveedor) {
      return '🔍 No encontré el proveedor. Intenta con:\n"Información de Proveedor A"\no "RUT 12.345.678-9"';
    }

    const analisis = this.analizarDTE(proveedor, dtes);
    const dteCount = dtes.filter(d => d.RUT_Emisor === proveedor.RUT_Emisor).length;

    return (
      `📋 PROVEEDOR: ${proveedor.Razon_Social_Emisor}\n\n` +
      `RUT: ${proveedor.RUT_Emisor}\n` +
      `Región: ${proveedor.Region_Emisor}\n` +
      `Facturas: ${dteCount}\n` +
      `Monto Total: $${proveedor.Monto_Total.toLocaleString('es-CL')}\n` +
      `\n📊 RIESGO: ${analisis.nivel} (${analisis.riesgoScore}/100)`
    );
  }

  /**
   * Mensaje de ayuda
   */
  getHelpMessage() {
    return (
      `¡Hola! Soy CAI, tu asistente contable inteligente. Puedo ayudarte con:\n\n` +
      `💬 Preguntas que puedo contestar:\n` +
      `• "¿Cuántas facturas en riesgo crítico?"\n` +
      `• "¿Cuál es la deuda total?"\n` +
      `• "¿Cuántas excepciones?"\n` +
      `• "¿Cuántas facturas aprobadas?"\n` +
      `• "Información del proveedor X"\n\n` +
      `¿En qué puedo ayudarte?`
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
