"use client";

import { Button, Footer, Header } from "@/components";
import { useFetchRegistrationByIdQuery } from "@/service/registrationAPI";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

export default function PaymentPending() {
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
      if (
        registration.status === "Erro no pagamento" ||
        registration.status === "Erro interno"
      ) {
        router.push(`/payment-error/${registrationId}`);
      }
    }
  }, [registration, registrationId, router]);

  const handlePayClick = () => {
    window.open(registration?.payment_url, "_blank")?.focus();
  };

  const handleCopyPaymentUrl = () => {
    try {
      navigator.clipboard.writeText(registration?.payment_url ?? "");
      toast.success("Link de pagamento copiado com sucesso");
    } catch {
      toast.error("Erro ao copiar link de pagamento");
    }
  };

  const handleCancelClick = () => {
    router.push("/events");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex row w-full items-center justify-center gap-20 py-10">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="font-bold text-white mb-1 text-center text-4xl md:text-start md:text-5xl uppercase leading-normal md:leading-normal">
            Estamos
            <br />
            aguardando seu
            <br />
            pagamento
          </h1>
          <span className="font-bold text-white mb-4 text-center text-sm md:text-start leading-normal md:leading-normal">
            Você tem 5 dias para realizar o pagamento,
            <br />
            após isso, sua inscrição será cancelada
          </span>
          <Image
            src="/payment-pending.svg"
            priority
            width={208}
            height={208}
            alt="payment-pending"
            className="w-52 h-52 object-cover my-5 md:hidden"
          />
          <Button
            className="bg-transparent border-white border text-white mt-8 w-full uppercase text-xs h-12 justify-between flex items-center"
            onClick={handleCopyPaymentUrl}
          >
            <span>Copiar Link de pagamento</span>
            <FaRegCopy size={18} />
          </Button>
          <Button
            className="mt-4 w-full uppercase text-xs h-12"
            onClick={handlePayClick}
          >
            Pagar
          </Button>

          <Button
            className="bg-red-600 mt-4 w-full uppercase text-xs h-12"
            onClick={handleCancelClick}
          >
            Voltar
          </Button>
        </div>

        <Image
          src="/payment-pending.svg"
          priority
          width={384}
          height={384}
          alt="payment-pending"
          className="w-96 h-96 object-cover hidden md:block"
        />
      </div>
      <Footer />
    </main>
  );
}
