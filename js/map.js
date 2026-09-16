/** Leaflet helpers — colori dBm verde→rosso, mai inventare metriche. */

export function signalColor(row) {
  const dbm = row.dbm;
  if (dbm != null) {
    // tipico LTE: -50 ottimo, -110 pessimo
    const t = Math.max(0, Math.min(1, (dbm + 110) / 60));
    const hue = 120 * t; // 0 rosso debole → 120 verde forte
    return `hsl(${hue}, 75%, 42%)`;
  }
  const level = row.level;
  if (level != null) {
    const t = Math.max(0, Math.min(1, level / 4));
    const hue = 120 * t;
    return `hsl(${hue}, 70%, 45%)`;
  }
  return '#94a3b8'; // sconosciuto
}

export function popupHtml(row) {
  const bits = [
    `<strong>${escapeHtml(row.carrier_label || 'Altro')}</strong>`,
    row.iso_time ? escapeHtml(row.iso_time) : null,
    row.network_type ? 'Rete: ' + escapeHtml(row.network_type) : null,
    row.dbm != null ? `dBm: ${row.dbm}` : null,
    row.level != null ? `level: ${row.level}` : null,
    row.rsrp != null ? `RSRP: ${row.rsrp}` : null,
    row.sub_id !== '' ? `sub_id: ${escapeHtml(String(row.sub_id))}` : null,
  ].filter(Boolean);
  return bits.join('<br>');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function createMap(elementId) {
  const map = L.map(elementId);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);
  map.setView([44.4056, 8.9463], 8); // Genova area default
  return map;
}

export function renderPoints(map, layerGroup, rows) {
  layerGroup.clearLayers();
  const withGps = rows.filter(r => r.lat != null && r.lon != null);
  if (!withGps.length) {
    map.setView([44.4056, 8.9463], 8);
    return { points: 0 };
  }
  const latlngs = [];
  for (const row of withGps) {
    const ll = [row.lat, row.lon];
    latlngs.push(ll);
    const marker = L.circleMarker(ll, {
      radius: 5,
      color: signalColor(row),
      fillColor: signalColor(row),
      fillOpacity: 0.85,
      weight: 1,
    });
    marker.bindPopup(popupHtml(row));
    layerGroup.addLayer(marker);
  }
  map.fitBounds(L.latLngBounds(latlngs).pad(0.15));
  return { points: withGps.length };
}
