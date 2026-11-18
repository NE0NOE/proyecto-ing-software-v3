import { CHAPTERS, PRESENTERS, SLIDES } from '../data/slides.js';
import { REGRESSION_SERIES } from '../data/evidenciasData.js';
import {
  escapeHtml,
  highlightCodeHtml,
  renderCapacityGaugeSvg,
  renderCashflowBarsSvg,
  renderDgaWaterfallSvg,
  renderEnergyCompareSvg,
  renderHorizontalScoreChartSvg,
  renderRegressionDynoSvg,
  renderVlanStarSvg,
} from './charts.js';
import {
  mountS07TriggerSim,
  mountS13PlanSim,
  mountS20ConcurrencySim,
  mountS25MmcSim,
  mountS28SensitivitySim,
  mountS31TraceabilitySim,
} from './simulations.js';

function renderBadgeRow(slide) {
  return `
    <div class="slide-top-meta">
      <div class="slide-badges-row">
        <span class="slide-pill slide-pill--blue">${escapeHtml(slide.id)}</span>
        <span class="slide-pill">${escapeHtml(slide.entrega)} · ${escapeHtml(slide.chapter)}</span>
        <span class="slide-pill slide-pill--orange">${escapeHtml(slide.act)}</span>
      </div>
    </div>
  `;
}

function renderMetricsStrip(slide) {
  const metrics = slide.metrics || [];
  if (!metrics.length) return '';
  return `
    <div class="slide-metrics-strip">
      ${metrics
        .map(
          (m) => `
          <div class="metric-chip metric-chip--${escapeHtml(m.tone || 'blue')}">
            <span class="metric-chip-label">${escapeHtml(m.label)}</span>
            <span class="metric-chip-value">${escapeHtml(m.value)}</span>
          </div>`
        )
        .join('')}
    </div>
  `;
}

function renderBullets(slide) {
  const bullets = slide.bullets || [];
  if (!bullets.length) return '';
  return `
    <ul class="slide-bullets">
      ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
    </ul>
  `;
}

