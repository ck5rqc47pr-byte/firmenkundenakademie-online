import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  PortraitRoland,
  PortraitDrSchreiber,
  PortraitProfBrandt,
  PortraitArmin,
  PortraitPraktikant,
} from "@/components/Portraits";

export const metadata: Metadata = {
  title: "Team – FKB Campus",
  description: "Das Team hinter der Firmenkundenakademie: Benedikt Zoller und spezialisierte KI-Agenten.",
};

type TeamMember = {
  name: string;
  typ: "Mensch" | "KI-Agent";
  rolle: string;
  eigenschaften: string[];
  aufgabe: string;
  modell?: string;
  avatarBg?: string;
  avatarFg?: string;
  initials: string;
  Portrait?: React.FC<{ size?: number }>;
  photo?: string;
};

const TEAM: TeamMember[] = [
  {
    name: "Benedikt Zoller",
    initials: "BZ",
    avatarBg: "#1F2B56",
    avatarFg: "#F8F8FA",
    typ: "Mensch",
    rolle: "Gründer & Programmverantwortlicher",
    eigenschaften: [
      "Bankpraktiker und Akademieentwickler",
      "Spezialist für Firmenkundengeschäft im Verbund",
      "Erfahrung in Trainerausbildung und Didaktikdesign",
      "Verbindet Bankwelt, Wissenschaft und digitale Produkte",
    ],
    aufgabe:
      "Benedikt verantwortet das Gesamtprogramm: Modulkonzeption, Qualitätsstandards, Vermarktung und Weiterentwicklung der Akademie. Er gibt die inhaltliche Richtung vor und trifft alle strategischen Entscheidungen.",
  },
  {
    name: "Roland",
    initials: "RO",
    avatarBg: "#D9BF7A",
    avatarFg: "#191D2E",
    Portrait: PortraitRoland,
    photo: "/team/roland.webp",
    typ: "KI-Agent",
    rolle: "Content Creator · Modul- und Unterlagenentwicklung",
    eigenschaften: [
      "Zertifizierter Bankfachtrainer (IHK)",
      "15+ Jahre Firmenkundengeschäft (VR-Banken)",
      "Vertraut mit MaRisk, CRR/CRD, BelWertV und InsO",
      "Didaktisch ausgebildet auf Akademieniveau",
    ],
    aufgabe:
      "Erstellt Trainerhandbücher, Teilnehmerunterlagen, Praxisfälle und Übungen. Formuliert Lernziele nach Bloom-Taxonomie und strukturiert Module nach dem Kirkpatrick-Modell. Setzt Feedback aus den Reviews in überarbeitete Modulversionen um.",
    modell: "Claude Haiku 4.5",
  },
  {
    name: "Dr. Schreiber",
    initials: "DS",
    avatarBg: "#1F2B56",
    avatarFg: "#F8F8FA",
    Portrait: PortraitDrSchreiber,
    photo: "/team/dr_schreiber.webp",
    typ: "KI-Agent",
    rolle: "Scientific Writer · Wissenschaftliche Fundierung & Literaturrecherche",
    eigenschaften: [
      "Expertise in Bankbetriebslehre und Kompetenzforschung",
      "Akademisch-präziser Schreibstil auf Hochschulniveau",
      "Zitiert ausschließlich Primärquellen (APA 7)",
      "Kennt EuroFH, Gabler, Springer und Verbundpublikationen",
    ],
    aufgabe:
      "Entwickelt das Rahmenkonzept, schreibt Literaturreviews und liefert die theoretische Einordnung jedes Kompetenzfeldes. Recherchiert Primärquellen aus Fachzeitschriften und Hochschulstandard-Literatur und pflegt das zentrale Quellenverzeichnis.",
    modell: "Claude Sonnet 4.6",
  },
  {
    name: "Prof. Dr. Brandt",
    initials: "PB",
    avatarBg: "#191D2E",
    avatarFg: "#D9BF7A",
    Portrait: PortraitProfBrandt,
    photo: "/team/prof_brandt.webp",
    typ: "KI-Agent",
    rolle: "Wissenschaftlicher Reviewer",
    eigenschaften: [
      "Senior-Prüfer mit 15+ Jahren Firmenkundenexpertise",
      "Spezialist für Hochschuldidaktik und wissenschaftliches Arbeiten",
      "Prüft Bloom-Taxonomie, Dreyfus-Modell und Quellenqualität",
      "Kennt regulatorische Standards (MaRisk, KWG, CRR)",
    ],
    aufgabe:
      "Prüft jedes Modul nach Fertigstellung auf fachliche Korrektheit, Quellenqualität, Lernzielformulierung, didaktische Stringenz und Prüfungseignung. Gibt strukturierte Befunde mit Priorität und Verbesserungsvorschlägen zurück.",
    modell: "Claude Haiku 4.5",
  },
  {
    name: "Armin",
    initials: "AR",
    avatarBg: "#5C6B3A",
    avatarFg: "#F8F8FA",
    Portrait: PortraitArmin,
    photo: "/team/armin.webp",
    typ: "KI-Agent",
    rolle: "Praxis-Reviewer",
    eigenschaften: [
      "25 Jahre Firmenkundenberater bei einer regionalen VR-Bank",
      "Hat hunderte Kreditgespräche geführt und Jahresabschlüsse analysiert",
      "Denkt in Kundengesprächen, nicht in Lehrbüchern",
      "Kennt den Alltag im genossenschaftlichen Verbund aus erster Hand",
    ],
    aufgabe:
      "Bewertet Module aus der Perspektive des Praktikers: Sind die Inhalte alltagstauglich? Wären die Fälle so lösbar? Käme ein Berater damit am nächsten Tag besser ins Gespräch? Prüft Verständlichkeit, Praxisrelevanz und Vollständigkeit – ohne Rücksicht auf akademische Konventionen.",
    modell: "Claude Sonnet 4.6",
  },
  {
    name: "Praktikant 1",
    initials: "P1",
    avatarBg: "#8A97B0",
    avatarFg: "#F8F8FA",
    Portrait: PortraitPraktikant,
    photo: "/team/praktikant.webp",
    typ: "KI-Agent",
    rolle: "Formatter · Dokumentproduktion & Corporate Design",
    eigenschaften: [
      "Spezialist für VR-Banken Corporate Design",
      "Erzeugt DOCX, PPTX und XLSX aus Markdown-Quellen",
      "Beherrscht python-docx, python-pptx und openpyxl",
      "Setzt CI-Vorgaben pixelgenau um: #003DA5, #E05B00, Arial",
    ],
    aufgabe:
      "Wandelt freigegebene Modulinhalte in produktionsfertige Dokumente um. Erstellt Trainerhandbücher als DOCX, Präsentationen als PPTX und Arbeitsmaterialien als XLSX — stets im VR-Banken CI und ohne inhaltliche Veränderungen.",
    modell: "Claude Sonnet 4.6",
  },
];

