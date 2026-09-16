/** Parser CSV SegnaleTreno — mono SIM first-class, dual SIM optional. */
export const CSV_HEADER = [
  'iso_time','lat','lon','accuracy_m','sub_id','carrier_raw','carrier_label',
  'network_type','dbm','level','rsrp','rsrq','sinr'
];

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function numOrNull(v) {
  if (v === undefined || v === null || String(v).trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseSegnaleCsv(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim().length);
  if (!lines.length) throw new Error('CSV vuoto');
  const header = splitCsvLine(lines[0]).map(h => h.trim());
  const missing = CSV_HEADER.filter(h => !header.includes(h));
  if (missing.length) {
    throw new Error('Intestazione incompleta. Mancano: ' + missing.join(', '));
  }
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length === 1 && !cols[0].trim()) continue;
    const get = (k) => (cols[idx[k]] ?? '').trim();
    const lat = numOrNull(get('lat'));
    const lon = numOrNull(get('lon'));
    rows.push({
      iso_time: get('iso_time'),
      lat, lon,
      accuracy_m: numOrNull(get('accuracy_m')),
      sub_id: get('sub_id'),
      carrier_raw: get('carrier_raw'),
      carrier_label: get('carrier_label') || 'Altro',
      network_type: get('network_type'),
      dbm: numOrNull(get('dbm')),
      level: numOrNull(get('level')),
      rsrp: numOrNull(get('rsrp')),
      rsrq: numOrNull(get('rsrq')),
      sinr: numOrNull(get('sinr')),
      _line: i + 1,
    });
  }
  return rows;
}

export function rowsWithGps(rows) {
  return rows.filter(r => r.lat != null && r.lon != null);
}

export async function loadCsvUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Impossibile caricare ' + url);
  return parseSegnaleCsv(await res.text());
}
