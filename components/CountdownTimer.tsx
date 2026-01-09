import React, { useEffect, useMemo, useState } from "react";

export function CountdownTimer({
  targetDate,
  lang,
}: {
  targetDate: string;
  lang: "en" | "bn";
}) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const label = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(targetDate);
    d.setHours(0, 0, 0, 0);

    const diff = d.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return lang === "bn" ? "সময় শেষ" : "Time Up";
    return lang === "bn" ? `${days} দিন বাকি` : `${days} Days Left`;
  }, [targetDate, lang]);

  const isUp = label === "Time Up" || label === "সময় শেষ";

  return (
    <span className={isUp ? "font-black text-red-500" : "font-black text-emerald-600"}>
      {label}
    </span>
  );
}
