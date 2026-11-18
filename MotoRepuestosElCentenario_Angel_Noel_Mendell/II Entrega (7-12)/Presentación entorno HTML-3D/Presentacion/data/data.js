// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.Data.
window.Data = (function () {
'use strict';
// ============================================================
// DATOS DE LAS ESCENAS - Alineados con los 6 informes v1.1 (11 oct 2026)
// Regla: cada cifra debe poder encontrarse en el PDF indicado.
// ============================================================

// ---------- Etapa / estado de cada informe (campo "Etapa" de la portada) ----------
const stageInfo = {
    solid: {
        doc: 'Informe 01 · SOLID',
        stage: 'Desarrollo finalizado y verificación interna de diseño',
        note: 'Criterios de diseño, no certificación externa',
        color: '#f59e0b'
    },
    ux: {
        doc: 'Informe 02 · UX y usabilidad',
        stage: 'Desarrollo y pruebas internas de usabilidad',
        note: 'Inspección de diseño; sin estudio con personal de la empresa',
        color: '#e74c3c'
    },
    security: {
        doc: 'Informe 03 · Programación segura',
        stage: 'Desarrollo y pruebas internas de seguridad',
        note: 'Controles validados antes del despliegue; sin certificación',
        color: '#f1c40f'
    },
    testing: {
        doc: 'Informe 04 · Pruebas de software',
        stage: 'Pruebas internas de integración, regresión y rendimiento',
        note: 'Cifras en equipos de desarrollo; piloto con usuarios pendiente',
        color: '#9b59b6'
    },
    db: {
        doc: 'Informe 05 · Pruebas de base de datos',
        stage: 'Pruebas internas de base de datos, respaldo y recuperación',
        note: 'Procedimiento validado; operación periódica en la empresa pendiente',
        color: '#3498db'
    },
    tech: {
        doc: 'Informe 06 · Escenario técnico',
        stage: 'Desarrollo final y preparación de despliegue en empresa real',
        note: 'Infraestructura definida; instalación física pendiente',
        color: '#00ffff'
    }
};
const REPORT_VERSION = 'v1.1 · 11 oct 2026';

// ---------- Informe 01 · SOLID ----------
// status: 'aplicado' | 'parcial' | 'no forzado'
const solidDataInfoList = [
    {
        letter: 'S',
        title: 'S · Responsabilidad Única',
        status: 'aplicado',
        color: '#f59e0b',
        evidence: 'pricing.py · sale_create → checkout · cancellation_services.py',
        desc: 'El cálculo de dinero vive en pricing.py (Decimal, sin navegador). La vista solo adapta el formulario y delega; la anulación tiene su propio servicio. Cada pieza se prueba por separado. services.py aún agrupa varios casos de uso: decisión de escala de esta versión.'
    },
    {
        letter: 'O',
        title: 'O · Abierto / Cerrado',
        status: 'aplicado',
        color: '#3498db',
        evidence: 'Políticas de descuento e impuesto versionables',
        desc: 'Una tasa nueva se agrega como política nueva sin reescribir las facturas históricas. Límite: los medios de pago son un conjunto deliberadamente cerrado.'
    },
    {
        letter: 'L',
        title: 'L · Sustitución de Liskov',
        status: 'no forzado',
        color: '#2ecc71',
        evidence: 'Venta directa · borrador · cotización → un solo checkout',
        desc: 'No inventamos herencia solo para cumplir el principio. Lo que sí se verifica: las tres vías de confirmar una venta terminan en el mismo contrato checkout, donde se validan stock, pago, descuento e impuesto.'
    },
    {
        letter: 'I',
        title: 'I · Segregación de Interfaces',
        status: 'aplicado',
        color: '#f1c40f',
        evidence: 'Permisos por rol · prueba de acceso directo por URL → 403',
        desc: 'Vender no concede configurar tasas, decidir excepciones ni ver costos. Cada rol depende solo de los permisos que usa.'
    },
    {
        letter: 'D',
        title: 'D · Inversión de Dependencias',
        status: 'parcial',
        color: '#9b59b6',
        evidence: 'pricing.py no importa Django · services.py aún agrupa casos de uso',
        desc: 'Las dependencias apuntan hacia adentro: vistas → servicios → reglas puras. Aplicación parcial y deliberada: los servicios usan el ORM de Django sin repositorio abstracto. Regresión de cierre: 120 pruebas OK.'
    }
];

// ---------- Informe 02 · UX ----------
const uxDataInfoList = [
    {
        role: 'Vendedor',
        task: 'Cotizar y cobrar en mostrador',
        desc: 'Busca la pieza compatible, cotiza y cobra con uno o más pagos. El POS enfoca la primera línea, el lector funciona como teclado y la pantalla muestra solo un total estimado: el servidor recalcula.',
        color: '#3498db',
        targetPos: { x: -3, z: 4 } // Mostrador
    },
    {
        role: 'Bodega',
        task: 'Recibir y conciliar existencias',
        desc: 'Recibe compras y verifica saldo y Kardex; crea conteos y solicita aprobación de diferencias antes de ajustar.',
        color: '#2ecc71',
        targetPos: { x: -6, z: -6 } // Bodega
    },
    {
        role: 'Administración',
        task: 'Decidir garantías, devoluciones y anulaciones',
        desc: 'Ve identidad, motivo y consecuencias antes de confirmar. Nada se borra: la anulación es compensatoria y muestra el reintegro pendiente.',
        color: '#e74c3c',
        targetPos: { x: 6, z: 4 } // Admin
    },
    {
        role: 'Gerencia',
        task: 'Revisar reportes, deudas y auditoría',
        desc: 'Distingue ingreso, impuesto de simulación, reintegro y deuda pendiente. Puede aprobar excepciones de otro usuario, nunca las propias.',
        color: '#9b59b6',
        targetPos: { x: 6, z: -6 } // Gerencia
    }
];

// ---------- Informe 03 · Programación segura ----------
// Las 9 amenazas del informe agrupadas en 3 capas (la escena usa 3 colores).
const securityDataInfoList = [
    {
        level: 'Capa 1 · Acceso e identidad (amenazas 1-3)',
        title: 'Quién entra y cómo',
        desc: 'Permisos validados en el servidor, no solo en pantalla (acceso directo por URL → 403). Bloqueo temporal tras 5 fallos, cuentas individuales y sesión de 30 min de inactividad. CSRF de Django, cambios solo por POST. Residual: falta revisión formal de toda la matriz RBAC; la demo corre en HTTP local y el HTTPS real depende del proxy TLS del servidor de destino.',
        evidence: 'Prueba: acceso directo sin permiso → 403 · auditoría LAN con MREC_DEBUG=0',
        color: '#e74c3c'
    },
    {
        level: 'Capa 2 · Integridad del negocio (amenazas 4-6)',
        title: 'Precio, aprobaciones e inventario',
        desc: 'El servidor recalcula precio y total; el navegador solo estima. Quien solicita una operación sensible no puede aprobarla. Dos ventas por la última unidad: solo una confirma; carga de 500 ventas con 4 operadores sin stock negativo.',
        evidence: 'Pruebas P-SW: pago manipulado, autoaprobación, última unidad',
        color: '#f39c12'
    },
    {
        level: 'Capa 3 · Historial y datos (amenazas 7-9)',
        title: 'Nada se pierde, nada se expone',
        desc: 'Nada se borra: anulación compensatoria y auditoría con actor, acción y fecha. Cliente opcional y mínimo; secretos por variables de entorno. Copia pg_dump con SHA-256 (6 copias verificadas) y copia externa en unidad BitLocker comprobada. Residual: un administrador total de la base podría alterar la auditoría (sin sellado externo ni WORM) y falta política de retención.',
        evidence: 'Revisión interna según orientación ISO/IEC 27034 · sin certificación',
        color: '#2ecc71'
    }
];

// ---------- Informe 04 · Pruebas de software ----------
const softwareTestingDataInfoList = [
    {
        level: 'Fase 1 · Estrategia',
        title: 'Cinco niveles según el riesgo',
        desc: 'Reglas puras (redondeo), servicios (compra, venta, garantía, anulación), base y transacciones (rollback, última unidad), integración HTTP (CSRF, permisos, reportes) y regresión completa. Se ejecutan sobre PostgreSQL 18.4 con base temporal que Django crea y elimina.',
        evidence: 'Marco: ISO/IEC/IEEE 29119 · sin certificación',
        color: '#9b59b6'
    },
    {
        level: 'Fase 2 · Resultado',
        title: '120 pruebas aprobadas, 0 fallos',
        desc: 'Regresión de cierre en 289,28 s, con cero fallos y cero errores; manage.py check sin problemas. 11 casos críticos (P-SW-01 a P-SW-11) aprobados. Los defectos hallados, como el permiso para descuentos excepcionales, quedaron con prueba de regresión.',
        evidence: '120 OK · 0 fallos · 289.28 s · 11 casos críticos',
        color: '#3498db'
    },
    {
        level: 'Fase 3 · Rendimiento y límites',
        title: 'Cifras locales, no extrapolables',
        desc: '50 búsquedas sobre 20,000 productos: P95 de 0.029 s. 500 ventas de 20 líneas con 4 operadores: P95 de 1.142 s. 10 sesiones de informes: máximo 0.648 s. Límites: no se midió porcentaje de cobertura y falta la medición con terminales físicos.',
        evidence: 'Rendimiento en equipo local · cobertura no medida',
        color: '#1abc9c'
    }
];

// ---------- Informe 05 · Pruebas de base de datos ----------
const dbTestingDataInfoList = [
    {
        phase: 'Paso 1 · Concurrencia',
        title: 'Una unidad, dos cajeros, una venta',
        desc: 'Dos ventas compiten por la última unidad: solo una confirma, el saldo queda en 0 y no hay stock negativo. Se registra exactamente una salida en el Kardex.',
        evidence: 'Prueba PostgreSQL: 1 venta · saldo 0 · 1 salida de Kardex',
        color: '#3498db'
    },
    {
        phase: 'Paso 2 · Transacción atómica',
        title: 'Todo se confirma o nada queda',
        desc: 'Factura, líneas, pagos, Kardex y auditoría son una sola transacción. Si el pago no coincide con el total que recalcula el servidor, todo se revierte junto. Lo mismo ocurre en una anulación sin turno abierto o sin saldo para el reintegro.',
        evidence: 'Pruebas de rollback en PostgreSQL',
        color: '#e74c3c'
    },
    {
        phase: 'Paso 3 · Importación y recuperación',
        title: 'Cargar, copiar y restaurar',
        desc: 'Importación atómica de 10,000 productos: 56.36 s en la regresión final y 52.08 s en una medición individual (no es meta P95). Copias con pg_dump + SHA-256 y una copia externa en unidad BitLocker verificada. Restauración en base temporal separada: 46 migraciones, 6 cuentas y 1 venta, entre 3.29 s y 7.27 s, sin tocar la base principal.',
        evidence: 'Restauración 3.29–7.27 s · sin RPO/RTO empresarial atribuido',
        color: '#2ecc71'
    }
];

// ---------- Informe 06 · Escenario técnico ----------
// Capas sobre el plano del local (1-4) y fichas técnicas de los equipos (5-7).
const techDataInfoList = [
    {
        view: 'Capa 1 · Puestos',
        title: '1 servidor + 8 clientes',
        desc: 'Cuatro puestos POS en el mostrador, más Bodega, Administración, Gerencia y Propiedad. SRV1 aloja la aplicación y PostgreSQL en el rack del cuarto técnico, dimensionado para 10 sesiones simultáneas (sin certificación de capacidad). Cada empleado entra con su propia cuenta. Hoy el sistema corre en 127.0.0.1; la instalación en la empresa está pendiente y PRN1 es el único equipo declarado disponible.',
        evidence: 'POS01-04 · BOD01 · ADM01 · GER01 · PROP01 · SRV1 · PRN1',
        color: '#5B9BD5'
    },
    {
        view: 'Capa 2 · Red',
        title: '6 VLAN segmentadas',
        desc: 'R1 es la puerta de enlace y niega el tráfico entre VLAN salvo los flujos descritos: 10 servidores, 20 POS, 30 oficinas, 40 bodega, 50 impresión, 99 gestión. PostgreSQL no se publica a los clientes. Si cae Internet, las ventas locales continúan. Direccionamiento propuesto: no está aplicado en dispositivos.',
        evidence: 'Informe 06 · propuesta documental de segmentación',
        color: '#00ffff'
    },
    {
        view: 'Capa 3 · Energía',
        title: 'UPS de 900 W vs impresora de 1330 W',
        desc: 'UPS1 (mín. 1500 VA / 900 W) protege servidor, router, switch y NAS. La impresora Canon puede llegar a unos 1330 W, más de lo que soporta el UPS, así que va en una toma protegida independiente, fuera de UPS1. Se estiman 16 tomas con tierra (estimación funcional, no diseño eléctrico certificado).',
        evidence: 'Informe 06 · dimensionamiento eléctrico',
        color: '#f1c40f'
    },
    {
        view: 'Capa 4 · Copias',
        title: 'Espejo no es copia',
        desc: 'NAS1 con dos discos en espejo mejora la continuidad, pero no sustituye la copia en un medio separado: una unidad externa cifrable se rota fuera del rack. Ya se verificó una copia externa en unidad BitLocker (SHA-256) y la restauración temporal tomó entre 3.29 s y 7.27 s. Los objetivos RPO/RTO se medirán durante la instalación en SRV1, UPS1 y la LAN real.',
        evidence: 'Restauración 3.29–7.27 s · RPO 24 h / RTO < 15 min (objetivos)',
        color: '#2ecc71'
    },
    {
        view: 'Equipos 1 · Servidor y rack',
        title: 'Qué hay dentro del RACK1',
        desc: 'SRV1: 8 núcleos, 32 GB de RAM y 2 SSD de 1 TB en espejo. R1: router/cortafuegos con VLAN. SW1: 24 puertos Gigabit con VLAN 802.1Q y PoE para AP1. NAS1: 2 discos de 2 TB en espejo. UPS1: mín. 1500 VA / 900 W. Todo en un gabinete ventilado con patch panel de 24 puertos. Son mínimos de selección, no equipos inspeccionados.',
        evidence: 'Informe 06 · lista de infraestructura',
        color: '#5B9BD5'
    },
    {
        view: 'Equipos 2 · Puestos de trabajo',
        title: 'Ocho equipos cliente',
        desc: 'Seis estaciones de escritorio (4 POS, BOD01 y ADM01) y dos portátiles (GER01 y PROP01), todos con 4 núcleos, 8 GB de RAM y SSD de 256 GB. Cada POS lleva lector USB-HID y cajón de dinero; hay 6 monitores, 6 teclados y 6 ratones. Especificación mínima propuesta de compra/reutilización.',
        evidence: 'Informe 06 · inventario físico por puesto',
        color: '#b366ff'
    },
    {
        view: 'Equipos 3 · Impresión',
        title: 'Canon imageCLASS MF445dw',
        desc: 'Láser monocromática multifunción con dúplex automático, hasta 40 páginas por minuto en carta, Ethernet Gigabit y Wi-Fi. Se comparte por red (VLAN 50) para comprobantes, reportes y documentos tamaño carta. Su estado, tóner y garantía se revisarán antes de usarla; no se afirma compatibilidad con impresora térmica de 80 mm.',
        evidence: 'Informe 06 · ficha del fabricante (Canon Latin America)',
        color: '#2ecc71'
    }
];

return { stageInfo, REPORT_VERSION, solidDataInfoList, uxDataInfoList, securityDataInfoList, softwareTestingDataInfoList, dbTestingDataInfoList, techDataInfoList };
})();
