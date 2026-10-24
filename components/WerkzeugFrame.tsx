"use client";

import { useEffect, useRef, useState } from "react";

// Bettet ein eigenständiges Werkzeug-HTML nahtlos ein: Das Tool meldet seine
// Inhaltshöhe per postMessage, der Rahmen wächst mit → kein innerer Scrollbalken,
// die ganze Seite scrollt als eine. Kein Rahmen, keine sichtbare iframe-Kante.
export function WerkzeugFrame({ slug, title }: { slug: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const d = e.data;
      if (d && d.type === "fkb-werkzeug-height" && typeof d.height === "number") {
        setHeight(Math.max(480, Math.ceil(d.height) + 4));
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <iframe
      ref={ref}
      src={`/werkzeuge/${slug}/raw?embed=1`}
      title={title}
      loading="lazy"
      className="block w-full"
      style={{ height, border: 0, background: "transparent" }}
    />
  );
}
