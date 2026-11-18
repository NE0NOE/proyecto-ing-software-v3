import katex from 'katex';

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderKatexHtml(tex, displayMode = false) {
  try {
    return katex.renderToString(String(tex || ''), {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      output: 'html',
    });
  } catch {
    return `<code>${escapeHtml(tex)}</code>`;
  }
}

const SQL_KEYWORDS = new Set([
  'CREATE', 'OR', 'REPLACE', 'FUNCTION', 'RETURNS', 'TRIGGER', 'LANGUAGE', 'SECURITY', 'DEFINER',
  'SET', 'AS', 'DECLARE', 'BEGIN', 'SELECT', 'INTO', 'FROM', 'WHERE', 'FOR', 'UPDATE', 'IF',
  'THEN', 'ELSE', 'RAISE', 'EXCEPTION', 'USING', 'ERRCODE', 'RETURN', 'END', 'BEFORE', 'INSERT',
  'ON', 'EACH', 'ROW', 'EXECUTE', 'INT', 'AND', 'NOT', 'NULL',
]);

const PY_KEYWORDS = new Set([
  'def', 'return', 'if', 'not', 'raise', 'for', 'in', 'from', 'import', 'class', 'else', 'elif',
  'and', 'or', 'True', 'False', 'None', 'with', 'as', 'try', 'except', 'Decimal', 'ValidationError',
  'ValueError',
]);

function tokenizeLine(line, lang) {
  const kwSet = lang === 'sql' ? SQL_KEYWORDS : PY_KEYWORDS;
  let commentIdx = -1;
  if (lang === 'sql') {
    commentIdx = line.indexOf('--');
  } else {
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === "'" && !inDouble) inSingle = !inSingle;
      else if (ch === '"' && !inSingle) inDouble = !inDouble;
      else if (ch === '#' && !inSingle && !inDouble) {
        commentIdx = i;
        break;
      }
    }
  }

  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

  const tokenRegex = /('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let out = '';
  let lastIndex = 0;

  for (const match of codePart.matchAll(tokenRegex)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      out += escapeHtml(codePart.slice(lastIndex, idx));
    }
    const tok = match[0];
    if (tok.startsWith("'") || tok.startsWith('"')) {
      out += `<span class="tok-str">${escapeHtml(tok)}</span>`;
    } else if (/^\d/.test(tok)) {
      out += `<span class="tok-num">${escapeHtml(tok)}</span>`;
    } else if (kwSet.has(lang === 'sql' ? tok.toUpperCase() : tok)) {
      out += `<span class="tok-kw">${escapeHtml(tok)}</span>`;
    } else if (codePart[idx + tok.length] === '(') {
      out += `<span class="tok-fn">${escapeHtml(tok)}</span>`;
    } else {
      out += escapeHtml(tok);
    }
    lastIndex = idx + tok.length;
  }
  if (lastIndex < codePart.length) {
    out += escapeHtml(codePart.slice(lastIndex));
  }
  if (commentPart) {
    out += `<span class="tok-com">${escapeHtml(commentPart)}</span>`;
  }
  return out;
}

export function highlightCodeHtml(code, lang = 'python', highlightLines = []) {
  const hl = new Set(highlightLines);
  const lines = String(code || '').split('\n');
  return lines
    .map((line, i) => {
      const cls = hl.has(i + 1) ? 'code-line is-hl' : 'code-line';
      return `<span class="${cls}">${tokenizeLine(line, lang)}</span>`;
    })
    .join('');
}