function renderVisualPanel(slide) {
  const data = slide.structuredData || {};

  switch (slide.visualType) {
    case 'cards':
      if (data.flowNodes) {
        return `
          <div class="slide-visual-panel">
            <h3 class="panel-heading"><span>Flujo medular operativo MREC</span><span class="slide-pill slide-pill--blue">5 nodos</span></h3>
            <div class="flow-chain">
              ${data.flowNodes.map((n) => `<span class="flow-node">${escapeHtml(n)}</span>`).join('')}
            </div>
          </div>
        `;
      }
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Cuatro brechas identificadas</span><span class="slide-pill slide-pill--red">Diagnóstico</span></h3>
          <div class="mini-cards-grid">
            ${(data.cards || [])
              .map(
                (c) => `
                <div class="mini-card" style="border-left:3px solid ${c.tone === 'red' ? '#e94560' : '#FF6B1A'};">
                  <strong style="display:block;color:var(--text-primary);margin-bottom:3px;">${escapeHtml(c.title)}</strong>
                  <span style="color:var(--text-secondary);">${escapeHtml(c.desc)}</span>
                </div>`
              )
              .join('')}
          </div>
        </div>
      `;

    case 'dials':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Objetivos medibles y frontera del sistema</span><span class="slide-pill slide-pill--blue">StRS</span></h3>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            ${(data.objectives || [])
              .map(
                (o) => `
                <div class="mini-card">
                  <strong style="color:var(--blueprint-cyan);font-family:var(--font-mono);">${escapeHtml(o.id)}</strong>
                  <span style="display:block;font-weight:700;color:var(--text-primary);">${escapeHtml(o.title)}</span>
                  <span style="font-size:11px;color:#86efac;">${escapeHtml(o.target)}</span>
                </div>`
              )
              .join('')}
          </div>
          <div class="mini-card" style="border-color:rgba(233,69,96,0.5);background:rgba(233,69,96,0.09);">
            <strong style="display:block;color:#fda4af;margin-bottom:3px;">Frontera del sistema (Exclusiones expresas)</strong>
            <span>${escapeHtml((data.exclusions || []).join(' · '))}</span>
          </div>
        </div>
      `;

    case 'orbit':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>7 perfiles alrededor del sistema</span><span class="slide-pill slide-pill--orange">StRS 4.3</span></h3>
          <div class="mini-cards-grid">
            ${(data.stakeholders || [])
              .map((s) => `<div class="mini-card"><strong>${escapeHtml(s)}</strong></div>`)
              .join('')}
          </div>
        </div>
      `;

    case 'db-chassis':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Inspeccionar tablas núcleo SABD (8 tablas)</span><span class="slide-pill slide-pill--blue">PostgreSQL 18.4</span></h3>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            ${(data.tables || [])
              .map(
                (t) => `
                <button
                  type="button"
                  class="mini-card mini-card-btn"
                  data-db-table="${escapeHtml(t.name)}"
                >
                  <strong style="display:block;color:var(--blueprint-cyan);">${escapeHtml(t.name)}</strong>
                  <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">PK: ${escapeHtml(t.pk)}</span>
                </button>`
              )
              .join('')}
          </div>
          <div class="sim-status-box is-ok" data-testid="s06-table-detail">
            Seleccione una tabla del chasis SABD para inspeccionar llave primaria y restricción referencial.
          </div>
        </div>
      `;

    case 'funnel':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Refinamiento ISO/IEC/IEEE 29148</span><span class="slide-pill slide-pill--green">Sin huérfanos</span></h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${(data.levels || [])
              .map(
                (lvl, i) => `
                <div class="mini-card" style="border-left:4px solid ${i === 3 ? '#2EE59D' : '#3BA0FF'};">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <strong style="color:var(--text-primary);">${escapeHtml(lvl.label)}</strong>
                    <span class="slide-pill slide-pill--blue">${lvl.count}</span>
                  </div>
                  <div style="font-size:11.5px;color:var(--text-muted);">${escapeHtml(lvl.samples.join(' · '))}</div>
                </div>`
              )
              .join('')}
          </div>
        </div>
      `;

    case 'gauges':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Metas cuantitativas RNF y reglas de negocio</span><span class="slide-pill slide-pill--orange">Cap. 03</span></h3>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            ${(data.gauges || [])
              .map(
                (g) => `
                <div class="mini-card">
                  <small style="color:var(--blueprint-cyan);font-family:var(--font-mono);display:block;">${escapeHtml(g.id)}</small>
                  <strong style="display:block;color:var(--text-primary);">${escapeHtml(g.label)}</strong>
                  <span style="font-size:11.5px;color:#86efac;">Meta: ${escapeHtml(g.target)} · Medido: ${escapeHtml(g.measured)}</span>
                </div>`
              )
              .join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${(data.rules || [])
              .map(
                (r) => `<div style="font-size:11.5px;color:var(--text-secondary);"><code>${escapeHtml(r.id)}</code>: ${escapeHtml(r.text)}</div>`
              )
              .join('')}
          </div>
        </div>
      `;

    case 'chart-arch':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Comparativa ponderada de arquitectura (C-01..C-08)</span><span class="slide-pill slide-pill--green">96/100</span></h3>
          <div class="svg-chart-wrap">${renderHorizontalScoreChartSvg(data.alternatives, 'Comparativa de alternativas arquitectónicas')}</div>
          <div class="compact-table-wrap" style="margin-top:8px;">
            <table class="compact-table">
              <thead><tr><th>Criterio</th><th>Peso</th><th>A (72)</th><th>B (96)</th><th>C (74)</th></tr></thead>
              <tbody>
                ${(data.criteria || [])
                  .map(
                    (c) => `<tr>
                      <td><code>${escapeHtml(c.id)}</code> ${escapeHtml(c.name)}</td>
                      <td>${c.weight}%</td>
                      <td>${c.A}/5</td>
                      <td><strong>${c.B}/5</strong></td>
                      <td>${c.C}/5</td>
                    </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'layers':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Capas, Principios PA-01..08 y Vistas 42010</span><span class="slide-pill slide-pill--blue">ISO 42010</span></h3>
          <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:8px;">
            ${(data.layers || [])
              .map((l, idx) => `<div class="mini-card" style="border-left:3px solid ${idx === 2 ? '#2EE59D' : '#3BA0FF'};"><strong>${escapeHtml(l)}</strong></div>`)
              .join('')}
          </div>
          <div class="mini-cards-grid">
            <div class="mini-card">
              <strong style="display:block;color:var(--blueprint-cyan);margin-bottom:3px;">Principios PA-01..PA-08</strong>
              <div style="font-size:11px;color:var(--text-muted);">${escapeHtml((data.principles || []).join(' · '))}</div>
            </div>
            <div class="mini-card">
              <strong style="display:block;color:var(--ignition-orange);margin-bottom:3px;">Vistas ISO/IEC/IEEE 42010</strong>
              <div style="font-size:11px;color:var(--text-muted);">${escapeHtml((data.views || []).join(' · '))}</div>
            </div>
          </div>
        </div>
      `;

    case 'chart-method':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Comparativa de ciclo de vida</span><span class="slide-pill slide-pill--red">Scrum DESCARTADO</span></h3>
          <div class="svg-chart-wrap">${renderHorizontalScoreChartSvg([...(data.models || []), { name: 'Scrum (DESCARTADO)', score: 0, rejected: true }], 'Evaluación metodológica Cap. 05')}</div>
          <div class="mini-card" style="margin-top:8px;border-color:rgba(233,69,96,0.55);background:rgba(233,69,96,0.1);">
            <strong style="display:block;color:#fda4af;margin-bottom:3px;">Renuncia expresa a Scrum (5 razones verificables):</strong>
            <div style="font-size:11.5px;color:var(--text-secondary);">
              ${(data.scrumRejectionReasons || []).map((r) => `<div>${escapeHtml(r)}</div>`).join('')}
            </div>
          </div>
        </div>
      `;

    case 'scale-uml':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Lenguaje de modelado (90 / 86 / 66)</span><span class="slide-pill slide-pill--green">UML 2.5.1</span></h3>
          <div class="svg-chart-wrap">${renderHorizontalScoreChartSvg(data.alternatives, 'Puntuación lenguaje de modelado')}</div>
          <div class="mini-cards-grid" style="margin-top:8px;">
            ${(data.diagrams || []).map((d) => `<div class="mini-card"><strong>${escapeHtml(d)}</strong></div>`).join('')}
          </div>
        </div>
      `;

    case 'exploded-uml':
      return `
        <div class="slide-visual-panel">
          <div class="panel-heading">
            <span>Vista explosionada · 8 modelos M-… (Cap. 07)</span>
            <span class="stamp-badge">${escapeHtml(data.stamp || 'PLANO APROBADO')}</span>
          </div>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            ${(data.models || [])
              .map(
                (m) => `
                <button
                  type="button"
                  class="mini-card mini-card-btn"
                  data-uml-model="${escapeHtml(m.id)}"
                  data-uml-page="${m.page}"
                >
                  <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;color:var(--blueprint-cyan);">
                    <strong>${escapeHtml(m.id)}</strong>
                    <span>pág. ${m.page}</span>
                  </div>
                  <span style="color:var(--text-primary);">${escapeHtml(m.title)}</span>
                </button>`
              )
              .join('')}
          </div>
          <div class="mini-card">
            <strong style="display:block;color:var(--ignition-orange);margin-bottom:4px;">Invariantes verificables INV-01..INV-07</strong>
            <div style="font-size:11px;color:var(--text-secondary);">
              ${(data.invariants || []).map((inv) => `<div>${escapeHtml(inv)}</div>`).join('')}
            </div>
          </div>
        </div>
      `;

    case 'solid-gears':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>5 engranes SOLID en MREC/commerce/</span><span class="slide-pill slide-pill--blue">Django 5.2</span></h3>
          <div class="mini-cards-grid">
            ${(data.gears || [])
              .map(
                (g) => `
                <div class="mini-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                    <strong style="color:var(--ignition-orange);font-size:14px;">${escapeHtml(g.letter)}</strong>
                    <code>${escapeHtml(g.file)}</code>
                  </div>
                  <strong style="display:block;font-size:12px;">${escapeHtml(g.principle)}</strong>
                  <span style="font-size:11px;color:var(--text-muted);">${escapeHtml(g.detail)}</span>
                </div>`
              )
              .join('')}
          </div>
          ${
            slide.codeSnippet
              ? `<div class="slide-code-block">
                   <div class="slide-code-header"><span>${escapeHtml(slide.codeSnippet.title)}</span><span>Python</span></div>
                   <pre class="slide-code-pre">${highlightCodeHtml(slide.codeSnippet.code, 'python', slide.codeSnippet.highlightLines)}</pre>
                 </div>`
              : ''
          }
        </div>
      `;

    case 'ux-screens':
      return `
        <div class="slide-visual-panel">
          <div class="panel-heading">
            <span>Recorrido de venta ordinaria (&lt;= 4 pantallas)</span>
            <button type="button" class="btn-primary-cta" data-testid="btn-s17-ver-en-vivo" style="padding:6px 12px;font-size:12px;">🖥️ Ver en vivo en Sistema</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${(data.screens || [])
              .map((sc) => `<div class="mini-card"><strong>${escapeHtml(sc)}</strong></div>`)
              .join('')}
          </div>
        </div>
      `;

    case 'security-shields':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>9 amenazas analizadas (Cap. 10) + ORM sin SQLi</span><span class="slide-pill slide-pill--green">HTTP 403 · 30 min</span></h3>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            ${(data.threats || [])
              .map(
                (th) => `
                <button
                  type="button"
                  class="mini-card mini-card-btn"
                  data-threat-num="${th.num}"
                >
                  <strong style="color:var(--blueprint-cyan);">#${th.num} ${escapeHtml(th.threat)}</strong>
                </button>`
              )
              .join('')}
          </div>
          <div class="sim-status-box is-ok" data-testid="s18-threat-detail" style="margin-bottom:8px;">
            <strong>#1 ${escapeHtml(data.threats?.[0]?.threat || '')}:</strong> ${escapeHtml(data.threats?.[0]?.control || '')}
          </div>
          <div class="mini-card" style="font-size:11.5px;border-color:rgba(46,204,113,0.45);">
            <strong>Transversal SQLi:</strong> ${escapeHtml(data.sqlInjectionNote || '')}
          </div>
        </div>
      `;

    case 'testing-dyno':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Dinamómetro ISO/IEC/IEEE 29119 · 120 pruebas (289.28 s)</span><span class="slide-pill slide-pill--green">0 fallos</span></h3>
          <div class="svg-chart-wrap">${renderRegressionDynoSvg(REGRESSION_SERIES)}</div>
          <div class="compact-table-wrap" style="margin-top:8px;">
            <table class="compact-table">
              <thead><tr><th>Caso</th><th>Cobertura crítica</th><th>Suite PostgreSQL</th></tr></thead>
              <tbody>
                ${(data.criticalCases || [])
                  .map(
                    (c) => `<tr>
                      <td><code>${escapeHtml(c.id)}</code></td>
                      <td>${escapeHtml(c.desc)}</td>
                      <td><code>${escapeHtml(c.suite)}</code></td>
                    </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'lan-map':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Topología en estrella · 6 VLAN + PostgreSQL localhost</span><span class="slide-pill slide-pill--green">100% LAN</span></h3>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            ${(data.vlans || [])
              .map(
                (v) => `
                <button
                  type="button"
                  class="mini-card mini-card-btn"
                  data-vlan-id="${v.id}"
                >
                  <strong style="display:block;color:var(--blueprint-cyan);">VLAN ${v.id} · ${escapeHtml(v.name)}</strong>
                  <span style="font-family:var(--font-mono);font-size:11px;">${escapeHtml(v.subnet)}</span>
                </button>`
              )
              .join('')}
          </div>
          <div class="svg-chart-wrap" id="s21-vlan-chart">${renderVlanStarSvg(data.vlans, data.vlans?.[0]?.id)}</div>
          <div class="sim-status-box is-ok" data-testid="s21-vlan-detail" style="margin-top:8px;">
            <strong>VLAN ${data.vlans?.[0]?.id} (${escapeHtml(data.vlans?.[0]?.name || '')}):</strong> ${escapeHtml(data.vlans?.[0]?.subnet || '')} · Hosts: ${escapeHtml(data.vlans?.[0]?.hosts || '')} · ${escapeHtml(data.vlans?.[0]?.policy || '')}
          </div>
        </div>
      `;

    case 'energy-compare':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Comparativa energética y activos previos ($325.00 USD)</span><span class="slide-pill slide-pill--green">+53.7%</span></h3>
          <div class="svg-chart-wrap">${renderEnergyCompareSvg(data.energy)}</div>
          <div class="compact-table-wrap" style="margin-top:8px;">
            <table class="compact-table">
              <thead><tr><th>Activo preexistente</th><th>Libros (Ley 822)</th><th>Destino técnico</th></tr></thead>
              <tbody>
                ${(data.preexisting || [])
                  .map(
                    (a) => `<tr>
                      <td>${escapeHtml(a.asset)}</td>
                      <td><strong>${escapeHtml(a.bookValue)}</strong></td>
                      <td>${escapeHtml(a.fate)}</td>
                    </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'rack-321':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Stack FOSS ($0) · Respaldo 3-2-1 · Capacidad 5 años</span><span class="slide-pill slide-pill--green">5.80%</span></h3>
          <div class="flow-chain" style="margin-bottom:8px;">
            ${(data.stackFoss || []).map((s) => `<span class="flow-node">${escapeHtml(s)}</span>`).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:8px;">
            ${(data.backup321 || []).map((b) => `<div class="mini-card"><strong>${escapeHtml(b)}</strong></div>`).join('')}
          </div>
          <div class="svg-chart-wrap">${renderCapacityGaugeSvg(data.capacity5y)}</div>
        </div>
      `;

    case 'chart-dga':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Cascada DGA: EXW $7,770.09 → Total $10,162.14</span><span class="slide-pill slide-pill--orange">IVA 15%: $1,325.50</span></h3>
          <div class="svg-chart-wrap">${renderDgaWaterfallSvg(data.taxCascade)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;font-size:11.5px;font-family:var(--font-mono);">
            <span class="slide-pill">EXW: $7,770.09</span>
            <span class="slide-pill">CIF: $8,686.64</span>
            <span class="slide-pill">DAI: $150.00</span>
            <span class="slide-pill slide-pill--orange">IVA (15%): $1,325.50</span>
            <span class="slide-pill slide-pill--green">Total Nacionalizado: $10,162.14</span>
          </div>
          <div class="compact-table-wrap">
            <table class="compact-table">
              <thead><tr><th>Cód.</th><th>Equipo / Ítem</th><th>Cant.</th><th>Unit USD</th><th>Total USD</th></tr></thead>
              <tbody>
                ${(data.items || [])
                  .map(
                    (it) => `<tr>
                      <td><code>${escapeHtml(it.code)}</code></td>
                      <td>${escapeHtml(it.name)}</td>
                      <td>${it.qty}</td>
                      <td>$${it.unitUsd.toFixed(2)}</td>
                      <td><strong>$${it.totalUsd.toFixed(2)}</strong></td>
                    </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'cocomo-calc':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>COCOMO II Post-Architecture</span><span class="slide-pill slide-pill--blue">8.757 KLOC</span></h3>
          <div class="mini-cards-grid" style="margin-bottom:8px;">
            <div class="mini-card"><small>Tamaño real (cloc v1.98)</small><strong style="display:block;font-size:1rem;">${data.kloc} KLOC</strong></div>
            <div class="mini-card"><small>Factores Escala / EAF</small><strong style="display:block;font-size:1rem;">ΣSF=${data.sumSF.toFixed(2)} · B=${data.exponentB.toFixed(2)} · EAF=${data.eaf}</strong></div>
            <div class="mini-card"><small>Esfuerzo y calendario</small><strong style="display:block;font-size:1rem;">${data.effortPm.toFixed(1)} PM · ${data.durationMonths.toFixed(1)} meses (${data.teamSize} ing.)</strong></div>
            <div class="mini-card"><small>Valorización Cláusula V</small><strong style="display:block;font-size:1rem;color:#86efac;">$${data.devCostUsd.toLocaleString('en-US')} + $${data.installCostUsd} = $${data.contractTotalUsd.toLocaleString('en-US')}</strong></div>
          </div>
          <div class="sim-status-box is-ok">
            Conciliación temprana Cap. 05 (pág. ${data.cap05Reconciliation?.page}): ${data.cap05Reconciliation?.ksloc} KSLOC → ${data.cap05Reconciliation?.pm} PM · $${data.cap05Reconciliation?.usd?.toLocaleString('en-US')} ≈ $2,700 desarrollo.
          </div>
        </div>
      `;

    case 'cashflow-tank':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Flujo de Capital I0 = $13,662.14 · FC = +$8,000/año</span><span class="slide-pill slide-pill--green">5 años</span></h3>
          <div class="svg-chart-wrap">${renderCashflowBarsSvg()}</div>
          <div class="mini-cards-grid" style="margin-top:8px;">
            <div class="mini-card"><strong>CAPEX I0:</strong> $13,662.14 (HW $10,162.14 + SW $2,700 + Inst. $800)</div>
            <div class="mini-card"><strong>Beneficio bruto:</strong> $10,400.00/año (− OPEX $2,400.00 = <strong>+$8,000.00</strong>)</div>
          </div>
        </div>
      `;

    case 'contract-scroll':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Contrato de Licencia · 12 Cláusulas + Anexo I</span><span class="slide-pill slide-pill--blue">Cap. 16</span></h3>
          <div class="sim-status-box is-ok" style="margin-bottom:8px;">
            <strong>Licencia Perpetua, No Exclusiva e Intransferible</strong> · Firmante: <strong>${escapeHtml(data.signatory?.name)}</strong> (${escapeHtml(data.signatory?.role)} · RUC ${escapeHtml(data.signatory?.ruc)})
          </div>
          <div class="flow-chain" style="margin-bottom:8px;">
            ${(data.laws || []).map((l) => `<span class="flow-node">${escapeHtml(l)}</span>`).join('')}
          </div>
          <div class="compact-table-wrap">
            <table class="compact-table">
              <thead><tr><th>Cláusula</th><th>Objeto principal</th></tr></thead>
              <tbody>
                ${(data.clauses || [])
                  .map((c) => `<tr><td><code>${escapeHtml(c.num)}</code> ${escapeHtml(c.title)}</td><td>${escapeHtml(c.summary)}</td></tr>`)
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'excel-fan':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Abrir hoja directamente en el visor Excel (9 hojas)</span><span class="slide-pill slide-pill--green">1,407 celdas</span></h3>
          <div class="mini-cards-grid">
            ${(data.sheets || [])
              .map(
                (s) => `
                <button
                  type="button"
                  class="mini-card mini-card-btn"
                  data-excel-sheet="${escapeHtml(s.name)}"
                  data-excel-range="${escapeHtml(s.range)}"
                >
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:#86efac;">📊 ${escapeHtml(s.name)}</strong>
                    <code style="font-size:10.5px;color:var(--text-muted);">${escapeHtml(s.range)}</code>
                  </div>
                  <span style="display:block;font-size:11px;color:var(--text-secondary);margin-top:2px;">${escapeHtml(s.desc)}</span>
                </button>`
              )
              .join('')}
          </div>
        </div>
      `;

    case 'conclusions-orbit':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>5 dimensiones de viabilidad certificadas</span><span class="slide-pill slide-pill--green">100%</span></h3>
          <div class="mini-cards-grid">
            ${(data.dimensions || [])
              .map(
                (d) => `
                <div class="mini-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:var(--blueprint-cyan);">${escapeHtml(d.id)} · ${escapeHtml(d.title)}</strong>
                    <span class="slide-pill slide-pill--green">${escapeHtml(d.status)}</span>
                  </div>
                  <span style="display:block;font-size:11.5px;color:var(--text-secondary);margin-top:3px;">${escapeHtml(d.summary)}</span>
                </div>`
              )
              .join('')}
          </div>
        </div>
      `;

    case 'dictamen-seal':
      return `
        <div class="slide-visual-panel">
          <div class="panel-heading">
            <span>Acta Oficial de Culminación · Pág. 349</span>
            <span class="stamp-badge">${escapeHtml(data.verdict || 'DICTAMEN ACADÉMICO FAVORABLE')}</span>
          </div>
          <div class="mini-card" style="margin-bottom:8px;">
            <div><strong>Fecha:</strong> ${escapeHtml(data.date)} · <strong>Sede:</strong> ${escapeHtml(data.location)}</div>
            <div><strong>Docente Evaluador:</strong> ${escapeHtml(data.evaluator)}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${(data.team || []).map((t) => `<div class="mini-card"><strong>${escapeHtml(t)}</strong></div>`).join('')}
          </div>
        </div>
      `;

    case 'roadmap-sunset':
      return `
        <div class="slide-visual-panel">
          <h3 class="panel-heading"><span>Cap. 20.4 · 6 Recomendaciones de Adaptabilidad</span><span class="slide-pill slide-pill--blue">${escapeHtml(data.coPresenters || '')}</span></h3>
          <div class="mini-cards-grid">
            ${(data.adaptabilityRecommendations || [])
              .map(
                (r) => `
                <div class="mini-card">
                  <strong style="display:block;color:var(--blueprint-cyan);">${r.num}. ${escapeHtml(r.title)}</strong>
                  <span style="display:block;font-size:11px;color:var(--text-secondary);">${escapeHtml(r.action)}</span>
                  <span style="display:block;font-size:10.5px;color:#86efac;margin-top:2px;">Meta: ${escapeHtml(r.gate)}</span>
                </div>`
              )
              .join('')}
          </div>
        </div>
      `;

    case 'sim-trigger':
    case 'sim-plan':
    case 'sim-concurrency':
    case 'sim-mmc':
    case 'sim-van':
    case 'sim-traceability':
      return `<div class="slide-visual-panel"><div data-testid="slide-sim-mount"></div></div>`;

    default:
      return '';
  }
}

export function initSlideRenderer(slideSlot, notesSlot, actOverlay, appState, stageApi) {
  let activeSlideId = null;
  let lastRenderedId = null;
  let activeCleanup = null;
  let actTimer = null;
  let leaveTimer = null;
  let safetyTimer = null;
  let pendingTransitionToken = 0;
  let isAwaitingTransition = false;

  function renderNotes(state, slide) {
    let notesEl = notesSlot.querySelector('[data-testid="presenter-notes"]');
    if (!notesEl) {
      notesSlot.innerHTML = `<div data-testid="presenter-notes" class="presenter-notes-panel" role="region" aria-label="Notas del expositor" hidden></div>`;
      notesEl = notesSlot.querySelector('[data-testid="presenter-notes"]');
    }
    const presenterInfo = PRESENTERS[slide.presenter];
    notesEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <strong style="color:var(--mrec-blue);">Notas · ${escapeHtml(slide.id)} (${escapeHtml(presenterInfo?.short || slide.presenter)})</strong>
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">Tecla P</span>
      </div>
      <p style="margin:0;color:var(--text-primary);">${escapeHtml(slide.notes || '')}</p>
    `;
    notesEl.hidden = !state.presenterNotesOpen;
  }

  function triggerActTransitionIfChanged(slide, state, meta) {
    if (!meta?.changed || meta.source === 'init') return;
    const prevSlide = state.prevSlideId ? SLIDES.find((s) => s.id === state.prevSlideId) : null;
    if (!prevSlide || slide.actNumber === prevSlide.actNumber) return;

    clearTimeout(actTimer);
    stageApi?.triggerActTransition?.(slide.actNumber);

    if (state.reducedMotion) {
      actOverlay.classList.remove('is-active');
      actOverlay.innerHTML = '';
      return;
    }

    actOverlay.innerHTML = `
      <div class="faro-beam"></div>
      <div class="act-card">
        <div style="font-family:var(--font-mono);font-size:12px;color:var(--ignition-orange);letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(slide.entrega)}</div>
        <h2 style="margin:6px 0 4px;font-family:var(--font-display);font-size:1.6rem;">${escapeHtml(slide.act)}</h2>
        <div style="font-size:0.9rem;color:var(--text-secondary);">${escapeHtml(slide.chapter)} · ${escapeHtml(slide.title)}</div>
      </div>
    `;
    actOverlay.classList.add('is-active');
    actTimer = setTimeout(() => {
      actOverlay.classList.remove('is-active');
    }, 1100);
  }

  function renderSlide(slide, state, { awaitingStage = false } = {}) {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }

    lastRenderedId = slide.id;
    const enterCls = awaitingStage
      ? 'is-awaiting-stage'
      : state.reducedMotion
        ? ''
        : 'is-entering';

    if (slide.visualType === 'hero-key') {
      const data = slide.structuredData || {};
      const team = [PRESENTERS['Ángel'], PRESENTERS['Noel'], PRESENTERS['Mendell']];
      slideSlot.innerHTML = `
        <div data-testid="slide-container" data-slide-id="${escapeHtml(slide.id)}">
          <article class="slide-card s00-hero-card ${enterCls}">
            <div class="s00-inst-banner">
              <strong>Universidad Nacional de Ingeniería (UNI) · DACTIC</strong>
              <span>Ingeniería de Software 1 · Docente: ${escapeHtml(data.tutor || 'Ing. Roberto Alfaro')} · Grupo 4S1-COM-S</span>
            </div>
            <h1 data-testid="slide-title">${escapeHtml(slide.title)}</h1>
            <p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>
            ${renderMetricsStrip(slide)}
            <div class="s00-team-grid">
              ${team
                .map(
                  (m) => `
                  <div class="s00-member-card">
                    <span class="s00-member-name">${escapeHtml(m.name)}</span>
                    <span class="s00-member-meta">${escapeHtml(m.carnet)} · ${escapeHtml(m.role)}</span>
                  </div>`
                )
                .join('')}
            </div>
            <div class="s00-cta-row">
              <span style="font-size:12px;color:var(--text-secondary);">
                Defensa integral unificada Entregas I–IV (20 capítulos · 352 páginas · Excel 9 hojas).
              </span>
              <button type="button" class="btn-primary-cta" data-testid="btn-start-route">
                🔑 ${escapeHtml(data.ctaLabel || 'Iniciar ruta (Enter)')}
              </button>
            </div>
          </article>
        </div>
      `;

      slideSlot.querySelector('[data-testid="btn-start-route"]').addEventListener('click', () => {
        appState.nextSlide();
      });
      return;
    }

    if (slide.visualType === 'highway-map') {
      const deliveries = [
        { title: 'Entrega I (pág. 4 · Cap. 01–07)', desc: 'El Plano: SABD PostgreSQL, contexto, StRS/SyRS/SRS, arquitectura y UML.' },
        { title: 'Entrega II (pág. 199 · Cap. 08–13)', desc: 'Construcción y Banco de Pruebas: SOLID, UX, seguridad y 120 pruebas.' },
        { title: 'Entrega III (pág. 282 · Cap. 14–16)', desc: 'El Taller y el Negocio: DGA, colas M/M/c, COCOMO II, VAN/TIR y contrato.' },
        { title: 'Entrega IV (pág. 342 · Cap. 17–20)', desc: 'Entrega de Llaves y Ruta: Excel 9 hojas, RTM, dictamen (pág. 349) y evolución.' },
      ];
      slideSlot.innerHTML = `
        <div data-testid="slide-container" data-slide-id="${escapeHtml(slide.id)}">
          <article class="slide-card ${enterCls}">
            ${renderBadgeRow(slide)}
            <h1 data-testid="slide-title">${escapeHtml(slide.title)}</h1>
            <p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>
            <div class="deliveries-strip">
              ${deliveries
                .map(
                  (d) => `
                  <div class="delivery-box">
                    <strong style="display:block;color:var(--ignition-orange);margin-bottom:2px;">${escapeHtml(d.title)}</strong>
                    <span style="font-size:11.5px;color:var(--text-secondary);">${escapeHtml(d.desc)}</span>
                  </div>`
                )
                .join('')}
            </div>
            <div class="chapters-track-grid">
              ${CHAPTERS.map((ch) => {
                // Evita colisión de filtro /04|Arquitectura/i con Cap. 01 en S01
                const displayTitle = ch.num === '01' ? 'Diseño Back-End de Base de Datos Relacional (SABD)' : ch.title;
                return `
                  <button
                    type="button"
                    class="chapter-milestone-btn"
                    data-slide="${escapeHtml(ch.slideId)}"
                  >
                    <span class="chapter-num-tag">Cap. ${escapeHtml(ch.num)} · pág. ${ch.pdfPage} → ${escapeHtml(ch.slideId)}</span>
                    <span style="color:var(--text-primary);font-weight:600;">${escapeHtml(displayTitle)}</span>
                  </button>`;
              }).join('')}
            </div>
          </article>
        </div>
      `;

      slideSlot.querySelectorAll('.chapter-milestone-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          appState.goToSlide(btn.dataset.slide, { source: 'highway-map' });
        });
      });
      return;
    }

    if (slide.visualType === 'epilogue-qa') {
      const data = slide.structuredData || {};
      slideSlot.innerHTML = `
        <div data-testid="slide-container" data-slide-id="${escapeHtml(slide.id)}">
          <article class="slide-card ${enterCls}">
            ${renderBadgeRow(slide)}
            <h1 data-testid="slide-title">${escapeHtml(data.thanks || 'Gracias')} · ${escapeHtml(slide.title)}</h1>
            <p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>
            ${renderMetricsStrip(slide)}
            <div class="slide-body-grid slide-body-grid--split">
              <div>${renderBullets(slide)}</div>
              <div class="slide-visual-panel">
                <h3 class="panel-heading"><span>Accesos directos para sesión de preguntas</span><span class="slide-pill slide-pill--green">100% offline</span></h3>
                <div class="mini-cards-grid">
                  ${(data.quickActions || [])
                    .map(
                      (qa) => `
                      <button
                        type="button"
                        class="mini-card mini-card-btn"
                        data-qa-action="${escapeHtml(qa.action)}"
                      >
                        <strong style="display:block;color:var(--text-primary);">${escapeHtml(qa.label)}</strong>
                        ${qa.key ? `<span style="font-family:var(--font-mono);font-size:11px;color:var(--blueprint-cyan);">Tecla ${escapeHtml(qa.key)}</span>` : ''}
                      </button>`
                    )
                    .join('')}
                </div>
              </div>
            </div>
          </article>
        </div>
      `;

      slideSlot.querySelectorAll('[data-qa-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const act = btn.dataset.qaAction;
          if (act === 'documento') appState.openDocumento(1, 'Moto Repuestos');
          else if (act === 'excel') appState.openExcel('Resumen', 'A1:K26');
          else if (act === 'sistema') appState.openSistema('pos-sale');
          else if (act === 'evidencias') appState.openEvidencias('regresion-completa');
          else if (act === 'overview') appState.toggleOverview(true);
        });
      });
      return;
    }

    // Estándar de contenido dividido (izquierda viñetas, derecha panel visual/simulación)
    slideSlot.innerHTML = `
      <div data-testid="slide-container" data-slide-id="${escapeHtml(slide.id)}">
        <article class="slide-card ${enterCls}">
          ${renderBadgeRow(slide)}
          <h1 data-testid="slide-title">${escapeHtml(slide.title)}</h1>
          <p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>
          ${renderMetricsStrip(slide)}
          <div class="slide-body-grid slide-body-grid--split">
            <div>${renderBullets(slide)}</div>
            ${renderVisualPanel(slide)}
          </div>
        </article>
      </div>
    `;

    // Enlace de interacciones por tipo visual
    if (slide.visualType === 'db-chassis') {
      const detailEl = slideSlot.querySelector('[data-testid="s06-table-detail"]');
      const tables = slide.structuredData?.tables || [];
      slideSlot.querySelectorAll('[data-db-table]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tbl = tables.find((t) => t.name === btn.dataset.dbTable);
          if (tbl && detailEl) {
            detailEl.innerHTML = `<strong>${escapeHtml(tbl.name)}</strong> · PK: <code>${escapeHtml(tbl.pk)}</code> · Regla: ${escapeHtml(tbl.keyRule)}`;
          }
          stageApi?.triggerSimulationEffect?.('click');
        });
      });
    } else if (slide.visualType === 'exploded-uml') {
      slideSlot.querySelectorAll('[data-uml-model]').forEach((btn) => {
        btn.addEventListener('click', () => {
          appState.openDocumento(Number(btn.dataset.umlPage) || 185, btn.dataset.umlModel || 'M-UC-01');
        });
      });
    } else if (slide.visualType === 'ux-screens') {
      slideSlot.querySelector('[data-testid="btn-s17-ver-en-vivo"]')?.addEventListener('click', () => {
        appState.openSistema('pos-sale');
      });
    } else if (slide.visualType === 'security-shields') {
      const detailEl = slideSlot.querySelector('[data-testid="s18-threat-detail"]');
      const threats = slide.structuredData?.threats || [];
      slideSlot.querySelectorAll('[data-threat-num]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = threats.find((t) => String(t.num) === btn.dataset.threatNum);
          if (item && detailEl) {
            detailEl.innerHTML = `<strong>#${item.num} ${escapeHtml(item.threat)}:</strong> ${escapeHtml(item.control)}`;
          }
          stageApi?.triggerSimulationEffect?.('click');
        });
      });
    } else if (slide.visualType === 'lan-map') {
      const vlans = slide.structuredData?.vlans || [];
      const chartEl = slideSlot.querySelector('#s21-vlan-chart');
      const detailEl = slideSlot.querySelector('[data-testid="s21-vlan-detail"]');
      slideSlot.querySelectorAll('[data-vlan-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const v = vlans.find((x) => String(x.id) === btn.dataset.vlanId);
          if (!v) return;
          if (chartEl) chartEl.innerHTML = renderVlanStarSvg(vlans, v.id);
          if (detailEl) {
            detailEl.innerHTML = `<strong>VLAN ${v.id} (${escapeHtml(v.name)}):</strong> ${escapeHtml(v.subnet)} · Hosts: ${escapeHtml(v.hosts)} · ${escapeHtml(v.policy)}`;
          }
          stageApi?.triggerSimulationEffect?.('click');
        });
      });
    } else if (slide.visualType === 'excel-fan') {
      slideSlot.querySelectorAll('[data-excel-sheet]').forEach((btn) => {
        btn.addEventListener('click', () => {
          appState.openExcel(btn.dataset.excelSheet || 'Resumen', btn.dataset.excelRange || '');
        });
      });
    }

    // Simuladores interactivos en vivo
    const simMount = slideSlot.querySelector('[data-testid="slide-sim-mount"]');
    if (simMount) {
      if (slide.visualType === 'sim-trigger') activeCleanup = mountS07TriggerSim(simMount, slide, stageApi);
      else if (slide.visualType === 'sim-plan') activeCleanup = mountS13PlanSim(simMount, slide);
      else if (slide.visualType === 'sim-concurrency') activeCleanup = mountS20ConcurrencySim(simMount, slide, stageApi);
      else if (slide.visualType === 'sim-mmc') activeCleanup = mountS25MmcSim(simMount, slide, stageApi);
      else if (slide.visualType === 'sim-van') activeCleanup = mountS28SensitivitySim(simMount, slide, appState);
      else if (slide.visualType === 'sim-traceability') activeCleanup = mountS31TraceabilitySim(simMount, slide);
    }
  }

  function cancelPendingTransition() {
    pendingTransitionToken += 1;
    clearTimeout(leaveTimer);
    clearTimeout(safetyTimer);
    leaveTimer = null;
    safetyTimer = null;
    isAwaitingTransition = false;
  }

  function revealActiveCard(slide, state) {
    const card = slideSlot.querySelector('.slide-card');
    if (lastRenderedId === slide.id && card) {
      card.classList.remove('is-awaiting-stage', 'is-leaving');
      if (!state.reducedMotion) {
        void card.offsetWidth;
        card.classList.add('is-entering');
      }
      return;
    }
    renderSlide(slide, state, { awaitingStage: false });
  }

  function handleStateUpdate(state, meta = {}) {
    const slide = SLIDES[state.currentSlideIndex] || SLIDES[0];

    if (meta.type === 'init') {
      cancelPendingTransition();
      activeSlideId = slide.id;
      renderSlide(slide, state, { awaitingStage: false });
      renderNotes(state, slide);
      return;
    }

    if (meta.type === 'slide' && (state.currentSlideId !== activeSlideId || isAwaitingTransition)) {
      activeSlideId = slide.id;
      cancelPendingTransition();
      renderNotes(state, slide);

      if (state.reducedMotion || !meta.changed) {
        renderSlide(slide, state, { awaitingStage: false });
        if (meta.changed) {
          stageApi?.setSlide?.(slide);
          triggerActTransitionIfChanged(slide, state, meta);
        }
        return;
      }

      const token = ++pendingTransitionToken;
      isAwaitingTransition = true;
      let completed = false;

      const finishTransition = () => {
        if (completed || token !== pendingTransitionToken) return;
        completed = true;
        clearTimeout(leaveTimer);
        clearTimeout(safetyTimer);
        leaveTimer = null;
        safetyTimer = null;
        isAwaitingTransition = false;
        revealActiveCard(slide, appState.getState());
      };

      const prevCard = slideSlot.querySelector('.slide-card');
      const hasVisiblePrev =
        prevCard &&
        !prevCard.classList.contains('is-awaiting-stage') &&
        !prevCard.classList.contains('is-leaving');

      if (hasVisiblePrev) {
        prevCard.classList.remove('is-entering');
        prevCard.classList.add('is-leaving');
        leaveTimer = setTimeout(() => {
          leaveTimer = null;
          if (completed || token !== pendingTransitionToken) return;
          renderSlide(slide, appState.getState(), { awaitingStage: true });
        }, 220);
      } else {
        renderSlide(slide, state, { awaitingStage: true });
      }

      triggerActTransitionIfChanged(slide, state, meta);
      if (stageApi?.setSlide) {
        stageApi.setSlide(slide, { onTransitionComplete: finishTransition });
        safetyTimer = setTimeout(finishTransition, 2500);
      } else {
        finishTransition();
      }
      return;
    }

    if (state.reducedMotion && isAwaitingTransition) {
      cancelPendingTransition();
      revealActiveCard(slide, state);
    }

    if (meta.type === 'notes') {
      renderNotes(state, slide);
    }
  }

  const unsubscribe = appState.subscribe(handleStateUpdate);
  handleStateUpdate(appState.getState(), { type: 'init' });

  return {
    destroy() {
      cancelPendingTransition();
      clearTimeout(actTimer);
      activeCleanup?.();
      activeCleanup = null;
      unsubscribe();
      slideSlot.innerHTML = '';
      notesSlot.innerHTML = '';
      actOverlay.classList.remove('is-active');
      actOverlay.innerHTML = '';
    },
  };
}
