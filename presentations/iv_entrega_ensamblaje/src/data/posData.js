export const POS_ROLES = [
  {
    id: 'vendedor',
    name: 'Vendedor',
    username: 'vendedor',
    fullName: 'Juan Pérez (Vendedor)',
    permissionCount: 37,
    canSell: true,
    canOpenShift: true,
    canApproveCashDiff: false,
    canReceivePurchase: false,
    canCountInventory: false,
    canApproveInventoryCount: false,
    canApprovePriceChange: false,
    canConfigTaxDiscount: false,
    canViewAudit: false,
    canDeactivateUser: false,
    summary: 'POS mostrador, borradores BV-XX, turnos de caja, cotizaciones y solicitudes posventa.',
    blockedActions: [
      'Aprobar arqueo propio/ajeno (HTTP 403)',
      'Aprobar precios de lista (HTTP 403)',
      'Ver bitácora de auditoría (HTTP 403)',
      'Desactivar usuarios (HTTP 403)',
    ],
  },
  {
    id: 'bodega',
    name: 'Bodega',
    username: 'bodega',
    fullName: 'Carlos López (Bodeguero)',
    permissionCount: 14,
    canSell: false,
    canOpenShift: false,
    canApproveCashDiff: false,
    canReceivePurchase: true,
    canCountInventory: true,
    canApproveInventoryCount: false,
    canApprovePriceChange: false,
    canConfigTaxDiscount: false,
    canViewAudit: false,
    canDeactivateUser: false,
    summary: 'Consulta catálogo/Kardex, recepción de compras y conteos físicos de inventario.',
    blockedActions: [
      'Facturar ventas POS (HTTP 403)',
      'Aperturar caja (HTTP 403)',
      'Autoaprobar conteo físico (HTTP 403)',
    ],
  },
  {
    id: 'administracion',
    name: 'Administración',
    username: 'admin',
    fullName: 'Administrador Centenario',
    permissionCount: 74,
    canSell: true,
    canOpenShift: true,
    canApproveCashDiff: true,
    canReceivePurchase: true,
    canCountInventory: true,
    canApproveInventoryCount: true,
    canApprovePriceChange: false,
    canConfigTaxDiscount: true,
    canViewAudit: true,
    canDeactivateUser: true,
    summary: 'Gestión de catálogo, compras, excepciones, arqueos (SoD), políticas IVA/descuento y auditoría.',
    blockedActions: [
      'Aprobar cambio de precio de lista (HTTP 403 — exclusivo Gerencia)',
      'Autoaprobar propio arqueo o excepción de descuento (SoD)',
    ],
  },
  {
    id: 'gerencia',
    name: 'Gerencia',
    username: 'gerente',
    fullName: 'Roberto Centeno (Gerente)',
    permissionCount: 47,
    canSell: false,
    canOpenShift: false,
    canApproveCashDiff: true,
    canReceivePurchase: false,
    canCountInventory: false,
    canApproveInventoryCount: false,
    canApprovePriceChange: true,
    canConfigTaxDiscount: true,
    canViewAudit: true,
    canDeactivateUser: true,
    summary: 'Supervisión integral, bitácora AuditEvent, políticas fiscales y aprobación exclusiva de precios.',
    blockedActions: ['Emitir facturas POS (solo lectura operativa)'],
  },
];

