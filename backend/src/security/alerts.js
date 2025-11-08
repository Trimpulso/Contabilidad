// Sistema de Alertas de Seguridad para DTEs
// Detecta automáticamente facturas sospechosas

export class SecurityAlertSystem {
  constructor() {
    this.regionesPermitidas = ['Metropolitana', 'Valparaíso', "O'Higgins"];
    this.proveedoresConocidos = new Set();
    this.historico = [];
  }

  // Cargar datos históricos para establecer baseline
  cargarHistorico(registros) {
    this.historico = registros;
    
    // Construir lista de proveedores conocidos
    registros.forEach(r => {
      if (r.RUT_Emisor) {
        this.proveedoresConocidos.add(r.RUT_Emisor);
      }
    });
  }

  // Analizar un DTE y generar alertas
  analizarDTE(dte) {
    const alertas = [];
    let riesgoScore = 0;
    let nivel = 'BAJO';

    // 1. Verificar si es emisor nuevo
    const esNuevo = this.verificarEmisorNuevo(dte);
    if (esNuevo.alerta) {
      alertas.push(esNuevo);
      riesgoScore += 30;
    }

    // 2. Verificar región del emisor
    const region = this.verificarRegion(dte);
    if (region.alerta) {
      alertas.push(region);
      riesgoScore += 20;
    }

    // 3. Verificar monto anormal
    const monto = this.verificarMontoAnormal(dte);
    if (monto.alerta) {
      alertas.push(monto);
      riesgoScore += 40;
    }

    // 4. Verificar recepción inmediata
    const recepcion = this.verificarRecepcionInmediata(dte);
    if (recepcion.alerta) {
      alertas.push(recepcion);
      riesgoScore += 10;
    }

    // 5. Verificar patrones sospechosos adicionales
    const patrones = this.verificarPatronesSospechosos(dte);
    patrones.forEach(p => {
      if (p.alerta) {
        alertas.push(p);
        riesgoScore += p.score || 15;
      }
    });

    // Determinar nivel de riesgo
    if (riesgoScore >= 51) {
      nivel = 'CRÍTICO';
    } else if (riesgoScore >= 21) {
      nivel = 'MEDIO';
    } else {
      nivel = 'BAJO';
    }

    return {
      rut: dte.RUT_Emisor,
      razonSocial: dte.Razon_Social_Emisor,
      folio: dte.Folio_DTE,
      monto: dte.Monto_Total,
      alertas,
      riesgoScore,
      nivel,
      requiereAprobacion: nivel === 'CRÍTICO' || nivel === 'MEDIO',
      bloqueado: nivel === 'CRÍTICO',
      recomendacion: this.generarRecomendacion(nivel, alertas)
    };
  }

  // Verificar si es un emisor nuevo
  verificarEmisorNuevo(dte) {
    const esNuevo = !this.proveedoresConocidos.has(dte.RUT_Emisor);
    
    return {
      alerta: esNuevo,
      tipo: 'EMISOR_NUEVO',
      nivel: 'ADVERTENCIA',
      icono: '🆕',
      mensaje: `Emisor nuevo: ${dte.Razon_Social_Emisor} (${dte.RUT_Emisor}) no tiene historial en el sistema`,
      accion: 'Verificar existencia en SII y validar actividad comercial'
    };
  }

  // Verificar región del emisor
  verificarRegion(dte) {
    const region = dte.Region_Emisor || 'No especificada';
    const esRegionDiferente = !this.regionesPermitidas.includes(region);

    return {
      alerta: esRegionDiferente,
      tipo: 'REGION_DIFERENTE',
      nivel: 'ADVERTENCIA_MEDIA',
      icono: '🌍',
      mensaje: `Emisor ubicado en región ${region} (fuera de zona operacional habitual)`,
      accion: 'Verificar razón comercial para operación en esta región'
    };
  }

