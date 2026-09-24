"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Field, Flash, inputClass, primaryButton } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: null });
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Flash tone="error">{state.error}</Flash>}
      <Field label="Admin password" htmlFor="password">
        <input id="password" name="password" type="password" required autoFocus autoComplete="current-password" className={inputClass} />
      </Field>
      <button type="submit" disabled={pending} className={`${primaryButton} h-12 w-full`}>
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
