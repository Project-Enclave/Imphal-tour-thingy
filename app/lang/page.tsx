import type { Metadata } from "next";
import LangClient from "@/components/lang-client";

export const metadata: Metadata = {
  title: "Language & Translation – Manipur Wander",
  description: "Choose your language and explore Manipuri phrases.",
};

export default function LangPage() {
  return <LangClient />;
}
