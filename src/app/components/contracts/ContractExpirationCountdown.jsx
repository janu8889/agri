"use client";

import { useEffect, useRef, useState } from "react";
import { expirationCountdown, padCountdown } from "@/lib/contracts/countdown";

export default function ContractExpirationCountdown({ expiresAt, serverNow, onExpired }) {
  const [remaining, setRemaining] = useState(() => expirationCountdown(expiresAt));
  const notified = useRef(false);
  const clockOffset = useRef(0);

  useEffect(() => {
    notified.current = false;
    const serverTimestamp = new Date(serverNow).getTime();
    clockOffset.current = Number.isFinite(serverTimestamp) ? serverTimestamp - Date.now() : 0;
    const update = () => {
      const next = expirationCountdown(expiresAt, Date.now() + clockOffset.current);
      setRemaining(next);
      if (next.expired && !notified.current) {
        notified.current = true;
        onExpired?.();
      }
    };
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [expiresAt, serverNow, onExpired]);

  const units = [
    [remaining.days, "Days"],
    [remaining.hours, "Hrs"],
    [remaining.minutes, "Min"],
    [remaining.seconds, "Sec"],
  ];

  return <aside className="contract-expiration" role="timer" aria-label="Time remaining to sign this agreement">
    <span className="contract-expiration__label">Expires in</span>
    <span className="contract-expiration__units" aria-hidden="true">
      {units.map(([value,label])=><span className="contract-expiration__unit" key={label}><b>{label==="Days"?value:padCountdown(value)}</b><small>{label}</small></span>)}
    </span>
    <span className="sr-only">{remaining.days} days, {remaining.hours} hours, {remaining.minutes} minutes, and {remaining.seconds} seconds remaining</span>
  </aside>;
}
