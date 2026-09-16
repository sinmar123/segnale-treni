/** Placeholder gamification leggera. */

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function estimateTrackKm(rows) {
  const pts = rows.filter(r => r.lat != null && r.lon != null);
  // dedupe same timestamp+coords from dual SIM
  const seen = new Set();
  const uniq = [];
  for (const p of pts) {
    const key = `${p.iso_time}|${p.lat}|${p.lon}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
  }
  uniq.sort((a, b) => String(a.iso_time).localeCompare(String(b.iso_time)));
  let km = 0;
  for (let i = 1; i < uniq.length; i++) {
    km += haversineKm(uniq[i-1], uniq[i]);
  }
  return Math.round(km * 10) / 10;
}

export function badgesFor(rows, km) {
  const badges = [];
  const carriers = new Set(rows.map(r => r.carrier_label).filter(Boolean));
  if (rows.length) badges.push({ title: 'Primo contributo', detail: `${rows.length} campioni` });
  if (km >= 1) badges.push({ title: 'Chilometri sui binari', detail: `${km} km stimati` });
  if (carriers.size >= 2) badges.push({ title: 'Dual SIM a bordo', detail: [...carriers].join(' + ') });
  else if (carriers.size === 1) badges.push({ title: 'Mono SIM ok', detail: [...carriers][0] });
  return badges;
}