export const RBAC_SOD_MATRIX = [
  { module: 'Ventas y POS', vendedor: 'PERMITIDO', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO', gerencia: 'Solo lectura' },
  { module: 'Apertura de Caja', vendedor: 'PERMITIDO', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO', gerencia: 'Solo lectura' },
  { module: 'Aprobar Arqueo', vendedor: 'DENEGADO (403)', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO (SoD)', gerencia: 'PERMITIDO' },
  { module: 'Recepción Compras', vendedor: 'DENEGADO (403)', bodega: 'PERMITIDO', administracion: 'PERMITIDO', gerencia: 'Solo lectura' },
  { module: 'Conteos Físicos', vendedor: 'DENEGADO (403)', bodega: 'PERMITIDO', administracion: 'PERMITIDO', gerencia: 'Solo lectura' },
  { module: 'Aprobar Ajuste', vendedor: 'DENEGADO (403)', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO', gerencia: 'Solo lectura' },
  { module: 'Aprobar Precios', vendedor: 'DENEGADO (403)', bodega: 'DENEGADO (403)', administracion: 'DENEGADO (403)', gerencia: 'PERMITIDO' },
  { module: 'Configurar IVA', vendedor: 'DENEGADO (403)', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO', gerencia: 'PERMITIDO' },
  { module: 'Ver Auditoría', vendedor: 'DENEGADO (403)', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO', gerencia: 'PERMITIDO' },
  { module: 'Desactivar User', vendedor: 'DENEGADO (403)', bodega: 'DENEGADO (403)', administracion: 'PERMITIDO', gerencia: 'PERMITIDO' },
];

export const CORDOBA_DENOMINATIONS = {
  bills: [
    { value: 1000, label: 'C$ 1,000', tone: 'emerald' },
    { value: 500, label: 'C$ 500', tone: 'red' },
    { value: 200, label: 'C$ 200', tone: 'amber' },
    { value: 100, label: 'C$ 100', tone: 'blue' },
    { value: 50, label: 'C$ 50', tone: 'purple' },
    { value: 20, label: 'C$ 20', tone: 'orange' },
    { value: 10, label: 'C$ 10', tone: 'green' },
  ],
  coins: [
    { value: 5, label: 'C$ 5.00', tone: 'slate' },
    { value: 1, label: 'C$ 1.00', tone: 'slate' },
    { value: 0.5, label: 'C$ 0.50', tone: 'gold' },
    { value: 0.25, label: 'C$ 0.25', tone: 'gold' },
    { value: 0.1, label: 'C$ 0.10', tone: 'gold' },
  ],
  cashDiffThresholdStandard: 10.0,
  cashDiffThresholdStrict: 0.0,
};

export const POS_ACADEMIC_PRODUCTS = [
  {
    sku: 'ACA-ACE-10W40',
    name: 'Aceite 10W-40 1 L',
    category: 'Lubricantes',
    brand: 'Escenario Académico',
    price: 450.0,
    cost: 300.0,
    stock: 15,
    minStock: 3,
    warrantyDays: 30,
    quality: 'AA',
    compatibility: 'Motores 4T estándar',
    source: 'academic',
  },
  {
    sku: 'ACA-PAS-FRENO',
    name: 'Pastillas de freno delanteras',
    category: 'Frenos',
    brand: 'Escenario Académico',
    price: 320.0,
    cost: 205.0,
    stock: 10,
    minStock: 3,
    warrantyDays: 30,
    quality: 'AA',
    compatibility: 'Freno de disco delantero 125–200cc',
    source: 'academic',
  },
  {
    sku: 'ACA-CAD-428',
    name: 'Cadena de transmisión 428',
    category: 'Transmisión',
    brand: 'Escenario Académico',
    price: 580.0,
    cost: 390.0,
    stock: 8,
    minStock: 3,
    warrantyDays: 30,
    quality: 'AAA',
    compatibility: 'Paso 428 universal 125–150cc',
    source: 'academic',
  },
];

export const POS_MOTO_PRODUCTS = [
  {
    sku: 'ACE-MOT-10W40',
    name: 'Aceite Semi-Sintético Motul 5100 10W-40 1L',
    category: 'Lubricantes',
    brand: 'Motul',
    price: 420.0,
    cost: 290.0,
    stock: 30,
    minStock: 10,
    warrantyDays: 30,
    quality: 'AAA',
    compatibility: 'Motores 4T JASO MA2',
    source: 'demo',
  },
  {
    sku: 'ACE-YAM-20W50',
    name: 'Aceite Mineral 4T Yamalube 20W-50 1L',
    category: 'Lubricantes',
    brand: 'Yamaha Yamalube',
    price: 350.0,
    cost: 230.0,
    stock: 40,
    minStock: 15,
    warrantyDays: 30,
    quality: 'AAA',
    compatibility: 'Yamaha YBR / FZ / Crux',
    source: 'demo',
  },
  {
    sku: 'PAS-HON-CB125',
    name: 'Pastillas de Freno Delanteras Cerámicas',
    category: 'Frenos',
    brand: 'Nissin',
    price: 280.0,
    cost: 160.0,
    stock: 25,
    minStock: 5,
    warrantyDays: 60,
    quality: 'AAA',
    compatibility: 'Honda CB 125F Twister (2015–2025)',
    source: 'demo',
  },
  {
    sku: 'ZAP-BAJ-BOX150',
    name: 'Zapatas de Freno Traseras Originales',
    category: 'Frenos',
    brand: 'Bajaj Genuine',
    price: 220.0,
    cost: 130.0,
    stock: 20,
    minStock: 6,
    warrantyDays: 60,
    quality: 'AA',
    compatibility: 'Bajaj Boxer BM 150',
    source: 'demo',
  },
  {
    sku: 'CAD-DID-428H',
    name: 'Cadena Reforzada 428H-130L Dorada',
    category: 'Transmisión',
    brand: 'D.I.D Japan',
    price: 680.0,
    cost: 440.0,
    stock: 15,
    minStock: 4,
    warrantyDays: 90,
    quality: 'AAA',
    compatibility: 'Bajaj Pulsar NS 200 (2014–2026)',
    source: 'demo',
  },
  {
    sku: 'KIT-TRA-YBR125',
    name: 'Kit de Arrastre Corona, Piñón y Cadena',
    category: 'Transmisión',
    brand: 'Riffel Brasil',
    price: 950.0,
    cost: 650.0,
    stock: 12,
    minStock: 3,
    warrantyDays: 90,
    quality: 'AAA',
    compatibility: 'Yamaha YBR 125 (2012–2024)',
    source: 'demo',
  },
  {
    sku: 'BUI-NGK-CPR8E',
    name: 'Bujía Láser de Iridio NGK CPR8EAIX-9',
    category: 'Eléctrico',
    brand: 'NGK Spark',
    price: 290.0,
    cost: 180.0,
    stock: 35,
    minStock: 8,
    warrantyDays: 90,
    quality: 'AAA',
    compatibility: 'Pulsar / FZ16 / CB190R',
    source: 'demo',
  },
  {
    sku: 'BAT-YUA-12V7A',
    name: 'Batería de Gel Sellada 12V 7Ah Libre Mant.',
    category: 'Eléctrico',
    brand: 'Yuasa Battery',
    price: 1250.0,
    cost: 880.0,
    stock: 10,
    minStock: 3,
    warrantyDays: 180,
    quality: 'AAA',
    compatibility: '125cc–250cc arranque eléctrico',
    source: 'demo',
  },
  {
    sku: 'LLAN-DUN-909018',
    name: 'Llanta Delantera TT/TL 90/90-18 D404',
    category: 'Llantas',
    brand: 'Dunlop Tires',
    price: 1450.0,
    cost: 1020.0,
    stock: 8,
    minStock: 4,
    warrantyDays: 180,
    quality: 'AAA',
    compatibility: 'Rin 18 estándar trabajo/calle',
    source: 'demo',
  },
  {
    sku: 'LLAN-DUN-1109017',
    name: 'Llanta Trasera TT/TL 110/90-17 D404',
    category: 'Llantas',
    brand: 'Dunlop Tires',
    price: 1850.0,
    cost: 1320.0,
    stock: 8,
    minStock: 4,
    warrantyDays: 180,
    quality: 'AAA',
    compatibility: 'Rin 17 Pulsar / FZ / Genesis',
    source: 'demo',
  },
  {
    sku: 'RET-SUS-FZ16',
    name: 'Par de Retenes de Suspensión Delantera 41mm',
    category: 'Suspensión',
    brand: 'Koyo Japan',
    price: 340.0,
    cost: 200.0,
    stock: 18,
    minStock: 4,
    warrantyDays: 45,
    quality: 'AA',
    compatibility: 'Yamaha FZ-16 / Pulsar 200',
    source: 'demo',
  },
  {
    sku: 'CAR-MOL-PUL200',
    name: 'Carburador Completo Tipo Original Ucal',
    category: 'Motor',
    brand: 'Ucal Carburetors',
    price: 1600.0,
    cost: 1100.0,
    stock: 6,
    minStock: 2,
    warrantyDays: 90,
    quality: 'AA',
    compatibility: 'Bajaj Pulsar 200 / TVS Apache',
    source: 'demo',
  },
];

export const POS_CATALOG = [...POS_ACADEMIC_PRODUCTS, ...POS_MOTO_PRODUCTS];

export const POS_POLICIES = {
  taxPolicy: {
    rate: 15.0,
    label: 'IVA (15%)',
    reason: 'Impuesto al Valor Agregado (IVA 15%) de Ley',
    academicRate: 0.0,
  },
  discountPolicies: [
    {
      id: 'taller-aliado',
      name: 'Descuento Taller Aliado (10%)',
      rate: 10.0,
      maxSubtotal: 5000.0,
      active: true,
    },
  ],
  limits: {
    maxLinesPerSale: 20,
    maxLinesPerDraft: 20,
    maxPaymentMethods: 4,
    maxCustomerNameLength: 180,
    draftPrefix: 'BV-',
    invoicePrefix: 'F-',
    invoiceDigits: 8,
    exceptionPrefix: 'EXD-',
  },
};

export const PAYMENT_METHODS = [
  { id: 'CASH', label: 'Efectivo', requiresRef: false },
  { id: 'CARD', label: 'Tarjeta', requiresRef: true },
  { id: 'TRANSFER', label: 'Transferencia', requiresRef: true },
];

export const POS_CUSTOMERS = [
  'Consumidor Final',
  'Taller Mecánico El Águila',
  'Cooperativa de Mototaxis Unidos',
  'Carlos Alberto Mendoza',
  'Taller Hermanos Ruiz',
];

export function roundMoney(val) {
  return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
}

/**
 * Replica exacta del cálculo en MREC/commerce/pricing_services.py (ROUND_HALF_UP por unidad).
 */
export function calculatePosLineTotals(items = [], discountRate = 0, taxRate = 15.0) {
  const discPct = Math.max(0, Number(discountRate) || 0) / 100;
  const taxPct = Math.max(0, Number(taxRate) || 0) / 100;

  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;
  let grandTotal = 0;

  const lines = items.map((item) => {
    const qty = Math.max(1, Math.trunc(Number(item.quantity) || 1));
    const unitGross = roundMoney(item.price);
    const unitDiscount = roundMoney(unitGross * discPct);
    const unitAfterDiscount = roundMoney(unitGross - unitDiscount);
    const unitTax = roundMoney(unitAfterDiscount * taxPct);
    const unitFinal = roundMoney(unitAfterDiscount + unitTax);

    const lineGross = roundMoney(unitGross * qty);
    const lineDiscount = roundMoney(unitDiscount * qty);
    const lineTax = roundMoney(unitTax * qty);
    const lineTotal = roundMoney(unitFinal * qty);

    subtotal = roundMoney(subtotal + lineGross);
    discountTotal = roundMoney(discountTotal + lineDiscount);
    taxTotal = roundMoney(taxTotal + lineTax);
    grandTotal = roundMoney(grandTotal + lineTotal);

    return {
      ...item,
      quantity: qty,
      unitPrice: unitGross,
      unitDiscount,
      unitTax,
      unitFinal,
      lineGross,
      lineDiscount,
      lineTax,
      lineTotal,
    };
  });

  return {
    lines,
    subtotal,
    discountTotal,
    taxableBase: roundMoney(subtotal - discountTotal),
    taxTotal,
    grandTotal,
  };
}
