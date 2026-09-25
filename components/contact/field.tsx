"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseProps = { id: string; label: string; error?: string; optional?: boolean };

const fieldClass =
  "peer block w-full border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg text-fg outline-none transition-colors placeholder:text-transparent focus:ring-0";

function Label({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label
      htmlFor={id}
      className="pointer-events-none absolute left-0 top-7 origin-left text-lg text-fg-muted transition-all duration-300 ease-out-expo peer-focus:top-0 peer-focus:scale-75 peer-focus:text-accent-text peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75"
    >
      {label}
      {optional && <span className="ml-2 text-sm text-fg-subtle">(optional)</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return (
    <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-2 min-h-5 text-sm text-danger">
      {error}
    </p>
  );
}

/** Underlined input with a floating label and an animated focus line. */
export function TextField({ id, label, error, optional, className, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <input
          id={id}
          name={id}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(fieldClass, error ? "border-danger" : "border-line-strong")}
          {...props}
        />
        <Label id={id} label={label} optional={optional} />
        <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-expo peer-focus:scale-x-100" />
      </div>
      <ErrorText id={id} error={error} />
    </div>
  );
}

export function TextAreaField({ id, label, error, optional, className, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <textarea
          id={id}
          name={id}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(fieldClass, "min-h-36 resize-y", error ? "border-danger" : "border-line-strong")}
          data-lenis-prevent
          {...props}
        />
        <Label id={id} label={label} optional={optional} />
        <span aria-hidden="true" className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-expo peer-focus:scale-x-100" />
      </div>
      <ErrorText id={id} error={error} />
    </div>
  );
}

/** Accessible pill radio group. */
export function PillGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-4 text-sm text-fg-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const id = `${name}-${opt.replace(/\W+/g, "-")}`;
          const checked = value === opt;
          return (
            <div key={opt}>
              <input
                type="radio"
                id={id}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                data-cursor="hover"
                className={cn(
                  "inline-flex h-10 cursor-pointer select-none items-center rounded-full border px-4 text-sm transition-all duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent-text)] active:scale-95",
                  checked ? "border-transparent bg-fg text-bg" : "border-line-strong text-fg-muted hover:border-fg/50 hover:text-fg",
                )}
              >
                {opt}
              </label>
            </div>
          );
        })}
      </div>
      <ErrorText id={name} error={error} />
    </fieldset>
  );
}