function TypBadge({ typ }: { typ: TeamMember["typ"] }) {
  if (typ === "Mensch") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ink-2 inline-block" />
        Mensch
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
      KI-Agent
    </span>
  );
}

export default function TeamPage() {
  const menschen = TEAM.filter((m) => m.typ === "Mensch");
  const agenten = TEAM.filter((m) => m.typ === "KI-Agent");

  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3">
            Firmenkundenakademie
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-normal leading-tight tracking-[-0.03em] text-white">
            Das Team
          </h1>
          <p className="mt-4 text-sm text-white/70 max-w-xl leading-relaxed">
            Die Firmenkundenakademie entsteht im Zusammenspiel von Bankpraktiker-Expertise
            und spezialisierten KI-Agenten — jeder mit klar definierter Rolle und Verantwortung.
          </p>
        </div>
      </section>

      {/* Mensch */}
      <div className="mx-auto max-w-content px-6 lg:px-14 py-16 space-y-20">
        <section>
          <div className="border-b border-ink pb-4 mb-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-1">
              Programmverantwortung
            </div>
            <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-ink">
              Mensch
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {menschen.map((m) => (
              <MemberCard key={m.name} member={m} featured />
            ))}
          </div>
        </section>

        {/* KI-Agenten */}
        <section>
          <div className="border-b border-ink pb-4 mb-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-1">
              Spezialisierte Rollen
            </div>
            <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-ink">
              KI-Agenten
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {agenten.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>
        </section>
      </div>

      {/* Wie wir zusammenarbeiten */}
      <section className="border-t border-ink bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-3">
            Workflow
          </div>
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-ink mb-8">
            Wie wir zusammenarbeiten
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { nr: "01", agent: "Dr. Schreiber", action: "Literaturrecherche & theoretische Grundlage" },
              { nr: "02", agent: "Roland", action: "Modulerstellung & Unterlagenentwicklung" },
              { nr: "03", agent: "Prof. Dr. Brandt", action: "Wissenschaftliches Review" },
              { nr: "04", agent: "Armin", action: "Praxisreview & Alltagstauglichkeit" },
              { nr: "05", agent: "Praktikant 1", action: "Finale Dokumente & Präsentationen" },
            ].map((step) => (
              <div key={step.nr} className="border border-ink bg-white p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-primary mb-2">
                  Schritt {step.nr}
                </div>
                <div className="font-mono text-[11px] font-semibold text-ink mb-1.5">
                  {step.agent}
                </div>
                <div className="text-xs text-ink-2 leading-relaxed">
                  {step.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink bg-white">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-1">
              Kontakt
            </div>
            <p className="text-sm text-ink-2 max-w-md">
              Fragen zum Programm oder zur Zusammenarbeit? Benedikt freut sich über eine direkte Nachricht.
            </p>
          </div>
          <a
            href="mailto:info@benedikt-zoller.de"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] bg-primary text-white px-6 py-3 hover:bg-primary/90 transition shrink-0"
          >
            Kontakt aufnehmen →
          </a>
        </div>
      </section>
    </div>
  );
}

function Avatar({ member, featured }: { member: TeamMember; featured: boolean }) {
  const size = featured ? 96 : 72;
  const fontSize = featured ? 28 : 20;
  const bg = member.avatarBg ?? "#1F2B56";
  const fg = member.avatarFg ?? "#F8F8FA";
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={size} height={size} fill={bg} />
      <text
        x={size / 2}
        y={size / 2 + fontSize * 0.38}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={fontSize}
        fontWeight="400"
        fill={fg}
        letterSpacing="-0.02em"
      >
        {member.initials}
      </text>
    </svg>
  );
}

function MemberCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  if (member.photo) {
    return (
      <div className="border border-ink bg-white overflow-hidden flex flex-col sm:flex-row">
        {/* Foto: oben auf Mobile, links auf Desktop */}
        <div className="relative w-full h-64 sm:w-[180px] sm:h-auto sm:self-stretch shrink-0">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        </div>
        {/* Content */}
        <div className="p-6 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <TypBadge typ={member.typ} />
            <h3 className={`font-serif font-normal tracking-[-0.02em] text-ink mt-2 ${featured ? "text-3xl" : "text-xl"}`}>
              {member.name}
            </h3>
            <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3 mt-1 leading-snug">
              {member.rolle}
            </div>
            {member.modell && (
              <div className="inline-flex border border-line px-2 py-1 mt-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-3 mr-1.5">Modell</span>
                <span className="font-mono text-[9px] text-ink-2">{member.modell}</span>
              </div>
            )}
            <p className="text-ink-2 leading-relaxed mt-4 text-sm">
              {member.aufgabe}
            </p>
          </div>
          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-2">
              Eigenschaften
            </div>
            <ul className="space-y-1.5">
              {member.eigenschaften.map((e) => (
                <li key={e} className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="text-primary mt-0.5 shrink-0 font-mono text-xs">▸</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Standard-Layout mit SVG-Portrait
  return (
    <div className="border border-ink bg-white overflow-hidden">
      <div
        className="h-2 w-full"
        style={{ backgroundColor: member.avatarBg ?? "#1F2B56" }}
      />
      <div className={`${featured ? "p-8 lg:p-10" : "p-6 lg:p-8"}`}>
        <div className="flex items-start gap-4 mb-5">
          <div className="shrink-0 mt-0.5 border border-line overflow-hidden">
            {member.Portrait ? (
              <member.Portrait size={featured ? 96 : 72} />
            ) : (
              <Avatar member={member} featured={featured} />
            )}
          </div>
          <div className="min-w-0">
            <TypBadge typ={member.typ} />
            <h3 className={`font-serif font-normal tracking-[-0.02em] text-ink mt-2 ${featured ? "text-3xl" : "text-xl"}`}>
              {member.name}
            </h3>
            <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3 mt-1 leading-snug">
              {member.rolle}
            </div>
            {member.modell && (
              <div className="inline-flex border border-line px-2 py-1 mt-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-3 mr-1.5">Modell</span>
                <span className="font-mono text-[9px] text-ink-2">{member.modell}</span>
              </div>
            )}
          </div>
        </div>
        <p className={`text-ink-2 leading-relaxed mb-6 ${featured ? "text-sm max-w-2xl" : "text-sm"}`}>
          {member.aufgabe}
        </p>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-3">
            Eigenschaften
          </div>
          <ul className="space-y-1.5">
            {member.eigenschaften.map((e) => (
              <li key={e} className="flex items-start gap-2.5 text-sm text-ink-2">
                <span className="text-primary mt-0.5 shrink-0 font-mono text-xs">▸</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
