"use client";

import { Button, Footer, Header } from "@/components";
import { useFetchRegistrationByIdQuery } from "@/service/registrationAPI";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentError() {
  const router = useRouter();
  const params = useParams();
  const registrationId: string = params.id as string;

  const { data: registration } = useFetchRegistrationByIdQuery(
    {
      id: registrationId,
    },
    { pollingInterval: 15000 }
  );

  useEffect(() => {
    if (registration) {
      if (registration.status === "Pagamento Realizado") {
        router.push(`/payment-success/${registrationId}`);
      }
    }
  }, [registration, registrationId, router]);

  const handleTryAgainClick = () => {
    window.open(registration?.payment_url, "_blank")?.focus();
  };

  const handleCancelClick = () => {
    router.push("/events");
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex row w-full items-center justify-center gap-20 py-10">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="font-bold text-white mb-4 text-center text-4xl md:text-start md:text-5xl uppercase leading-normal md:leading-normal">
            Ocorreu um
            <br />
            problema com
            <br />
            seu pagamento
          </h1>
          <Image
            src="/payment-error.svg"
            priority
            width={208}
            height={208}
            alt="payment-error"
            className="w-52 h-52 object-cover my-5 md:hidden"
          />
          <Button
            className="mt-8 w-full uppercase text-xs h-12"
            onClick={handleTryAgainClick}
          >
            Tentar Novamente
          </Button>
          <Button
            className="bg-red-600 mt-4 w-full uppercase text-xs h-12"
            onClick={handleCancelClick}
          >
            Voltar
          </Button>
        </div>

        <Image
          src="/payment-error.svg"
          priority
          width={384}
          height={384}
          alt="payment-error"
          className="w-96 h-96 object-cover hidden md:block"
        />
      </div>
      <Footer />
    </main>
  );
}
