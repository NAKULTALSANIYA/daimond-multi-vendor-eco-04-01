export const durationToMs = (value) => {
  if (!value || typeof value !== 'string') return 0;
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 0;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const map = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

  return amount * (map[unit] || 0);
};
