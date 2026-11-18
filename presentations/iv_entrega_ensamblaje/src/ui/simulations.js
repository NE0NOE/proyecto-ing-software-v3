import {
  calculateAnnuityVan,
  escapeHtml,
  highlightCodeHtml,
  renderCashflowBarsSvg,
  renderKatexHtml,
  renderMmcCompareSvg,
  renderVanSensitivitySvg,
} from './charts.js';

export const simState = {
  s07Stock: 3,
  s07Status: 'En espera: stock inicial 3 unidades (Pistón 150cc). Listo para probar tr_deducirstock_venta.',
  s07Tone: 'neutral',
  s13Tab: 'wbs',
  s20Stock: 1,
  s20Result: 'Presione "Simular Carrera (2 Cajas × 1 Unidad)" para competir simultáneamente por la última unidad.',
  s20Tone: 'neutral',
  s20RaceCount: 0,
  s25Servers: 2,
  s28Scenario: 'base',
  s28TmarPct: 12,
  s31SelectedId: 'RF-01',
};

export function resetAllSimState() {
  simState.s07Stock = 3;
  simState.s07Status = 'En espera: stock inicial 3 unidades (Pistón 150cc). Listo para probar tr_deducirstock_venta.';
  simState.s07Tone = 'neutral';
  simState.s13Tab = 'wbs';
  simState.s20Stock = 1;
  simState.s20Result = 'Presione "Simular Carrera (2 Cajas × 1 Unidad)" para competir simultáneamente por la última unidad.';
  simState.s20Tone = 'neutral';
  simState.s20RaceCount = 0;
  simState.s25Servers = 2;
  simState.s28Scenario = 'base';
  simState.s28TmarPct = 12;
  simState.s31SelectedId = 'RF-01';
}

export function formatUsd(num) {
  const n = Number(num) || 0;
  const absFormatted = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return n < 0 ? `-$${absFormatted} USD` : `$${absFormatted} USD`;
}