export function renderHorizontalScoreChartSvg(items = [], ariaLabel = 'Gráfico comparativo') {
  const rowH = 38;
  const padTop = 14;
  const width = 540;
  const height = padTop + items.length * rowH + 10;
  const barStart = 210;
  const maxBarW = 250;

  const rows = items
    .map((item, idx) => {
      const y = padTop + idx * rowH;
      const pct = Math.max(0, Math.min(100, Number(item.score) || 0));
      const barW = Math.round((pct / 100) * maxBarW);
      const fill = item.selected ? '#2EE59D' : item.rejected ? '#E94560' : '#3BA0FF';
      const labelColor = item.selected ? '#86efac' : '#cbd5e1';
      return `
        <text x="8" y="${y + 18}" fill="${labelColor}" font-size="12" font-weight="${item.selected ? '700' : '500'}" font-family="Inter, sans-serif">${escapeHtml(item.name)}</text>
        <rect x="${barStart}" y="${y + 6}" width="${maxBarW}" height="18" rx="5" fill="rgba(30,41,59,0.85)" />
        <rect x="${barStart}" y="${y + 6}" width="${barW}" height="18" rx="5" fill="${fill}" />
        <text x="${barStart + maxBarW + 10}" y="${y + 19}" fill="${fill}" font-size="12.5" font-weight="700" font-family="JetBrains Mono, monospace">${pct}/100</text>
      `;
    })
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" aria-label="${escapeHtml(ariaLabel)}">${rows}</svg>`;
}

