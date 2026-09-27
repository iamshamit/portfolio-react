import React from 'react';

// Shamit's wall clock (IST) plus a guess at what he's doing
const STATUS = [
  [5, 'probably asleep (or debugging)'], [9, 'coffee, then code'], [13, 'deep in a build'],
  [18, 'shipping things'], [22, 'on side projects'], [24, 'debugging something'],
];
export function localNow() {
  const d = new Date();
  const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
  const hour = +d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }) % 24;
  return { time, status: STATUS.find(([h]) => hour < h)[1] };
}

export default function LocalTime({ children }) {
  const [now, setNow] = React.useState(localNow);
  React.useEffect(() => {
    const id = setInterval(() => setNow(localNow()), 20000);
    return () => clearInterval(id);
  }, []);
  return children(now);
}