export function mountS07TriggerSim(container, slide, stageApi) {
  const structured = slide.structuredData || {};
  container.innerHTML = `
    <div class="sim-box">
      <div class="panel-heading">
        <span>Disparador PL/pgSQL en vivo · Pistón 150cc</span>
        <span class="slide-pill slide-pill--blue">PostgreSQL FOR UPDATE</span>
      </div>
      <div class="sim-kpi-grid">
        <div class="sim-kpi-card">
          <small>Stock disponible en PostgreSQL</small>
          <strong data-testid="sim-s07-stock">${simState.s07Stock}</strong>
        </div>
        <div class="sim-kpi-card">
          <small>Consultas / Vistas / SP</small>
          <strong>15 consultas · 3 vistas · 2 SP</strong>
        </div>
      </div>
      <div class="sim-controls-row">
        <button type="button" class="sim-btn sim-btn--success" data-testid="sim-s07-sell-1">Vender 1 unidad</button>
        <button type="button" class="sim-btn sim-btn--danger" data-testid="sim-s07-sell-5">Vender 5 unidades</button>
        <button type="button" class="sim-btn" data-testid="sim-s07-reset">Restablecer (3)</button>
      </div>
      <div class="sim-status-box ${simState.s07Tone === 'ok' ? 'is-ok' : simState.s07Tone === 'err' ? 'is-err' : ''}" data-testid="sim-s07-status">${escapeHtml(simState.s07Status)}</div>
      <div class="mini-cards-grid">
        <div class="mini-card"><strong>Seguridad DCL:</strong> <code>rol_administrador</code> (admin_user) y <code>rol_vendedor</code> (venta_user)</div>
        <div class="mini-card"><strong>Vistas / SP:</strong> ${(structured.views || []).join(', ')} · ${(structured.storedProcedures || []).join(', ')}</div>
      </div>
      ${
        slide.codeSnippet
          ? `<div class="slide-code-block">
               <div class="slide-code-header"><span>${escapeHtml(slide.codeSnippet.title)}</span><span>PL/pgSQL</span></div>
               <pre class="slide-code-pre">${highlightCodeHtml(slide.codeSnippet.code, 'sql', slide.codeSnippet.highlightLines)}</pre>
             </div>`
          : ''
      }
    </div>
  `;

  const stockEl = container.querySelector('[data-testid="sim-s07-stock"]');
  const statusEl = container.querySelector('[data-testid="sim-s07-status"]');

  const syncUi = () => {
    stockEl.textContent = String(simState.s07Stock);
    statusEl.textContent = simState.s07Status;
    statusEl.classList.toggle('is-ok', simState.s07Tone === 'ok');
    statusEl.classList.toggle('is-err', simState.s07Tone === 'err');
  };

  container.querySelector('[data-testid="sim-s07-sell-1"]').addEventListener('click', () => {
    if (simState.s07Stock >= 1) {
      simState.s07Stock -= 1;
      simState.s07Status = `OK tr_deducirstock_venta: deducida 1 unidad. Nuevo stock: ${simState.s07Stock}.`;
      simState.s07Tone = 'ok';
      stageApi?.triggerSimulationEffect?.('trigger-ok');
    } else {
      simState.s07Status = `RAISE EXCEPTION (ERRCODE = 45000): Existencias insuficientes (stock = 0). Operación bloqueada, saldo protegido en 0.`;
      simState.s07Tone = 'err';
      stageApi?.triggerSimulationEffect?.('trigger-error');
    }
    syncUi();
  });

  container.querySelector('[data-testid="sim-s07-sell-5"]').addEventListener('click', () => {
    if (simState.s07Stock >= 5) {
      simState.s07Stock -= 5;
      simState.s07Status = `OK tr_deducirstock_venta: deducidas 5 unidades. Nuevo stock: ${simState.s07Stock}.`;
      simState.s07Tone = 'ok';
      stageApi?.triggerSimulationEffect?.('trigger-ok');
    } else {
      simState.s07Status = `RAISE EXCEPTION (ERRCODE = 45000): "Error: Existencias insuficientes en Moto Repuestos El Centenario". Saldo conservado en ${simState.s07Stock}.`;
      simState.s07Tone = 'err';
      stageApi?.triggerSimulationEffect?.('trigger-error');
    }
    syncUi();
  });

  container.querySelector('[data-testid="sim-s07-reset"]').addEventListener('click', () => {
    simState.s07Stock = structured.initialStock ?? 3;
    simState.s07Status = 'Stock restablecido a 3 unidades en PostgreSQL.';
    simState.s07Tone = 'neutral';
    stageApi?.triggerSimulationEffect?.('click');
    syncUi();
  });

  return () => {};
}

