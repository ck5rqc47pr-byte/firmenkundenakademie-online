import fs from "fs";
import path from "path";

/**
 * Wissenstests (Kirkpatrick Level 2) – kanonisches Instrument der Akademie.
 *
 * Die Fragen liegen als Content-Dateien in content/quizzes/MXX.json
 * (eine Datei pro Modul) und können ohne Code-Änderung gepflegt werden –
 * dasselbe Prinzip wie content/modules/. Der Papier-Wissenstest in Sektion 6
 * der Modul-MD ist eine optionale Trainer-Variante für den Präsenzeinsatz.
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-basiert
  explanation: string;
}

const QUIZZES_DIR = path.join(process.cwd(), "content", "quizzes");

export function getQuizForModule(moduleId: string): QuizQuestion[] {
  const file = path.join(QUIZZES_DIR, `${moduleId.toUpperCase()}.json`);
  if (!fs.existsSync(file)) {
    return [];
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
    return Array.isArray(parsed) ? (parsed as QuizQuestion[]) : [];
  } catch {
    console.error(`Quiz-Datei nicht lesbar/kein gültiges JSON: ${file}`);
    return [];
  }
}