  // Verificar monto anormal
  verificarMontoAnormal(dte) {
    // Calcular promedio histórico del mismo emisor
    const registrosEmisor = this.historico.filter(r => r.RUT_Emisor === dte.RUT_Emisor);
    
    if (registrosEmisor.length === 0) {
      // No hay historial, usar promedio general
      const promedioGeneral = this.calcularPromedioGeneral();
      const esAnormal = dte.Monto_Total > promedioGeneral * 3;

      return {
        alerta: esAnormal,
        tipo: 'MONTO_ANORMAL_GENERAL',
        nivel: 'ADVERTENCIA_ALTA',
        icono: '💰',
        mensaje: `Monto $${dte.Monto_Total.toLocaleString()} excede 3x el promedio general ($${Math.round(promedioGeneral).toLocaleString()})`,
        accion: 'Requiere aprobación manual y verificación de orden de compra'
      };
    }

    const promedioEmisor = registrosEmisor.reduce((sum, r) => sum + (r.Monto_Total || 0), 0) / registrosEmisor.length;
    const esAnormal = dte.Monto_Total > promedioEmisor * 3;

    return {
      alerta: esAnormal,
      tipo: 'MONTO_ANORMAL_EMISOR',
      nivel: 'ADVERTENCIA_ALTA',
      icono: '💰',
      mensaje: `Monto $${dte.Monto_Total.toLocaleString()} excede 3x el promedio histórico del emisor ($${Math.round(promedioEmisor).toLocaleString()})`,
      accion: 'Verificar con el emisor y validar orden de compra'
    };
  }

  // Verificar recepción inmediata
  verificarRecepcionInmediata(dte) {
    const fechaEmision = new Date(dte.Fecha_Emision);
    const fechaRecepcion = new Date(dte.Fecha_Recepcion);
    const mismaFecha = fechaEmision.toDateString() === fechaRecepcion.toDateString();

    return {
      alerta: mismaFecha,
      tipo: 'RECEPCION_INMEDIATA',
      nivel: 'ADVERTENCIA',
      icono: '⏱️',
      mensaje: 'DTE recibido el mismo día de emisión (patrón inusual)',
      accion: 'Verificar autenticidad del documento en portal SII'
    };
  }

  // Verificar patrones sospechosos adicionales
  verificarPatronesSospechosos(dte) {
    const patrones = [];

    // Folio sospechoso (números repetidos o secuenciales)
    if (this.esFolioSospechoso(dte.Folio_DTE)) {
      patrones.push({
        alerta: true,
        tipo: 'FOLIO_SOSPECHOSO',
        nivel: 'ADVERTENCIA',
        icono: '📄',
        mensaje: `Folio ${dte.Folio_DTE} tiene patrón sospechoso (números repetidos)`,
        accion: 'Verificar autenticidad del folio',
        score: 15
      });
    }

    // Estado pendiente con monto alto
    if (dte.Estado_RCV === 'Pendiente' && dte.Monto_Total > 5000000) {
      patrones.push({
        alerta: true,
        tipo: 'PENDIENTE_MONTO_ALTO',
        nivel: 'ADVERTENCIA_ALTA',
        icono: '⚠️',
        mensaje: `DTE pendiente con monto alto: $${dte.Monto_Total.toLocaleString()}`,
        accion: 'Priorizar revisión antes del vencimiento',
        score: 25
      });
    }

    // IVA no corresponde al monto neto
    const ivaEsperado = Math.round(dte.Monto_Neto * 0.19);
    const diferencia = Math.abs(dte.Monto_IVA - ivaEsperado);
    if (diferencia > 100) {
      patrones.push({
        alerta: true,
        tipo: 'IVA_INCORRECTO',
        nivel: 'ADVERTENCIA_ALTA',
        icono: '🧮',
        mensaje: `IVA declarado ($${dte.Monto_IVA.toLocaleString()}) no corresponde al esperado ($${ivaEsperado.toLocaleString()})`,
        accion: 'Verificar cálculo de IVA y rechazar si es incorrecto',
        score: 30
      });
    }

    // Razón social con palabras sospechosas
    const palabrasSospechosas = ['fantasma', 'dudoso', 'temporal', 'express', 'inmediato'];
    const razonSocial = (dte.Razon_Social_Emisor || '').toLowerCase();
    const tienePalabraSospechosa = palabrasSospechosas.some(p => razonSocial.includes(p));
    
    if (tienePalabraSospechosa) {
      patrones.push({
        alerta: true,
        tipo: 'RAZON_SOCIAL_SOSPECHOSA',
        nivel: 'ADVERTENCIA_MEDIA',
        icono: '🏢',
        mensaje: `Razón social contiene palabras sospechosas: ${dte.Razon_Social_Emisor}`,
        accion: 'Verificar existencia legal de la empresa',
        score: 20
      });
    }

    return patrones;
  }