export function mountS13PlanSim(container, slide) {
  const data = slide.structuredData || {};

  const renderPanelContent = (tab) => {
    if (tab === 'wbs') {
      return `
        <div class="compact-table-wrap">
          <table class="compact-table">
            <thead><tr><th>Código</th><th>Paquete WBS (12 semanas)</th><th>Requisitos</th></tr></thead>
            <tbody>
              ${(data.wbs || [])
                .map((w) => `<tr><td><code>${escapeHtml(w.code)}</code></td><td>${escapeHtml(w.name)}</td><td>${escapeHtml(w.reqs)}</td></tr>`)
                .join('')}
            </tbody>
          </table>
        </div>`;
    }
    if (tab === 'cpm') {
      return `
        <div style="font-size:12px;margin-bottom:6px;color:#cbd5e1;">Ruta crítica CPM: <strong>60 días hábiles</strong> · 14 actividades (A–N) · <strong>Holgura total = 2 días</strong> únicamente en <code>D</code> y <code>M</code>.</div>
        <div class="compact-table-wrap">
          <table class="compact-table">
            <thead><tr><th>Act.</th><th>Descripción</th><th>Dur.</th><th>ES–EF</th><th>LS–LF</th><th>Holgura</th></tr></thead>
            <tbody>
              ${(data.cpm || [])
                .map(
                  (c) => `<tr style="${c.critical ? '' : 'background:rgba(59,160,255,0.12);'}">
                    <td><strong>${escapeHtml(c.act)}</strong></td>
                    <td>${escapeHtml(c.desc)}</td>
                    <td>${c.d} d</td>
                    <td>${c.es}–${c.ef}</td>
                    <td>${c.ls}–${c.lf}</td>
                    <td><strong>${c.ht}</strong>${c.critical ? ' (crítica)' : ' días holgura'}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>`;
    }
    if (tab === 'gantt') {
      return `
        <div style="font-size:12px;margin-bottom:6px;color:#cbd5e1;">Cronograma maestro en <strong>12 semanas</strong> · 4 incrementos verticales con compuertas G0..G3.</div>
        <div style="display:flex;flex-direction:column;gap:7px;">
          ${(data.gantt || [])
            .map((g) => {
              const leftPct = Math.round(((g.start - 1) / 12) * 100);
              const widthPct = Math.max(8, Math.round(((g.end - g.start + 1) / 12) * 100));
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:3px;">
                    <span>${escapeHtml(g.label)} (S${g.start}–S${g.end})</span>
                    <span style="color:#86efac;font-family:var(--font-mono);">${escapeHtml(g.gate)}</span>
                  </div>
                  <div style="height:14px;background:#090d16;border-radius:6px;position:relative;border:1px solid rgba(59,160,255,0.22);">
                    <div style="position:absolute;left:${leftPct}%;width:${widthPct}%;top:1px;bottom:1px;border-radius:5px;background:linear-gradient(90deg,#3BA0FF,#2EE59D);"></div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>`;
    }
    return `
      <div class="compact-table-wrap">
        <table class="compact-table">
          <thead><tr><th>WBS</th><th>Entregable clave</th><th>AAA</th><th>NIA</th><th>MNP</th><th>CLI</th><th>DOC</th></tr></thead>
          <tbody>
            ${(data.raci || [])
              .map(
                (r) => `<tr>
                  <td><code>${escapeHtml(r.wbs)}</code></td>
                  <td>${escapeHtml(r.task)}</td>
                  <td><strong>${escapeHtml(r.AAA)}</strong></td>
                  <td><strong>${escapeHtml(r.NIA)}</strong></td>
                  <td><strong>${escapeHtml(r.MNP)}</strong></td>
                  <td>${escapeHtml(r.CLI)}</td>
                  <td>${escapeHtml(r.DOC)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  };

  container.innerHTML = `
    <div class="sim-box">
      <div class="panel-heading"><span>Planificación Cap. 05 (12 semanas / 60 días hábiles)</span></div>
      <div class="sim-controls-row">
        <button type="button" class="sim-btn" data-testid="sim-s13-tab-wbs">WBS (1.0–1.5)</button>
        <button type="button" class="sim-btn" data-testid="sim-s13-tab-cpm">Ruta Crítica (CPM)</button>
        <button type="button" class="sim-btn" data-testid="sim-s13-tab-gantt">Cronograma Gantt</button>
        <button type="button" class="sim-btn" data-testid="sim-s13-tab-raci">Matriz RACI</button>
      </div>
      <div data-testid="sim-s13-panel"></div>
    </div>
  `;

  const panel = container.querySelector('[data-testid="sim-s13-panel"]');
  const tabs = ['wbs', 'cpm', 'gantt', 'raci'];
  const update = (tab) => {
    simState.s13Tab = tab;
    panel.innerHTML = renderPanelContent(tab);
    tabs.forEach((t) => {
      container.querySelector(`[data-testid="sim-s13-tab-${t}"]`)?.classList.toggle('is-active', t === tab);
    });
  };

  tabs.forEach((t) => {
    container.querySelector(`[data-testid="sim-s13-tab-${t}"]`).addEventListener('click', () => update(t));
  });
  update(simState.s13Tab || 'wbs');

  return () => {};
}

export function mountS20ConcurrencySim(container, slide, stageApi) {
  const b = slide.structuredData?.benchmarks || {};
  let raceTimer = null;
  let raceRunning = false;

  container.innerHTML = `
    <div class="sim-box">
      <div class="panel-heading">
        <span>Carrera de Concurrencia · Última Unidad</span>
        <span class="slide-pill slide-pill--orange">transaction.atomic + quantity__gte</span>
      </div>
      <div class="sim-kpi-grid">
        <div class="sim-kpi-card">
          <small>Stock inicial bajo carrera</small>
          <strong data-testid="sim-s20-stock">${simState.s20Stock}</strong>
        </div>
        <div class="sim-kpi-card">
          <small>Operación concurrente</small>
          <strong>POS-A vs POS-B (1 u.)</strong>
        </div>
      </div>
      <div class="sim-controls-row">
        <button type="button" class="btn-primary-cta" data-testid="sim-s20-run-race">Simular Carrera (2 Cajas × 1 Unidad)</button>
      </div>
      <div class="sim-status-box ${simState.s20Tone === 'ok' ? 'is-ok' : ''}" data-testid="sim-s20-result">${escapeHtml(simState.s20Result)}</div>
      <div class="mini-cards-grid" data-testid="sim-s20-metrics">
        <div class="mini-card"><strong>Catálogo 20,000:</strong> P95 = ${escapeHtml(b.catalog20kP95 || '0.029 s')} (máx ${escapeHtml(b.catalog20kMax || '0.033 s')})</div>
        <div class="mini-card"><strong>500 ventas × 20 lín.:</strong> P95 = ${escapeHtml(b.sales500P95 || '1.142 s')} (10,000 salidas Kardex)</div>
        <div class="mini-card"><strong>CSV 10,000 filas:</strong> ${escapeHtml(b.csv10kImport || '56.36 s')} · Restore: 46 migraciones (${escapeHtml(b.restoreTime || '3.29–7.27 s')})</div>
        <div class="mini-card"><strong>Suite completa:</strong> 120 / 120 · 0 fallos · 0 errores</div>
      </div>
      ${
        slide.codeSnippet
          ? `<div class="slide-code-block">
               <div class="slide-code-header"><span>${escapeHtml(slide.codeSnippet.title)}</span><span>Python / Django ORM</span></div>
               <pre class="slide-code-pre">${highlightCodeHtml(slide.codeSnippet.code, 'python', slide.codeSnippet.highlightLines)}</pre>
             </div>`
          : ''
      }
    </div>
  `;

  const stockEl = container.querySelector('[data-testid="sim-s20-stock"]');
  const resultEl = container.querySelector('[data-testid="sim-s20-result"]');
  const runBtn = container.querySelector('[data-testid="sim-s20-run-race"]');

  runBtn.addEventListener('click', () => {
    if (raceRunning) return;
    raceRunning = true;
    simState.s20RaceCount += 1;
    // Determinístico e idempotente en ejecuciones repetidas: prepara 1 unidad disponible bajo bloqueo
    simState.s20Stock = 1;
    stockEl.textContent = '1';
    resultEl.classList.remove('is-ok');
    resultEl.textContent = 'Ejecutando transacción paralela POS-A y POS-B sobre stock = 1...';

    raceTimer = setTimeout(() => {
      raceRunning = false;
      simState.s20Stock = 0;
      simState.s20Tone = 'ok';
      simState.s20Result = `Carrera #${simState.s20RaceCount} resuelta: POS-A confirmó 1 venta exitosa (changed = 1) · POS-B rechazada limpiamente (bloqueada por quantity__gte en UPDATE condicional). Saldo final exacto: 0.`;
      stockEl.textContent = '0';
      resultEl.textContent = simState.s20Result;
      resultEl.classList.add('is-ok');
      stageApi?.triggerSimulationEffect?.('ignition');
    }, 30);
  });

  return () => {
    if (raceTimer !== null) {
      clearTimeout(raceTimer);
      raceTimer = null;
    }
    raceRunning = false;
  };
}

export function mountS25MmcSim(container, slide, stageApi) {
  const data = slide.structuredData || {};
  const render = () => {
    const isFour = simState.s25Servers === 4;
    const cfg = isFour ? data.c4 : data.c2;
    container.innerHTML = `
      <div class="sim-box">
        <div class="panel-heading">
          <span>Simulador Teoría de Colas M/M/c</span>
          <span class="slide-pill slide-pill--blue">Ticket C$ 240.38 · 1,040 facturas/mes</span>
        </div>
        <div class="sim-controls-row">
          <button type="button" class="sim-btn ${!isFour ? 'is-active' : ''}" data-testid="sim-s25-toggle-2">Escenario Actual (2 Cajas)</button>
          <button type="button" class="sim-btn ${isFour ? 'is-active' : ''}" data-testid="sim-s25-toggle-4">Escenario Propuesto (4 POS)</button>
        </div>
        <div class="sim-kpi-grid">
          <div class="sim-kpi-card">
            <small>Espera promedio en cola (Wq)</small>
            <strong data-testid="sim-s25-wq">${escapeHtml(cfg.wqDisplay)}</strong>
          </div>
          <div class="sim-kpi-card">
            <small>Utilización de cajas (ρ)</small>
            <strong data-testid="sim-s25-rho">${cfg.rhoPct}%</strong>
          </div>
          <div class="sim-kpi-card">
            <small>Abandono / Impacto anual</small>
            <strong>${cfg.abandonmentPct}% · ${isFour ? '+$4,239.07 USD/año' : '-$5,298.84 USD/año'}</strong>
          </div>
        </div>
        <div class="svg-chart-wrap">${renderMmcCompareSvg(simState.s25Servers)}</div>
      </div>
    `;

    container.querySelector('[data-testid="sim-s25-toggle-2"]').addEventListener('click', () => {
      simState.s25Servers = 2;
      stageApi?.triggerSimulationEffect?.('click');
      render();
    });
    container.querySelector('[data-testid="sim-s25-toggle-4"]').addEventListener('click', () => {
      simState.s25Servers = 4;
      stageApi?.triggerSimulationEffect?.('trigger-ok');
      render();
    });
  };

  render();
  return () => {};
}

export function mountS28SensitivitySim(container, slide, appState) {
  const data = slide.structuredData || {};
  const I0 = data.I0 || 13662.14;
  const scenarios = data.scenarios || {};

  const katexTex = String.raw`\text{VAN}(r) = -I_0 + \sum_{t=1}^{5} \frac{FC_t}{(1+r)^t} = -13{,}662.14 + FC \cdot \frac{1-(1+r)^{-5}}{r}`;

  container.innerHTML = `
    <div class="sim-box">
      <div class="panel-heading">
        <span>Sensibilidad Financiera · Horizonte 5 años</span>
        <button type="button" class="btn-secondary-cta" data-testid="btn-check-excel-s28">📊 Comprobar en Excel</button>
      </div>
      <div class="sim-controls-row">
        <button type="button" class="sim-btn" data-testid="sim-s28-scenario-pesimista">Pesimista (FC $5,000)</button>
        <button type="button" class="sim-btn" data-testid="sim-s28-scenario-base">Base (FC $8,000)</button>
        <button type="button" class="sim-btn" data-testid="sim-s28-scenario-optimista">Optimista (FC $10,600)</button>
      </div>
      <div class="tmar-slider-wrap">
        <label for="s28-tmar-input" style="font-size:12px;font-weight:600;white-space:nowrap;">TMAR anual:</label>
        <input id="s28-tmar-input" type="range" min="0" max="35" step="1" value="${simState.s28TmarPct}" data-testid="sim-s28-tmar-slider" />
        <strong data-testid="sim-s28-tmar-value" style="font-family:var(--font-mono);color:var(--ignition-orange);min-width:60px;text-align:right;">${simState.s28TmarPct.toFixed(2)}%</strong>
      </div>
      <div class="sim-kpi-grid">
        <div class="sim-kpi-card">
          <small>Valor Actual Neto (VAN)</small>
          <strong data-testid="sim-s28-van"></strong>
        </div>
        <div class="sim-kpi-card">
          <small>TIR / Payback / B/C</small>
          <div>
            <strong data-testid="sim-s28-tir"></strong>
            <span data-testid="sim-s28-extra" style="display:block;font-size:11px;color:var(--text-muted);"></span>
          </div>
        </div>
      </div>
      <div class="svg-chart-wrap" data-testid="sim-s28-chart"></div>
      <div class="katex-formula-box">${renderKatexHtml(katexTex, false)}</div>
    </div>
  `;

  const slider = container.querySelector('[data-testid="sim-s28-tmar-slider"]');
  const tmarValEl = container.querySelector('[data-testid="sim-s28-tmar-value"]');
  const vanEl = container.querySelector('[data-testid="sim-s28-van"]');
  const tirEl = container.querySelector('[data-testid="sim-s28-tir"]');
  const extraEl = container.querySelector('[data-testid="sim-s28-extra"]');
  const chartWrap = container.querySelector('[data-testid="sim-s28-chart"]');

  const syncMetrics = () => {
    const scKey = simState.s28Scenario || 'base';
    const sc = scenarios[scKey] || scenarios.base;
    const fc = sc.fc;
    const tmar = Number(simState.s28TmarPct);
    const van = calculateAnnuityVan(I0, fc, tmar);

    slider.value = String(tmar);
    tmarValEl.textContent = `${tmar.toFixed(2)}%`;
    vanEl.textContent = formatUsd(van);
    vanEl.style.color = van >= 0 ? '#86efac' : '#fda4af';
    tirEl.textContent = sc.tir;
    extraEl.textContent = `Payback ${sc.pbDisc} a. · B/C ${sc.bc} · ROI 5a ${sc.roi5y}`;
    chartWrap.innerHTML = renderVanSensitivitySvg(I0, fc, tmar);

    ['pesimista', 'base', 'optimista'].forEach((k) => {
      container.querySelector(`[data-testid="sim-s28-scenario-${k}"]`)?.classList.toggle('is-active', k === scKey);
    });
  };

  ['pesimista', 'base', 'optimista'].forEach((k) => {
    container.querySelector(`[data-testid="sim-s28-scenario-${k}"]`).addEventListener('click', () => {
      simState.s28Scenario = k;
      syncMetrics();
    });
  });

  const onSliderChange = () => {
    const raw = Number(slider.value);
    simState.s28TmarPct = Number.isFinite(raw) ? Math.max(0, Math.min(35, Math.round(raw))) : 12;
    syncMetrics();
  };
  slider.addEventListener('input', onSliderChange);
  slider.addEventListener('change', onSliderChange);

  container.querySelector('[data-testid="btn-check-excel-s28"]').addEventListener('click', () => {
    appState.openExcel('Flujos', 'A85:G107');
  });

  syncMetrics();
  return () => {};
}

export function mountS31TraceabilitySim(container, slide) {
  const data = slide.structuredData || {};
  const rows = data.matrixRows || [];

  container.innerHTML = `
    <div class="sim-box">
      <div class="flow-chain" style="margin-bottom:4px;">
        ${(data.chain || []).map((c) => `<span class="flow-node">${escapeHtml(c)}</span>`).join('')}
      </div>
      <div data-testid="sim-s31-matrix">
        ${rows
          .map(
            (r) => `<button type="button" data-testid="sim-s31-row" data-row-id="${escapeHtml(r.id)}" class="${simState.s31SelectedId === r.id ? 'is-selected' : ''}">
              <span style="display:flex;width:100%;justify-content:space-between;font-weight:700;">
                <span>${escapeHtml(r.id)}</span>
                <span style="color:#86efac;">${escapeHtml(r.status)}</span>
              </span>
              <span style="color:#cbd5e1;">${escapeHtml(r.desc)}</span>
            </button>`
          )
          .join('')}
      </div>
      <div class="sim-status-box is-ok" data-testid="sim-s31-detail"></div>
    </div>
  `;

  const detailEl = container.querySelector('[data-testid="sim-s31-detail"]');
  const renderDetail = (rowId) => {
    simState.s31SelectedId = rowId;
    const row = rows.find((r) => r.id === rowId) || rows[0];
    if (!row) return;
    detailEl.innerHTML = `<strong>${escapeHtml(row.id)}</strong> · Requisitos: <code>${escapeHtml(row.reqs)}</code> · Módulos: <code>${escapeHtml(row.modules)}</code> · Verificación: ${escapeHtml(row.tests)} (<strong>${escapeHtml(row.status)}</strong>)`;
    container.querySelectorAll('[data-testid="sim-s31-row"]').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.rowId === row.id);
    });
  };

  container.querySelectorAll('[data-testid="sim-s31-row"]').forEach((btn) => {
    btn.addEventListener('click', () => renderDetail(btn.dataset.rowId));
  });
  renderDetail(simState.s31SelectedId || rows[0]?.id);

  return () => {};
}
