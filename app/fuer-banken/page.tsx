import { redirect } from "next/navigation";

// /fuer-banken wurde mit der Startseite (/) zusammengeführt – die Nav-Position
// „Für Banken" zeigt ohnehin auf /. Dieser Redirect erhält alte Links/Lesezeichen
// und vermeidet doppelten Inhalt (SEO).
export default function FuerBankenPage() {
  redirect("/");
}
