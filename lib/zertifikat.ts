import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Stufen-Zertifikat (PDF, A4 quer) im FKB-Campus-Design.
 * Erzeugt serverseitig via pdf-lib (Vercel-kompatibel, kein Python nötig).
 */

const PRIMARY = rgb(10 / 255, 52 / 255, 90 / 255);
const PRIMARY_DARK = rgb(6 / 255, 35 / 255, 60 / 255);
const ACCENT = rgb(203 / 255, 179 / 255, 148 / 255);
const INK_2 = rgb(59 / 255, 67 / 255, 77 / 255);
const INK_3 = rgb(108 / 255, 118 / 255, 128 / 255);
const PAPER = rgb(248 / 255, 248 / 255, 250 / 255);

export const STUFEN_SLUGS: Record<string, string> = {
  berater: "Berater",
  sparringspartner: "Sparringspartner",
  "strategischer-partner": "Strategischer Partner",
};

export async function createZertifikatPdf(opts: {
  name: string;
  stufe: string;          // Anzeigename, z. B. "Sparringspartner"
  moduleCount: number;    // Anzahl der Stufen-Module
  moduleTitles: string[]; // abgeschlossene Modultitel der Stufe
  datum?: Date;
}): Promise<Uint8Array> {
  const { name, stufe, moduleCount, moduleTitles } = opts;
  const datum = opts.datum ?? new Date();

  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 quer
  const { width: W, height: H } = page.getSize();

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const mono = await doc.embedFont(StandardFonts.Courier);

  const center = (text: string, font: typeof serif, size: number) =>
    (W - font.widthOfTextAtSize(text, size)) / 2;

  // Hintergrund + Rahmen
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: PAPER });
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48,
                       borderColor: PRIMARY, borderWidth: 1.5 });
  page.drawRectangle({ x: 30, y: 30, width: W - 60, height: H - 60,
                       borderColor: ACCENT, borderWidth: 0.75 });
  // Kopf- und Fußband
  page.drawRectangle({ x: 24, y: H - 70, width: W - 48, height: 46, color: PRIMARY });
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: 30, color: PRIMARY_DARK });

  const eyebrow = "FKB CAMPUS  ·  FIRMENKUNDENAKADEMIE  ·  ZERTIFIKAT";
  page.drawText(eyebrow, {
    x: center(eyebrow, mono, 10), y: H - 52, size: 10, font: mono,
    color: rgb(0.78, 0.83, 0.9),
  });

  let y = H - 150;
  const title = "Zertifikat";
  page.drawText(title, { x: center(title, serifBold, 44), y, size: 44,
                         font: serifBold, color: PRIMARY });

  y -= 44;
  const intro = "Hiermit wird bestätigt, dass";
  page.drawText(intro, { x: center(intro, serif, 14), y, size: 14,
                         font: serif, color: INK_2 });

  y -= 46;
  let nameSize = 30;
  while (serifBold.widthOfTextAtSize(name, nameSize) > W - 200 && nameSize > 16) nameSize -= 1;
  page.drawText(name, { x: center(name, serifBold, nameSize), y, size: nameSize,
                        font: serifBold, color: PRIMARY_DARK });
  const nw = serifBold.widthOfTextAtSize(name, nameSize);
  page.drawLine({ start: { x: (W - nw) / 2 - 16, y: y - 10 },
                  end: { x: (W + nw) / 2 + 16, y: y - 10 },
                  thickness: 1, color: ACCENT });

  y -= 52;
  const line1 = `alle ${moduleCount} Module der Kompetenzstufe`;
  page.drawText(line1, { x: center(line1, serif, 14), y, size: 14,
                         font: serif, color: INK_2 });

  y -= 36;
  const stufeText = `„${stufe}“`;
  page.drawText(stufeText, { x: center(stufeText, serifBold, 26), y, size: 26,
                             font: serifBold, color: PRIMARY });

  y -= 34;
  const line2 = "der Firmenkundenakademie erfolgreich abgeschlossen hat.";
  page.drawText(line2, { x: center(line2, serif, 14), y, size: 14,
                         font: serif, color: INK_2 });

  // Modulliste (kompakt, kursiv)
  y -= 34;
  const moduleLine = moduleTitles.join("  ·  ");
  let mSize = 9;
  while (serifItalic.widthOfTextAtSize(moduleLine, mSize) > W - 140 && mSize > 6) mSize -= 0.5;
  if (serifItalic.widthOfTextAtSize(moduleLine, mSize) <= W - 140) {
    page.drawText(moduleLine, { x: center(moduleLine, serifItalic, mSize), y,
                                size: mSize, font: serifItalic, color: INK_3 });
  }

  // Datum + Unterschrift
  const datumStr = datum.toLocaleDateString("de-DE",
    { day: "2-digit", month: "long", year: "numeric" });
  page.drawText(datumStr, { x: 110, y: 110, size: 11, font: serif, color: INK_2 });
  page.drawLine({ start: { x: 100, y: 102 }, end: { x: 280, y: 102 },
                  thickness: 0.75, color: INK_3 });
  page.drawText("Datum", { x: 100, y: 88, size: 8, font: mono, color: INK_3 });

  page.drawText("FKB Campus", { x: W - 280, y: 110, size: 13,
                                font: serifItalic, color: INK_2 });
  page.drawLine({ start: { x: W - 290, y: 102 }, end: { x: W - 100, y: 102 },
                  thickness: 0.75, color: INK_3 });
  page.drawText("FKB Campus · Firmenkundenakademie", {
    x: W - 290, y: 88, size: 8, font: mono, color: INK_3 });

  const footer = "Wissenschaftlich fundierte Weiterbildung für Firmenkundenberater · Bloom-Taxonomie · Dreyfus-Kompetenzmodell · Kirkpatrick-Evaluation";
  page.drawText(footer, { x: center(footer, mono, 7), y: 36, size: 7,
                          font: mono, color: rgb(0.7, 0.76, 0.84) });

  return doc.save();
}
