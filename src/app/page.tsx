"use client";

import { Header, Footer } from "@/components";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col justify-between items-center"
    >
      <Header />
      <p className="text-white">Bem vindo ao meu site</p>
      <Footer />
    </main>
  );
}
