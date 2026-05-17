"use client";

import { actionDeleteUser } from "./actions";

export function DeleteUserButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={actionDeleteUser}
      onSubmit={(e) => {
        if (!confirm(`${name} wirklich löschen?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
      >
        ✕
      </button>
    </form>
  );
}