export function renderRegressionDynoSvg(series = []) {
  const pts = series.length
    ? series
    : [
        { label: 'Reg. 104', count: 104, durationSec: 221.34 },
        { label: 'Reg. 111', count: 111, durationSec: null },
        { label: 'Reg. 113', count: 113, durationSec: 235.42 },
        { label: 'Reg. 120', count: 120, durationSec: 289.28 },
      ];
  const width = 520;
  const height = 185;
  const minC = 100;
  const maxC = 124;
  const x0 = 56;
  const xSpan = 415;
  const yTop = 26;
  const yBot = 142;

  const coords = pts.map((p, i) => {
    const x = x0 + (i / Math.max(1, pts.length - 1)) * xSpan;
    const ratio = (p.count - minC) / (maxC - minC);
    const y = yBot - ratio * (yBot - yTop);
    return { ...p, x: Math.round(x), y: Math.round(y) };
  });

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const area = `${coords[0].x},${yBot} ${polyline} ${coords[coords.length - 1].x},${yBot}`;

  const gridLines = [104, 112, 120]
    .map((val) => {
      const y = Math.round(yBot - ((val - minC) / (maxC - minC)) * (yBot - yTop));
      return `
        <line x1="${x0 - 8}" y1="${y}" x2="${x0 + xSpan + 10}" y2="${y}" stroke="rgba(91,155,213,0.2)" stroke-dasharray="4 4" />
        <text x="12" y="${y + 4}" fill="#94a3b8" font-size="11" font-family="JetBrains Mono, monospace">${val}</text>
      `;
    })
    .join('');

  const nodes = coords
    .map(
      (c, i) => `
      <circle cx="${c.x}" cy="${c.y}" r="${i === coords.length - 1 ? 7 : 5}" fill="${i === coords.length - 1 ? '#2EE59D' : '#3BA0FF'}" stroke="#090d16" stroke-width="2" />
      <text x="${c.x}" y="${c.y - 11}" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace">${c.count}</text>
      <text x="${c.x}" y="${yBot + 18}" text-anchor="middle" fill="#94a3b8" font-size="10.5" font-family="Inter, sans-serif">${escapeHtml(c.label)}</text>
    `
    )
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" aria-label="Progresión de regresión 104 a 120 pruebas">
      ${gridLines}
      <polygon points="${area}" fill="rgba(46,229,157,0.12)" />
      <polyline points="${polyline}" fill="none" stroke="#2EE59D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${nodes}
    </svg>
  `;
}

export function renderEnergyCompareSvg(energy) {
  const width = 520;
  const height = 160;
  return `
    <svg viewBox="0 0 ${width} ${height}" aria-label="Comparativa energética por puesto">
      <text x="10" y="34" fill="#cbd5e1" font-size="12" font-family="Inter, sans-serif">2× PC Core 2 Duo antiguas (269 W total)</text>
      <rect x="10" y="42" width="420" height="22" rx="6" fill="rgba(233,69,96,0.22)" stroke="#e94560" />
      <rect x="10" y="42" width="420" height="22" rx="6" fill="rgba(233,69,96,0.65)" />
      <text x="438" y="57" fill="#fda4af" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace">134.5 W/pto</text>

      <text x="10" y="96" fill="#cbd5e1" font-size="12" font-family="Inter, sans-serif">8 Estaciones modernas (498 W total)</text>
      <rect x="10" y="104" width="420" height="22" rx="6" fill="rgba(30,41,59,0.75)" />
      <rect x="10" y="104" width="194" height="22" rx="6" fill="#2EE59D" />
      <text x="438" y="119" fill="#86efac" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace">62.25 W/pto</text>

      <text x="10" y="148" fill="#5B9BD5" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">Eficiencia por puesto: +53.7% de ahorro energético con 4× capacidad operativa</text>
    </svg>
  `;
}

export function renderCapacityGaugeSvg(cap) {
  const used = Number(cap?.usedGb ?? 58);
  const total = Number(cap?.totalGb ?? 1000);
  const pct = Number(cap?.pct ?? 5.8);
  const width = 500;
  const height = 110;
  const barW = 460;
  const fillW = Math.max(18, Math.round((pct / 100) * barW));
  return `
    <svg viewBox="0 0 ${width} ${height}" aria-label="Capacidad de almacenamiento a 5 años">
      <text x="12" y="24" fill="#cbd5e1" font-size="12" font-weight="600" font-family="Inter, sans-serif">Capacidad RAID 1 útil a 5 años (${cap?.invoices?.toLocaleString('en-US') || '84,146'} facturas proyectadas)</text>
      <rect x="12" y="38" width="${barW}" height="28" rx="8" fill="rgba(15,23,42,0.9)" stroke="rgba(59,160,255,0.45)" />
      <rect x="12" y="38" width="${fillW}" height="28" rx="8" fill="#2EE59D" />
      <text x="20" y="88" fill="#86efac" font-size="12.5" font-weight="700" font-family="JetBrains Mono, monospace">${used.toFixed(2)} GB usados / ${total.toLocaleString('en-US')} GB útiles (${pct.toFixed(2)}%) · Margen libre 94.20%</text>
    </svg>
  `;
}

export function renderDgaWaterfallSvg(taxCascade) {
  const steps = [
    { label: 'EXW (19 ítems)', val: '$7,770.09', w: 280, x: 145, color: '#3BA0FF' },
    { label: 'Flete + Seguro', val: '+$916.55', w: 48, x: 425, color: '#5B9BD5' },
    { label: 'Valor CIF', val: '$8,686.64', w: 315, x: 145, color: '#00FFFF' },
    { label: 'DAI + IVA (15%)', val: '+$1,475.50', w: 68, x: 460, color: '#FF6B1A' },
    { label: 'Nacionalizado', val: '$10,162.14', w: 380, x: 145, color: '#2EE59D' },
  ];
  const height = 185;
  const width = 560;
  const rows = steps
    .map((s, i) => {
      const y = 14 + i * 33;
      return `
        <text x="8" y="${y + 16}" fill="#cbd5e1" font-size="11.5" font-family="Inter, sans-serif">${escapeHtml(s.label)}</text>
        <rect x="${s.x}" y="${y + 3}" width="${Math.min(s.w, 300)}" height="19" rx="4" fill="${s.color}" opacity="0.88" />
        <text x="${Math.min(s.x + s.w + 8, 468)}" y="${y + 17}" fill="${s.color}" font-size="11.5" font-weight="700" font-family="JetBrains Mono, monospace">${escapeHtml(s.val)}</text>
      `;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" aria-label="Cascada tributaria DGA Nicaragua">${rows}</svg>`;
}

