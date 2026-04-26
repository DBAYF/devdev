// src/lib/format.ts — pure formatting helpers, no DOM, no Astro.

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatDate(iso: string): string {
  // Accepts YYYY-MM-DD or full ISO.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCountdown(targetISO: string, now: number = Date.now()): string {
  const ms = new Date(targetISO).getTime() - now;
  if (ms <= 0) return 'ENDED';
  const days = Math.floor(ms / 86_400_000);
  const hrs = Math.floor((ms % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hrs}h`;
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  return `${hrs}h ${mins}m`;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}
