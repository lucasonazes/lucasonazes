"use client";

import { Button } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNavigateToEvents = () => {
    router.push("/events");
  };

  return (
    <main
      className="flex min-h-screen w-full md:justify-center flex-col md:flex-row"
      style={{ background: "#0C0402" }}
    >
      <Image
        src="/logo.png"
        priority
        width={300}
        height={300}
        alt="Logo"
        className="z-10 absolute top-0 w-72 h-36 object-cover transform -translate-x-1/2 left-1/2 md:left-12 md:translate-x-0"
      />
      <div className="md:hidden">
        <Image
          alt="Hero"
          priority
          src="/hero.png"
          width={960}
          height={384}
          className="object-cover h-96"
        />
        <div
          className="w-full h-96 absolute top-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        />
      </div>
      <div className="md:min-h-screen flex flex-col justify-center w-full items-center md:w-1/2 md:ml-28 md:items-start py-8 md:pt-32 md:pb-8 ">
        <h1 className="font-bold text-white mb-4 text-center text-3xl md:text-start md:text-5xl">
          “Vocês me
          <br />
          procurarão e me
          <br />
          acharão quando
          <br />
          me procurarem de
          <br />
          todo o coração.”
        </h1>
        <span className="text-white mb-10">Jeremias 29: 13</span>
        <Button onClick={handleNavigateToEvents} outlined className="w-fit">
          Buscar Evento
        </Button>
      </div>
      <div className="w-1/2 min-h-screen relative hidden md:block">
        <Image
          alt="Hero"
          priority
          src="/hero.png"
          width={960}
          height={1083}
          className="object-cover h-full"
        />
      </div>
    </main>
  );
}
