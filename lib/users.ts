export type UserRole = "admin" | "trainer" | "teilnehmer";

export interface AppUser {
  id: string;
  name: string;
  login: string;
  passwordHash: string;
  role: UserRole;
}

// Passwörter ändern: node -e "const b=require('bcryptjs'); console.log(b.hashSync('NeuesPasswort', 10));"
// Dann den Hash unten ersetzen und neu deployen.
export const USERS: AppUser[] = [
  {
    id: "1",
    name: "Benedikt Zoller",
    login: "ben",
    // Standard: Admin2026! — bitte nach erstem Login ändern
    passwordHash: "$2b$10$9zA.EnKADkjSmyMfuSCuJOyB1mtSku.Di9M4/9doOq8CLmwC1eLNy",
    role: "admin",
  },
  {
    id: "2",
    name: "Test Trainer",
    login: "trainer",
    // Standard: Trainer2026!
    passwordHash: "$2b$10$iiJGkwMt.a.4SwyWa7DYHudsDychbRb9z/fbm8//3ub1848O2LzAW",
    role: "trainer",
  },
  {
    id: "3",
    name: "Test Teilnehmer",
    login: "teilnehmer",
    // Standard: Campus2026!
    passwordHash: "$2b$10$hz4Bsh0ODecG7S45ZSH35uwJF828X8enMX690sCbfsk4A7EWZeg/y",
    role: "teilnehmer",
  },
];

export function findUserByLogin(login: string): AppUser | undefined {
  return USERS.find((u) => u.login === login);
}
