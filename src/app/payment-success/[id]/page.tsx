"use client";

import { Button, Footer, Header } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push("/events");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex row w-full items-center justify-center gap-20 py-10">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="font-bold text-white mb-4 text-center text-4xl md:text-start md:text-5xl uppercase leading-normal md:leading-normal">
            Pagamento
            <br />
            realizado com
            <br />
            sucesso
          </h1>

          <Image
            src="/payment-success.svg"
            priority
            width={208}
            height={208}
            alt="payment-success"
            className="w-52 h-52 object-fit my-5 md:hidden"
          />
          <Button
            className="mt-8 w-full uppercase text-xs h-12"
            onClick={handleExploreClick}
          >
            Explorar mais eventos
          </Button>
        </div>

        <Image
          src="/payment-success.svg"
          priority
          width={500}
          height={384}
          alt="payment-success"
          className="w-120 h-96 object-cover hidden md:block"
        />
      </div>
      <Footer />
    </main>
  );
}