  // Validar si el folio tiene patrón sospechoso
  esFolioSospechoso(folio) {
    const folioStr = String(folio);
    
    // Números repetidos (ej: 1111, 9999)
    if (/^(.)\1+$/.test(folioStr)) return true;
    
    // Secuencia ascendente (ej: 1234)
    if (folioStr === '1234' || folioStr === '12345') return true;
    
    return false;
  }

  // Calcular promedio general de montos
  calcularPromedioGeneral() {
    if (this.historico.length === 0) return 500000; // Default fallback
    
    const total = this.historico.reduce((sum, r) => sum + (r.Monto_Total || 0), 0);
    return total / this.historico.length;
  }

  // Generar recomendación según nivel de riesgo
  generarRecomendacion(nivel, alertas) {
    const acciones = alertas.map(a => a.accion).join('; ');

    switch (nivel) {
      case 'CRÍTICO':
        return `🚨 BLOQUEAR REGISTRO AUTOMÁTICO. ${acciones}. Requiere validación por supervisor antes de continuar.`;
      
      case 'MEDIO':
        return `⚠️ REVISAR MANUALMENTE. ${acciones}. Aprobar solo después de verificación.`;
      
      case 'BAJO':
        return `✅ Riesgo bajo. ${acciones || 'Puede procesar normalmente'}.`;
      
      default:
        return 'Procesar con procedimiento estándar';
    }
  }

  // Generar reporte de alertas
  generarReporte(analisis) {
    return {
      timestamp: new Date().toISOString(),
      dte: {
        rut: analisis.rut,
        razonSocial: analisis.razonSocial,
        folio: analisis.folio,
        monto: analisis.monto
      },
      evaluacion: {
        riesgoScore: analisis.riesgoScore,
        nivel: analisis.nivel,
        cantidadAlertas: analisis.alertas.length,
        requiereAprobacion: analisis.requiereAprobacion,
        bloqueado: analisis.bloqueado
      },
      alertas: analisis.alertas,
      recomendacion: analisis.recomendacion,
      acciones: analisis.alertas.map(a => ({
        tipo: a.tipo,
        mensaje: a.mensaje,
        accion: a.accion
      }))
    };
  }

  // Procesar lote de DTEs
  analizarLote(dtes) {
    return dtes.map(dte => {
      const analisis = this.analizarDTE(dte);
      return {
        ...dte,
        analisisSeguridad: analisis
      };
    });
  }

  // Obtener estadísticas de alertas
  obtenerEstadisticas(analisis) {
    const porNivel = {
      CRÍTICO: analisis.filter(a => a.nivel === 'CRÍTICO').length,
      MEDIO: analisis.filter(a => a.nivel === 'MEDIO').length,
      BAJO: analisis.filter(a => a.nivel === 'BAJO').length
    };

    const porTipo = {};
    analisis.forEach(a => {
      a.alertas.forEach(alerta => {
        porTipo[alerta.tipo] = (porTipo[alerta.tipo] || 0) + 1;
      });
    });

    return {
      total: analisis.length,
      bloqueados: analisis.filter(a => a.bloqueado).length,
      requierenAprobacion: analisis.filter(a => a.requiereAprobacion).length,
      porNivel,
      porTipo,
      scorePromedio: analisis.reduce((sum, a) => sum + a.riesgoScore, 0) / analisis.length
    };
  }
}

export default SecurityAlertSystem;