export function renderMmcCompareSvg(servers) {
  const isFour = servers === 4;
  return `
    <svg viewBox="0 0 500 140" aria-label="Comparativa Teoría de Colas M/M/c">
      <text x="10" y="24" fill="#cbd5e1" font-size="12" font-family="Inter, sans-serif">2 Cajas (ρ = 95% · saturación crítica)</text>
      <rect x="10" y="32" width="380" height="22" rx="6" fill="${!isFour ? '#e94560' : 'rgba(233,69,96,0.45)'}" />
      <text x="398" y="48" fill="#fda4af" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace">Wq 22.8 min</text>

      <text x="10" y="84" fill="#cbd5e1" font-size="12" font-family="Inter, sans-serif">4 Cajas POS (ρ = 47.5% · flujo óptimo)</text>
      <rect x="10" y="92" width="380" height="22" rx="6" fill="rgba(15,23,42,0.75)" />
      <rect x="10" y="92" width="22" height="22" rx="6" fill="${isFour ? '#2EE59D' : 'rgba(46,229,157,0.55)'}" />
      <text x="398" y="108" fill="#86efac" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace">Wq 20.6 s</text>
      <text x="10" y="132" fill="#94a3b8" font-size="11" font-family="Inter, sans-serif">Reducción del 98.5% en tiempo de espera · Abandono cae de 6.5% a 1.3% (-80%)</text>
    </svg>
  `;
}

