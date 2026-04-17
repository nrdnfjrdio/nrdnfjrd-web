"use client";

import { useState } from "react";

interface ContactFormProps {
  t: {
    title: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    submit: string;
    success: string;
    error: string;
  };
  onSuccess: () => void;
}

export default function ContactForm({ t, onSuccess }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      onSuccess();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-[#F5A623] font-mono text-sm mt-4 animate-fade-in">
        {t.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-sm">
      <h3 className="text-lg font-bold text-[#F0EDE6]">{t.title}</h3>
      {(["name", "company", "email", "phone"] as const).map((field) => (
        <input
          key={field}
          type={field === "email" ? "email" : "text"}
          placeholder={t[field]}
          value={form[field]}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          required={field !== "phone"}
          className="w-full bg-transparent border border-[#F0EDE6]/20 px-3 py-2 text-sm font-mono text-[#F0EDE6] placeholder-[#F0EDE6]/30 focus:outline-none focus:border-[#F5A623] transition-colors"
        />
      ))}
      {status === "error" && (
        <p className="text-red-400 text-xs font-mono">{t.error}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2.5 bg-[#F5A623] text-[#0D1117] font-bold hover:bg-[#F5A623]/90 disabled:opacity-50 transition-colors font-mono text-sm"
      >
        {status === "loading" ? "..." : t.submit}
      </button>
    </form>
  );
}
