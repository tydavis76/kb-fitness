// units.jsx — Global units preference (lb/kg) backed by localStorage
// Exposes useUnit() hook + convert/displayLoad helpers used app-wide.

const UNIT_KEY = 'kb-fitness-unit';
const UNIT_EVENT = 'kb-unit-change';

function getStoredUnit() {
  try { return localStorage.getItem(UNIT_KEY) || 'lb'; } catch { return 'lb'; }
}
function setStoredUnit(u) {
  try { localStorage.setItem(UNIT_KEY, u); } catch {}
  window.dispatchEvent(new CustomEvent(UNIT_EVENT, { detail: u }));
}

function useUnit() {
  const [unit, setUnit] = React.useState(getStoredUnit);
  React.useEffect(() => {
    const fn = (e) => setUnit(e.detail);
    window.addEventListener(UNIT_EVENT, fn);
    return () => window.removeEventListener(UNIT_EVENT, fn);
  }, []);
  return [unit, setStoredUnit];
}

// Convert any load object to the user's preferred display unit.
// Bands, damper, bodyweight pass through unchanged.
function displayLoad(load, unit) {
  if (!load) return '—';
  if (load.value == null) return load.label || '—';
  if (load.unit === 'lb' && unit === 'kg') {
    const kg = Math.round((load.value / 2.2046) * 2) / 2;
    return `${kg} kg`;
  }
  if (load.unit === 'kg' && unit === 'lb') {
    return `${Math.round(load.value * 2.2046)} lb`;
  }
  return load.label || `${load.value} ${load.unit}`;
}

Object.assign(window, { useUnit, displayLoad, getStoredUnit, setStoredUnit });