export function renderCashflowBarsSvg() {
  const bars = [
    { label: 'Año 0 (I₀)', val: -13662.14, text: '-$13,662.14', color: '#e94560' },
    { label: 'Año 1 FC', val: 8000, text: '+$8,000', color: '#2EE59D' },
    { label: 'Año 2 FC', val: 8000, text: '+$8,000', color: '#2EE59D' },
    { label: 'Año 3 FC', val: 8000, text: '+$8,000', color: '#2EE59D' },
    { label: 'Año 4 FC', val: 8000, text: '+$8,000', color: '#2EE59D' },
    { label: 'Año 5 FC', val: 8000, text: '+$8,000', color: '#2EE59D' },
  ];
  const midY = 92;
  const maxAbs = 14500;
  const colW = 78;
  const rects = bars
    .map((b, i) => {
      const x = 18 + i * colW;
      const h = Math.round((Math.abs(b.val) / maxAbs) * 72);
      const y = b.val >= 0 ? midY - h : midY;
      const lblY = b.val >= 0 ? y - 6 : y + h + 13;
      return `
        <rect x="${x}" y="${y}" width="52" height="${h}" rx="5" fill="${b.color}" opacity="0.88" />
        <text x="${x + 26}" y="${lblY}" text-anchor="middle" fill="${b.color}" font-size="10.5" font-weight="700" font-family="JetBrains Mono, monospace">${b.text}</text>
        <text x="${x + 26}" y="182" text-anchor="middle" fill="#cbd5e1" font-size="10.5" font-family="Inter, sans-serif">${b.label}</text>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 500 192" aria-label="Flujo de caja a 5 años">
      <line x1="8" y1="${midY}" x2="492" y2="${midY}" stroke="rgba(148,163,184,0.45)" stroke-width="1.5" />
      ${rects}
    </svg>
  `;
}

export function calculateAnnuityVan(I0, fc, tmarPct) {
  const pct = Number(tmarPct);
  if (!Number.isFinite(pct) || pct <= 0) {
    return Number((-I0 + fc * 5).toFixed(2));
  }
  const r = pct / 100;
  const factor = Math.round(((1 - Math.pow(1 + r, -5)) / r) * 10000) / 10000;
  return Number((-I0 + fc * factor).toFixed(2));
}

export function renderVanSensitivitySvg(I0, fc, currentTmarPct) {
  const width = 500;
  const height = 155;
  const x0 = 54;
  const xEnd = 472;
  const yTop = 18;
  const yBot = 122;
  const minVal = -10000;
  const maxVal = 40000;

  const toX = (t) => x0 + (t / 35) * (xEnd - x0);
  const toY = (v) => yBot - ((Math.max(minVal, Math.min(maxVal, v)) - minVal) / (maxVal - minVal)) * (yBot - yTop);
  const zeroY = Math.round(toY(0));

  const points = [];
  for (let t = 0; t <= 35; t += 1) {
    const v = calculateAnnuityVan(I0, fc, t);
    points.push(`${Math.round(toX(t))},${Math.round(toY(v))}`);
  }
  const curVan = calculateAnnuityVan(I0, fc, currentTmarPct);
  const cx = Math.round(toX(currentTmarPct));
  const cy = Math.round(toY(curVan));

  return `
    <svg viewBox="0 0 ${width} ${height}" aria-label="Curva sensibilidad VAN vs TMAR">
      <line x1="${x0}" y1="${zeroY}" x2="${xEnd}" y2="${zeroY}" stroke="rgba(233,69,96,0.65)" stroke-dasharray="4 3" />
      <text x="8" y="${zeroY + 4}" fill="#fda4af" font-size="10" font-family="JetBrains Mono, monospace">$0</text>
      <polyline points="${points.join(' ')}" fill="none" stroke="#3BA0FF" stroke-width="2.5" />
      <circle cx="${cx}" cy="${cy}" r="6" fill="${curVan >= 0 ? '#2EE59D' : '#e94560'}" stroke="#ffffff" stroke-width="2" />
      <text x="${x0}" y="144" fill="#94a3b8" font-size="10.5" font-family="JetBrains Mono, monospace">TMAR 0%</text>
      <text x="${Math.round(toX(12))}" y="144" text-anchor="middle" fill="#fdba74" font-size="10.5" font-family="JetBrains Mono, monospace">12%</text>
      <text x="${xEnd}" y="144" text-anchor="end" fill="#94a3b8" font-size="10.5" font-family="JetBrains Mono, monospace">35%</text>
    </svg>
  `;
}

export function renderVlanStarSvg(vlans = [], selectedId = null) {
  const nodes = [
    { id: 10, label: 'VLAN 10 · SRV1 .10', x: 100, y: 38 },
    { id: 20, label: 'VLAN 20 · POS01-04', x: 390, y: 38 },
    { id: 30, label: 'VLAN 30 · Oficinas', x: 75, y: 92 },
    { id: 40, label: 'VLAN 40 · Bodega', x: 415, y: 92 },
    { id: 50, label: 'VLAN 50 · PRN1 .10', x: 100, y: 145 },
    { id: 99, label: 'VLAN 99 · Gestión', x: 390, y: 145 },
  ];
  const center = { x: 248, y: 92 };

  const edges = nodes
    .map((n) => `<line x1="${center.x}" y1="${center.y}" x2="${n.x}" y2="${n.y}" stroke="${selectedId === n.id ? '#FF6B1A' : 'rgba(59,160,255,0.45)'}" stroke-width="${selectedId === n.id ? 2.5 : 1.5}" />`)
    .join('');

  const boxes = nodes
    .map((n) => {
      const active = selectedId === n.id;
      return `
        <rect x="${n.x - 66}" y="${n.y - 16}" width="132" height="28" rx="6" fill="${active ? 'rgba(255,107,26,0.28)' : 'rgba(15,23,42,0.9)'}" stroke="${active ? '#FF6B1A' : '#3BA0FF'}" />
        <text x="${n.x}" y="${n.y + 2}" text-anchor="middle" fill="#e2e8f0" font-size="10.5" font-weight="600" font-family="JetBrains Mono, monospace">${escapeHtml(n.label)}</text>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 500 180" aria-label="Topología estrella 6 VLAN MREC">
      ${edges}
      ${boxes}
      <circle cx="${center.x}" cy="${center.y}" r="28" fill="#0D2A4A" stroke="#2EE59D" stroke-width="2" />
      <text x="${center.x}" y="${center.y - 2}" text-anchor="middle" fill="#2EE59D" font-size="10.5" font-weight="700" font-family="JetBrains Mono, monospace">R1 + SW1</text>
      <text x="${center.x}" y="${center.y + 11}" text-anchor="middle" fill="#cbd5e1" font-size="9" font-family="Inter, sans-serif">Estrella LAN</text>
    </svg>
  `;
}
