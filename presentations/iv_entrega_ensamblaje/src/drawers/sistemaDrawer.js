import {
  CORDOBA_DENOMINATIONS,
  PAYMENT_METHODS,
  POS_CATALOG,
  POS_CUSTOMERS,
  POS_POLICIES,
  POS_ROLES,
  RBAC_SOD_MATRIX,
  calculatePosLineTotals,
  roundMoney,
} from '../data/posData.js';
import { escapeHtml } from '../ui/charts.js';

const STEP_HINTS = {
  'pos-sale': 'Recorrido GUI <= 4 pantallas (Cap. 09) · Escenario Académico MREC en tiempo real.',
  default: 'Simulador POS Offline fiel a MREC Django · RBAC SoD, FIFO Stock, Política 10% y IVA 15%.',
};

function fmtC(val) {
  const num = Number(val);
  const safe = Number.isFinite(num) ? num : 0;
  return `C$ ${safe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function initSistemaDrawer(panelEl, initialPayload = {}) {
  let activeRoleId = 'vendedor';
  let shiftOpen = false;
  let shiftSeq = 1;
  const openingCash = 1500.0;
  let shiftClosedNote = '';
  let searchQuery = '';
  const stockBySku = new Map(POS_CATALOG.map((item) => [item.sku, item.stock]));
  let cart = [];
  let selectedCustomer = POS_CUSTOMERS[0];
  let discountRate = 0;
  let paymentMethod = 'Efectivo';
  let paymentRef = '';
  let mixedCash = 0;
  let mixedCard = 0;
  let stockWarning = '';
  let checkoutMessage = '';
  let checkoutTone = 'warn';
  let invoiceSeq = 0;
  let lastReceipt = null;
  let showRbacMatrix = false;
  let stepId = String(initialPayload.stepId || '');

  panelEl.innerHTML = `
    <div class="sistema-pos">
      <div data-testid="sistema-pos-view">
        <div class="pos-topbar">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <span class="pos-brand-mark" aria-hidden="true">M</span>
            <div style="min-width:0;">
              <strong style="display:block;font-size:13.5px;color:var(--pos-ink);">Moto Repuestos El Centenario, S.A. · POS Offline</strong>
              <span id="sistema-step-hint" style="display:block;font-size:11.5px;color:var(--pos-muted);"></span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <label for="sistema-role-select-el" style="font-size:12px;font-weight:700;color:var(--pos-ink);">Rol RBAC:</label>
            <select id="sistema-role-select-el" data-testid="sistema-role-select" aria-label="Rol activo MREC">
              ${POS_ROLES.map(
                (r) =>
                  `<option value="${escapeHtml(r.id)}">${escapeHtml(r.name)} (${r.permissionCount} permisos)</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="pos-layout">
          <div class="pos-main-col">
            <div class="pos-card" id="sistema-rbac-slot"></div>

            <div class="pos-card">
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
                <strong style="font-size:13.5px;color:var(--pos-ink);">Control de Turno de Caja (Córdobas C$)</strong>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" class="pos-btn-primary" data-testid="sistema-open-shift">Aperturar turno (C$ 1,500.00)</button>
                  <button type="button" data-testid="sistema-close-shift" style="background:#ffffff;border:1px solid var(--pos-line);color:var(--pos-ink);border-radius:8px;padding:7px 12px;font-weight:600;cursor:pointer;">Cerrar turno</button>
                </div>
              </div>
              <div id="sistema-shift-slot"></div>
            </div>

            <div class="pos-card">
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
                <strong style="font-size:13.5px;color:var(--pos-ink);">Catálogo de Repuestos y Lubricantes</strong>
                <input
                  type="search"
                  id="id_items-0-product"
                  data-testid="sistema-catalog-search"
                  placeholder="Buscar SKU, repuesto o compatibilidad..."
                  aria-label="Buscar producto en catálogo"
                  style="min-width:220px;flex:1;max-width:300px;"
                />
              </div>
              <div id="sistema-catalog-warn-slot"></div>
              <div id="sistema-catalog-slot"></div>
            </div>

            <div class="pos-card">
              <strong style="display:block;font-size:13.5px;color:var(--pos-ink);margin-bottom:8px;">Detalle de Venta Actual</strong>
              <div id="sistema-cart-slot"></div>
            </div>
          </div>

          <div class="pos-side-col">
            <div class="pos-card pos-summary-card">
              <strong style="display:block;font-size:13.5px;color:var(--pos-ink);margin-bottom:10px;">Facturación y Pago (IVA 15%)</strong>

              <div style="margin-bottom:10px;">
                <label for="sistema-customer-select-el" style="display:block;font-size:12px;font-weight:600;color:var(--pos-muted);margin-bottom:4px;">Cliente</label>
                <select id="sistema-customer-select-el" data-testid="sistema-customer-select" style="width:100%;">
                  ${POS_CUSTOMERS.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
                </select>
              </div>

              <div style="margin-bottom:10px;">
                <label for="sistema-discount-input-el" style="display:block;font-size:12px;font-weight:600;color:var(--pos-muted);margin-bottom:4px;">Descuento (%)</label>
                <input
                  id="sistema-discount-input-el"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value="0"
                  name="descuento"
                  aria-label="Descuento (%)"
                  data-testid="sistema-discount-input"
                  style="width:100%;"
                />
                <div style="font-size:11px;color:var(--pos-muted);margin-top:3px;">Política vigente: Descuento Taller Aliado hasta 10% (BV-XX / EXD-XX si excede).</div>
              </div>

              <div id="sistema-policy-slot" style="margin-bottom:10px;"></div>

              <div style="margin-bottom:10px;">
                <span style="display:block;font-size:12px;font-weight:600;color:var(--pos-muted);margin-bottom:4px;">Método de pago</span>
                <div id="sistema-payment-methods" style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${[...PAYMENT_METHODS.map((m) => m.label), 'Mixto (C$)']
                    .map(
                      (label) => `
                        <button
                          type="button"
                          class="pos-pay-btn"
                          data-pay-method="${escapeHtml(label)}"
                          style="padding:5px 9px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--pos-line);background:#ffffff;color:var(--pos-ink);"
                        >${escapeHtml(label)}</button>
                      `
                    )
                    .join('')}
                </div>
              </div>

              <div id="sistema-mixed-slot" style="margin-bottom:10px;"></div>
              <div id="sistema-summary-slot" style="margin-bottom:10px;"></div>

              <button type="button" class="pos-btn-sale" data-testid="sistema-confirm-sale" style="width:100%;padding:10px 14px;font-size:13.5px;">
                Confirmar venta y emitir F-000000xx
              </button>

              <div id="sistema-checkout-msg" style="margin-top:8px;"></div>
            </div>

            <div id="sistema-receipt-slot"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const stepHintEl = panelEl.querySelector('#sistema-step-hint');
  const roleSelectEl = panelEl.querySelector('[data-testid="sistema-role-select"]');
  const rbacSlotEl = panelEl.querySelector('#sistema-rbac-slot');
  const openShiftBtn = panelEl.querySelector('[data-testid="sistema-open-shift"]');
  const closeShiftBtn = panelEl.querySelector('[data-testid="sistema-close-shift"]');
  const shiftSlotEl = panelEl.querySelector('#sistema-shift-slot');
  const searchInputEl = panelEl.querySelector('[data-testid="sistema-catalog-search"]');
  const catalogWarnSlotEl = panelEl.querySelector('#sistema-catalog-warn-slot');
  const catalogSlotEl = panelEl.querySelector('#sistema-catalog-slot');
  const cartSlotEl = panelEl.querySelector('#sistema-cart-slot');
  const customerSelectEl = panelEl.querySelector('[data-testid="sistema-customer-select"]');
  const discountInputEl = panelEl.querySelector('[data-testid="sistema-discount-input"]');
  const policySlotEl = panelEl.querySelector('#sistema-policy-slot');
  const payBtns = [...panelEl.querySelectorAll('.pos-pay-btn')];
  const mixedSlotEl = panelEl.querySelector('#sistema-mixed-slot');
  const summarySlotEl = panelEl.querySelector('#sistema-summary-slot');
  const confirmSaleBtn = panelEl.querySelector('[data-testid="sistema-confirm-sale"]');
  const checkoutMsgEl = panelEl.querySelector('#sistema-checkout-msg');
  const receiptSlotEl = panelEl.querySelector('#sistema-receipt-slot');

  function getActiveRole() {
    return POS_ROLES.find((r) => r.id === activeRoleId) || POS_ROLES[0];
  }

  function getTotals() {
    return calculatePosLineTotals(cart, discountRate, POS_POLICIES.taxPolicy.rate);
  }

  function renderStepHint() {
    stepHintEl.textContent = STEP_HINTS[stepId] || STEP_HINTS.default;
  }

  function renderRbac() {
    const role = getActiveRole();
    const blockedBanner = !role.canSell
      ? `
        <div class="pos-alert-403" style="margin-top:8px;">
          <strong>HTTP 403 Prohibido · Rol ${escapeHtml(role.name)} (${role.permissionCount} permisos):</strong>
          acceso POS restringido — modo auditoría / consulta. Solo <strong>Vendedor (37 permisos)</strong> o <strong>Administración (74 permisos)</strong> pueden aperturar caja y emitir facturas.
          <div style="margin-top:4px;font-size:12px;">
            Acciones bloqueadas: ${escapeHtml(role.blockedActions.join(' · '))}
          </div>
        </div>
      `
      : `
        <div style="margin-top:6px;padding:7px 10px;border-radius:8px;background:#edf7f6;border:1px solid #b7dfd9;font-size:12px;color:#064954;">
          <strong>Sesión activa:</strong> ${escapeHtml(role.fullName)} · ${role.permissionCount} permisos habilitados · ${escapeHtml(role.summary)}
        </div>
      `;

    const matrixHtml = showRbacMatrix
      ? `
        <div style="margin-top:10px;overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
            <thead>
              <tr style="background:#f1f5f9;color:var(--pos-ink);">
                <th style="padding:5px 7px;border:1px solid var(--pos-line);text-align:left;">Módulo SoD</th>
                <th style="padding:5px 7px;border:1px solid var(--pos-line);text-align:left;">Vendedor</th>
                <th style="padding:5px 7px;border:1px solid var(--pos-line);text-align:left;">Bodega</th>
                <th style="padding:5px 7px;border:1px solid var(--pos-line);text-align:left;">Admin</th>
                <th style="padding:5px 7px;border:1px solid var(--pos-line);text-align:left;">Gerencia</th>
              </tr>
            </thead>
            <tbody>
              ${RBAC_SOD_MATRIX.map(
                (row) => `
                  <tr>
                    <td style="padding:4px 7px;border:1px solid var(--pos-line);font-weight:600;">${escapeHtml(row.module)}</td>
                    <td style="padding:4px 7px;border:1px solid var(--pos-line);">${escapeHtml(row.vendedor)}</td>
                    <td style="padding:4px 7px;border:1px solid var(--pos-line);">${escapeHtml(row.bodega)}</td>
                    <td style="padding:4px 7px;border:1px solid var(--pos-line);">${escapeHtml(row.administracion)}</td>
                    <td style="padding:4px 7px;border:1px solid var(--pos-line);">${escapeHtml(row.gerencia)}</td>
                  </tr>
                `
              ).join('')}
            </tbody>
          </table>
        </div>
      `
      : '';

    rbacSlotEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
        <div>
          <strong style="font-size:13px;color:var(--pos-ink);">Seguridad RBAC y Separación de Funciones (SoD)</strong>
          <span style="font-size:12px;color:var(--pos-muted);margin-left:6px;">(${escapeHtml(role.name)} · ${role.permissionCount} permisos)</span>
        </div>
        <button type="button" id="sistema-toggle-matrix-btn" style="background:#f8fafc;border:1px solid var(--pos-line);color:var(--pos-accent);border-radius:7px;padding:4px 9px;font-size:11.5px;font-weight:700;cursor:pointer;">
          ${showRbacMatrix ? 'Ocultar matriz SoD' : 'Ver matriz SoD (10 controles)'}
        </button>
      </div>
      ${blockedBanner}
      ${matrixHtml}
    `;

    rbacSlotEl.querySelector('#sistema-toggle-matrix-btn')?.addEventListener('click', () => {
      showRbacMatrix = !showRbacMatrix;
      renderRbac();
    });
  }

  function renderShift() {
    const billsLabel = CORDOBA_DENOMINATIONS.bills.map((b) => b.label).join(' · ');
    if (shiftOpen) {
      shiftSlotEl.innerHTML = `
        <div style="padding:8px 10px;border-radius:8px;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;font-size:12.5px;">
          <strong>Turno abierto #${String(shiftSeq).padStart(3, '0')}</strong> · Fondo inicial <strong>${fmtC(openingCash)}</strong> · Umbral diferencia caja ≤ ${fmtC(CORDOBA_DENOMINATIONS.cashDiffThresholdStandard)} (estricto: ${fmtC(CORDOBA_DENOMINATIONS.cashDiffThresholdStrict)}).
          <div style="font-size:11.5px;color:#047857;margin-top:3px;">Arqueo C$ billetes: ${escapeHtml(billsLabel)}</div>
        </div>
      `;
    } else {
      shiftSlotEl.innerHTML = `
        <div style="padding:8px 10px;border-radius:8px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;font-size:12.5px;">
          <strong>Turno cerrado</strong> · Presione <em>Aperturar turno (C$ 1,500.00)</em> para habilitar cobro en mostrador.
          ${shiftClosedNote ? `<div style="margin-top:3px;font-size:12px;">${escapeHtml(shiftClosedNote)}</div>` : ''}
        </div>
      `;
    }
  }

  function renderCatalogWarn() {
    if (!stockWarning) {
      catalogWarnSlotEl.innerHTML = '';
      return;
    }
    catalogWarnSlotEl.innerHTML = `
      <div style="margin-bottom:8px;padding:8px 10px;border-radius:8px;background:#fffbeb;border:1px solid #f59e0b;color:#92400e;font-size:12px;font-weight:600;">
        ⚠ ${escapeHtml(stockWarning)}
      </div>
    `;
  }

  function renderCatalog() {
    const q = searchQuery.trim().toLowerCase();
    const role = getActiveRole();
    const items = q
      ? POS_CATALOG.filter(
          (p) =>
            p.sku.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.compatibility.toLowerCase().includes(q)
        )
      : POS_CATALOG;

    if (!items.length) {
      catalogSlotEl.innerHTML = `<div style="padding:10px;color:var(--pos-muted);font-size:12.5px;">Sin coincidencias en catálogo para "${escapeHtml(searchQuery)}".</div>`;
      return;
    }

    catalogSlotEl.innerHTML = `
      <div style="max-height:220px;overflow:auto;border:1px solid var(--pos-line);border-radius:8px;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead style="position:sticky;top:0;background:#f8fafc;z-index:1;">
            <tr>
              <th style="padding:6px 8px;border-bottom:1px solid var(--pos-line);text-align:left;">SKU / Repuesto</th>
              <th style="padding:6px 8px;border-bottom:1px solid var(--pos-line);text-align:right;">Precio</th>
              <th style="padding:6px 8px;border-bottom:1px solid var(--pos-line);text-align:right;">Disp.</th>
              <th style="padding:6px 8px;border-bottom:1px solid var(--pos-line);text-align:right;">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((prod) => {
                const avail = stockBySku.get(prod.sku) ?? prod.stock;
                const inCart = cart.find((c) => c.sku === prod.sku)?.quantity || 0;
                const remaining = Math.max(0, avail - inCart);
                const disabled = !role.canSell || remaining <= 0;
                return `
                  <tr>
                    <td style="padding:6px 8px;border-bottom:1px solid #eef2f6;">
                      <strong style="font-family:var(--font-mono);color:var(--pos-accent);">${escapeHtml(prod.sku)}</strong>
                      <span style="display:block;color:var(--pos-ink);font-weight:600;">${escapeHtml(prod.name)}</span>
                      <span style="display:block;font-size:11px;color:var(--pos-muted);">${escapeHtml(prod.category)} · ${escapeHtml(prod.compatibility)}</span>
                    </td>
                    <td style="padding:6px 8px;border-bottom:1px solid #eef2f6;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;">${fmtC(prod.price)}</td>
                    <td style="padding:6px 8px;border-bottom:1px solid #eef2f6;text-align:right;font-family:var(--font-mono);white-space:nowrap;">${remaining}/${avail}</td>
                    <td style="padding:6px 8px;border-bottom:1px solid #eef2f6;text-align:right;">
                      <button
                        type="button"
                        data-testid="sistema-add-item"
                        data-sku="${escapeHtml(prod.sku)}"
                        ${disabled ? 'disabled' : ''}
                        style="padding:5px 9px;border-radius:6px;border:1px solid ${disabled ? '#cbd5e1' : 'var(--pos-accent)'};background:${disabled ? '#e2e8f0' : 'var(--pos-accent)'};color:${disabled ? '#64748b' : '#ffffff'};font-size:11.5px;font-weight:700;cursor:${disabled ? 'not-allowed' : 'pointer'};"
                      >${remaining <= 0 ? 'Máx.' : '+ Agregar'}</button>
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    catalogSlotEl.querySelectorAll('[data-testid="sistema-add-item"]').forEach((btn) => {
      btn.addEventListener('click', () => handleAddItem(btn.dataset.sku));
    });
  }

  function renderCart() {
    if (!cart.length) {
      cartSlotEl.innerHTML = `<div style="padding:10px;border:1px dashed var(--pos-line);border-radius:8px;color:var(--pos-muted);font-size:12.5px;">Carrito vacío. Agregue al menos un ítem ACA-* u otro repuesto del catálogo.</div>`;
      return;
    }
    const totals = getTotals();
    cartSlotEl.innerHTML = `
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:5px 7px;border-bottom:1px solid var(--pos-line);text-align:left;">SKU</th>
              <th style="padding:5px 7px;border-bottom:1px solid var(--pos-line);text-align:center;">Cant.</th>
              <th style="padding:5px 7px;border-bottom:1px solid var(--pos-line);text-align:right;">P. Unit</th>
              <th style="padding:5px 7px;border-bottom:1px solid var(--pos-line);text-align:right;">IVA 15%</th>
              <th style="padding:5px 7px;border-bottom:1px solid var(--pos-line);text-align:right;">Total línea</th>
              <th style="padding:5px 7px;border-bottom:1px solid var(--pos-line);text-align:right;">Quitar</th>
            </tr>
          </thead>
          <tbody>
            ${totals.lines
              .map(
                (line) => `
                  <tr>
                    <td style="padding:5px 7px;border-bottom:1px solid #eef2f6;">
                      <strong style="font-family:var(--font-mono);color:var(--pos-accent);">${escapeHtml(line.sku)}</strong>
                      <span style="display:block;font-size:11px;color:var(--pos-muted);">${escapeHtml(line.name)}</span>
                    </td>
                    <td style="padding:5px 7px;border-bottom:1px solid #eef2f6;text-align:center;white-space:nowrap;">
                      <button type="button" data-cart-dec="${escapeHtml(line.sku)}" style="width:22px;height:22px;border:1px solid var(--pos-line);border-radius:4px;background:#fff;cursor:pointer;">-</button>
                      <span style="margin:0 5px;font-family:var(--font-mono);font-weight:700;">${line.quantity}</span>
                      <button type="button" data-cart-inc="${escapeHtml(line.sku)}" style="width:22px;height:22px;border:1px solid var(--pos-line);border-radius:4px;background:#fff;cursor:pointer;">+</button>
                    </td>
                    <td style="padding:5px 7px;border-bottom:1px solid #eef2f6;text-align:right;font-variant-numeric:tabular-nums;">${fmtC(line.unitPrice)}</td>
                    <td style="padding:5px 7px;border-bottom:1px solid #eef2f6;text-align:right;font-variant-numeric:tabular-nums;">${fmtC(line.lineTax)}</td>
                    <td style="padding:5px 7px;border-bottom:1px solid #eef2f6;text-align:right;font-weight:700;font-variant-numeric:tabular-nums;">${fmtC(line.lineTotal)}</td>
                    <td style="padding:5px 7px;border-bottom:1px solid #eef2f6;text-align:right;">
                      <button type="button" data-cart-rm="${escapeHtml(line.sku)}" style="border:0;background:transparent;color:var(--pos-danger);font-weight:700;cursor:pointer;">✕</button>
                    </td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    cartSlotEl.querySelectorAll('[data-cart-dec]').forEach((b) =>
      b.addEventListener('click', () => updateCartQty(b.dataset.cartDec, -1))
    );
    cartSlotEl.querySelectorAll('[data-cart-inc]').forEach((b) =>
      b.addEventListener('click', () => updateCartQty(b.dataset.cartInc, 1))
    );
    cartSlotEl.querySelectorAll('[data-cart-rm]').forEach((b) =>
      b.addEventListener('click', () => removeCartItem(b.dataset.cartRm))
    );
  }

  function renderPolicy() {
    if (discountRate > 10) {
      policySlotEl.innerHTML = `
        <div style="padding:8px 10px;border-radius:8px;background:#fffbeb;border:1px solid #f59e0b;color:#92400e;font-size:12px;">
          <strong>Política excedida (${discountRate}% &gt; 10%):</strong> requiere guardar <strong>borrador BV-01</strong> y solicitar <strong>excepción EXD-01</strong> aprobada por Administración/Gerencia.
        </div>
      `;
    } else {
      policySlotEl.innerHTML = `
        <div style="padding:6px 9px;border-radius:7px;background:#f8fafc;border:1px solid var(--pos-line);color:var(--pos-muted);font-size:11.5px;">
          Flujo activo: <strong>Descuento Taller Aliado (10%)</strong> · BV-XX / EXD-XX en regla.
        </div>
      `;
    }
  }

  function renderMixedPayment() {
    payBtns.forEach((btn) => {
      const active = btn.dataset.payMethod === paymentMethod;
      btn.style.background = active ? 'var(--pos-accent)' : '#ffffff';
      btn.style.borderColor = active ? 'var(--pos-accent)' : 'var(--pos-line)';
      btn.style.color = active ? '#ffffff' : 'var(--pos-ink)';
    });

    if (paymentMethod === 'Mixto (C$)') {
      const totals = getTotals();
      const diff = roundMoney(mixedCash + mixedCard - totals.grandTotal);
      const matched = Math.abs(diff) <= 0.01;
      mixedSlotEl.innerHTML = `
        <div style="padding:9px 10px;border-radius:8px;background:#f8fafc;border:1px solid var(--pos-line);font-size:12px;">
          <strong style="display:block;color:var(--pos-ink);margin-bottom:6px;">Desglose Pago Mixto (C$)</strong>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">
            <div>
              <label for="pos-mix-cash" style="display:block;font-size:11px;color:var(--pos-muted);">Efectivo (C$)</label>
              <input id="pos-mix-cash" type="number" min="0" step="0.01" value="${mixedCash}" style="width:100%;" />
            </div>
            <div>
              <label for="pos-mix-card" style="display:block;font-size:11px;color:var(--pos-muted);">Tarjeta (C$)</label>
              <input id="pos-mix-card" type="number" min="0" step="0.01" value="${mixedCard}" style="width:100%;" />
            </div>
          </div>
          <div style="font-weight:700;color:${matched ? '#065f46' : '#a83232'};">
            Suma: ${fmtC(mixedCash + mixedCard)} · Objetivo: ${fmtC(totals.grandTotal)} (${matched ? 'Cuadrado exacto' : `Diferencia ${fmtC(diff)}`})
          </div>
        </div>
      `;
      mixedSlotEl.querySelector('#pos-mix-cash')?.addEventListener('input', (e) => {
        mixedCash = Math.max(0, Number(e.target.value) || 0);
        renderMixedPayment();
      });
      mixedSlotEl.querySelector('#pos-mix-card')?.addEventListener('input', (e) => {
        mixedCard = Math.max(0, Number(e.target.value) || 0);
        renderMixedPayment();
      });
    } else if (paymentMethod === 'Tarjeta' || paymentMethod === 'Transferencia') {
      mixedSlotEl.innerHTML = `
        <div>
          <label for="pos-pay-ref" style="display:block;font-size:11.5px;color:var(--pos-muted);margin-bottom:3px;">Referencia ${escapeHtml(paymentMethod)} (opcional en demo)</label>
          <input id="pos-pay-ref" type="text" value="${escapeHtml(paymentRef)}" placeholder="Ej. AUT-904218" style="width:100%;" />
        </div>
      `;
      mixedSlotEl.querySelector('#pos-pay-ref')?.addEventListener('input', (e) => {
        paymentRef = e.target.value;
      });
    } else {
      mixedSlotEl.innerHTML = '';
    }
  }

  function renderSummary() {
    const t = getTotals();
    summarySlotEl.innerHTML = `
      <div style="border-top:1px solid var(--pos-line);padding-top:8px;font-size:12.5px;display:grid;gap:4px;">
        <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><span>${fmtC(t.subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;"><span>Descuento (${discountRate}%)</span><span>-${fmtC(t.discountTotal)}</span></div>
        <div style="display:flex;justify-content:space-between;"><span>Base imponible</span><span>${fmtC(t.taxableBase)}</span></div>
        <div style="display:flex;justify-content:space-between;"><span>${escapeHtml(POS_POLICIES.taxPolicy.label)}</span><span>${fmtC(t.taxTotal)}</span></div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--pos-line);padding-top:6px;margin-top:2px;">
          <strong>Total C$</strong>
          <span class="pos-grand-total">${fmtC(t.grandTotal)}</span>
        </div>
      </div>
    `;
  }

  function renderCheckoutMsg() {
    if (!checkoutMessage) {
      checkoutMsgEl.innerHTML = '';
      return;
    }
    const isErr = checkoutTone === 'error' || checkoutTone === 'warn';
    checkoutMsgEl.innerHTML = `
      <div class="${isErr ? 'pos-alert-403' : ''}" style="font-size:12px;${isErr ? '' : 'padding:8px 10px;border-radius:8px;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;'}">
        ${escapeHtml(checkoutMessage)}
      </div>
    `;
  }

  function renderReceipt() {
    if (!lastReceipt) {
      receiptSlotEl.innerHTML = '';
      return;
    }
    const r = lastReceipt;
    receiptSlotEl.innerHTML = `
      <div class="pos-invoice-card" data-testid="sistema-receipt">
        <div class="pos-invoice-brand-row">
          <div>
            <strong style="display:block;font-size:13.5px;color:var(--pos-ink);">Factura Oficial MREC</strong>
            <span style="font-size:11.5px;color:var(--pos-muted);">Moto Repuestos El Centenario, S.A.</span>
          </div>
          <div style="text-align:right;">
            <strong style="display:block;font-family:var(--font-mono);font-size:14px;color:var(--pos-accent);">${escapeHtml(r.invoiceNo)}</strong>
            <span style="font-size:11px;color:var(--pos-muted);">${escapeHtml(r.timestamp)}</span>
          </div>
        </div>
        <div style="font-size:12px;margin-bottom:8px;color:var(--pos-ink);">
          <div><strong>Cliente:</strong> ${escapeHtml(r.customer)}</div>
          <div><strong>Operador:</strong> ${escapeHtml(r.seller)}</div>
          <div><strong>Pago:</strong> ${escapeHtml(r.paymentSummary)}</div>
        </div>
        <div style="border-top:1px dashed var(--pos-line);border-bottom:1px dashed var(--pos-line);padding:6px 0;margin-bottom:8px;font-size:11.5px;">
          ${r.lines
            .map(
              (l) => `
              <div style="display:flex;justify-content:space-between;gap:6px;">
                <span>${l.quantity}x ${escapeHtml(l.sku)} (${escapeHtml(l.name)})</span>
                <strong style="font-variant-numeric:tabular-nums;">${fmtC(l.lineTotal)}</strong>
              </div>`
            )
            .join('')}
        </div>
        <div style="font-size:12px;display:grid;gap:3px;">
          <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><span>${fmtC(r.totals.subtotal)}</span></div>
          <div style="display:flex;justify-content:space-between;"><span>Descuento</span><span>-${fmtC(r.totals.discountTotal)}</span></div>
          <div style="display:flex;justify-content:space-between;"><span>IVA (15%)</span><span>${fmtC(r.totals.taxTotal)}</span></div>
          <div style="display:flex;justify-content:space-between;font-weight:800;color:var(--pos-accent);font-size:14px;padding-top:4px;border-top:1px solid var(--pos-line);">
            <span>Total Pagado</span>
            <span>${fmtC(r.totals.grandTotal)}</span>
          </div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:#065f46;background:#ecfdf5;padding:5px 8px;border-radius:6px;">
          Stock descontado atómicamente (SELECT FOR UPDATE) · AuditEvent registrado.
        </div>
      </div>
    `;
  }

  function renderAll() {
    renderStepHint();
    renderRbac();
    renderShift();
    renderCatalogWarn();
    renderCatalog();
    renderCart();
    renderPolicy();
    renderMixedPayment();
    renderSummary();
    renderCheckoutMsg();
    renderReceipt();
  }

  function handleAddItem(sku) {
    const prod = POS_CATALOG.find((p) => p.sku === sku);
    if (!prod) return;
    const role = getActiveRole();
    if (!role.canSell) {
      checkoutTone = 'error';
      checkoutMessage = `HTTP 403: Rol ${role.name} (${role.permissionCount} permisos) en modo restringido/consulta.`;
      renderCheckoutMsg();
      return;
    }

    const available = stockBySku.get(sku) ?? prod.stock;
    const existing = cart.find((c) => c.sku === sku);
    const currentQty = existing ? existing.quantity : 0;

    if (available <= 0 || currentQty >= available) {
      stockWarning = `Límite máximo de stock disponible alcanzado (${available} u.) para ${prod.sku} · bloqueo quantity__gte (stock insuficiente).`;
      renderCatalogWarn();
      renderCatalog();
      return;
    }

    const nextQty = currentQty + 1;
    if (existing) {
      existing.quantity = nextQty;
    } else {
      cart.push({
        sku: prod.sku,
        name: prod.name,
        price: prod.price,
        stock: available,
        quantity: 1,
      });
    }

    if (nextQty >= available) {
      stockWarning = `Límite máximo de stock disponible alcanzado (${available} u.) para ${prod.sku} · bloqueo quantity__gte.`;
    } else {
      stockWarning = '';
    }

    checkoutMessage = '';
    if (paymentMethod === 'Mixto (C$)') {
      const t = getTotals();
      mixedCash = roundMoney(t.grandTotal / 2);
      mixedCard = roundMoney(t.grandTotal - mixedCash);
    }
    renderCatalogWarn();
    renderCatalog();
    renderCart();
    renderMixedPayment();
    renderSummary();
    renderCheckoutMsg();
  }

  function updateCartQty(sku, delta) {
    const idx = cart.findIndex((c) => c.sku === sku);
    if (idx < 0) return;
    const item = cart[idx];
    const available = stockBySku.get(sku) ?? item.stock;
    const nextQty = item.quantity + delta;
    if (nextQty <= 0) {
      cart.splice(idx, 1);
      stockWarning = '';
    } else if (nextQty > available) {
      stockWarning = `Stock insuficiente para ${sku}: máximo disponible ${available} u. (bloqueo quantity__gte).`;
    } else {
      item.quantity = nextQty;
      stockWarning =
        nextQty === available
          ? `Límite máximo de stock disponible alcanzado (${available} u.) para ${sku} · bloqueo quantity__gte.`
          : '';
    }
    if (paymentMethod === 'Mixto (C$)') {
      const t = getTotals();
      mixedCash = roundMoney(t.grandTotal / 2);
      mixedCard = roundMoney(t.grandTotal - mixedCash);
    }
    renderCatalogWarn();
    renderCatalog();
    renderCart();
    renderMixedPayment();
    renderSummary();
  }

  function removeCartItem(sku) {
    cart = cart.filter((c) => c.sku !== sku);
    stockWarning = '';
    if (paymentMethod === 'Mixto (C$)') {
      const t = getTotals();
      mixedCash = roundMoney(t.grandTotal / 2);
      mixedCard = roundMoney(t.grandTotal - mixedCash);
    }
    renderCatalogWarn();
    renderCatalog();
    renderCart();
    renderMixedPayment();
    renderSummary();
  }

  roleSelectEl.addEventListener('change', () => {
    activeRoleId = roleSelectEl.value;
    checkoutMessage = '';
    renderRbac();
    renderCatalog();
    renderCheckoutMsg();
  });

  openShiftBtn.addEventListener('click', () => {
    const role = getActiveRole();
    if (!role.canOpenShift) {
      checkoutTone = 'error';
      checkoutMessage = `HTTP 403: Rol ${role.name} (${role.permissionCount} permisos) no autorizado para aperturar caja.`;
      renderCheckoutMsg();
      return;
    }
    if (!shiftOpen) {
      shiftOpen = true;
      shiftClosedNote = '';
      checkoutTone = 'ok';
      checkoutMessage = `Turno #${String(shiftSeq).padStart(3, '0')} aperturado en C$ (${fmtC(openingCash)}).`;
    }
    renderShift();
    renderCheckoutMsg();
  });

  closeShiftBtn.addEventListener('click', () => {
    const role = getActiveRole();
    if (!role.canOpenShift) {
      checkoutTone = 'error';
      checkoutMessage = `HTTP 403: Rol ${role.name} no puede cerrar caja sin permiso operativo.`;
      renderCheckoutMsg();
      return;
    }
    if (shiftOpen) {
      shiftOpen = false;
      shiftClosedNote = `Último cierre #${String(shiftSeq).padStart(3, '0')} verificado sin diferencia fuera de umbral.`;
      shiftSeq += 1;
      checkoutTone = 'ok';
      checkoutMessage = shiftClosedNote;
      renderShift();
      renderCheckoutMsg();
    }
  });

  searchInputEl.addEventListener('input', () => {
    searchQuery = searchInputEl.value;
    renderCatalog();
  });

  customerSelectEl.addEventListener('change', () => {
    selectedCustomer = customerSelectEl.value || POS_CUSTOMERS[0];
  });

  const onDiscountChange = () => {
    const parsed = Number(discountInputEl.value);
    discountRate = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
    if (paymentMethod === 'Mixto (C$)') {
      const t = getTotals();
      mixedCash = roundMoney(t.grandTotal / 2);
      mixedCard = roundMoney(t.grandTotal - mixedCash);
    }
    renderPolicy();
    renderCart();
    renderMixedPayment();
    renderSummary();
  };
  discountInputEl.addEventListener('input', onDiscountChange);
  discountInputEl.addEventListener('change', onDiscountChange);

  payBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      paymentMethod = btn.dataset.payMethod || 'Efectivo';
      if (paymentMethod === 'Mixto (C$)') {
        const t = getTotals();
        mixedCash = roundMoney(t.grandTotal / 2);
        mixedCard = roundMoney(t.grandTotal - mixedCash);
      }
      renderMixedPayment();
    });
  });

  confirmSaleBtn.addEventListener('click', () => {
    const role = getActiveRole();
    if (!role.canSell) {
      checkoutTone = 'error';
      checkoutMessage = `HTTP 403: Rol ${role.name} (${role.permissionCount} permisos) en modo restringido/consulta; solo Vendedor o Administración pueden emitir facturas.`;
      renderCheckoutMsg();
      return;
    }
    if (!shiftOpen) {
      checkoutTone = 'error';
      checkoutMessage = 'Validación MREC: debe aperturar primero un turno de caja en C$ antes de confirmar la venta.';
      renderCheckoutMsg();
      return;
    }
    if (!cart.length) {
      checkoutTone = 'error';
      checkoutMessage = 'Validación MREC: el carrito está vacío. Agregue al menos un repuesto antes de confirmar.';
      renderCheckoutMsg();
      return;
    }
    for (const line of cart) {
      const avail = stockBySku.get(line.sku) ?? 0;
      if (line.quantity > avail) {
        checkoutTone = 'error';
        checkoutMessage = `Stock insuficiente para ${line.sku}: solicitado ${line.quantity}, disponible ${avail} (quantity__gte).`;
        renderCheckoutMsg();
        return;
      }
    }
    if (discountRate > 10 && !role.canConfigTaxDiscount) {
      checkoutTone = 'warn';
      checkoutMessage = `Descuento ${discountRate}% excede política vigente (10%). Guardado en borrador BV-01 pendiente de excepción EXD-01.`;
      renderCheckoutMsg();
      return;
    }

    const totals = getTotals();
    let paymentSummary = paymentMethod;
    if (paymentMethod === 'Mixto (C$)') {
      const sumPay = roundMoney(mixedCash + mixedCard);
      if (Math.abs(sumPay - totals.grandTotal) > 0.01) {
        checkoutTone = 'error';
        checkoutMessage = `Pago mixto descuadrado (${fmtC(sumPay)} vs Total ${fmtC(totals.grandTotal)}). Ajuste Efectivo y Tarjeta.`;
        renderCheckoutMsg();
        return;
      }
      paymentSummary = `Mixto (${fmtC(mixedCash)} Efectivo + ${fmtC(mixedCard)} Tarjeta)`;
    } else if (paymentRef) {
      paymentSummary = `${paymentMethod} · Ref. ${paymentRef}`;
    }

    for (const line of cart) {
      const prev = stockBySku.get(line.sku) ?? line.stock;
      stockBySku.set(line.sku, Math.max(0, prev - line.quantity));
    }

    invoiceSeq += 1;
    const invoiceNo = `${POS_POLICIES.limits.invoicePrefix}${String(invoiceSeq).padStart(
      POS_POLICIES.limits.invoiceDigits,
      '0'
    )}`;

    lastReceipt = {
      invoiceNo,
      timestamp: new Date().toLocaleTimeString('es-NI', { hour12: false }),
      customer: selectedCustomer,
      seller: `${role.fullName}`,
      paymentSummary,
      lines: totals.lines,
      totals,
    };

    cart = [];
    discountRate = 0;
    discountInputEl.value = '0';
    stockWarning = '';
    mixedCash = 0;
    mixedCard = 0;
    checkoutTone = 'ok';
    checkoutMessage = `Comprobante ${invoiceNo} emitido y confirmado en Ledger POS.`;

    renderCatalogWarn();
    renderCatalog();
    renderCart();
    renderPolicy();
    renderMixedPayment();
    renderSummary();
    renderCheckoutMsg();
    renderReceipt();
  });

  renderAll();

  return {
    sync(payload = {}) {
      if (payload.stepId !== undefined) {
        stepId = String(payload.stepId || '');
        renderStepHint();
      }
    },
    destroy() {
      panelEl.innerHTML = '';
    },
  };
}
