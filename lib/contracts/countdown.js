export function expirationCountdown(expiresAt, now = Date.now()) {
  const target = new Date(expiresAt).getTime();
  const remainingMs = Number.isFinite(target) ? Math.max(0, target - now) : 0;
  const totalSeconds = Math.ceil(remainingMs / 1000);
  return {
    expired: remainingMs <= 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function padCountdown(value) {
  return String(value).padStart(2, "0");
}
