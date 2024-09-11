"use client";

import React from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";

export interface LogInModalProps {
  onClose: () => void;
  nextUrl?: string;
}

const LogInModal = ({ onClose, nextUrl }: LogInModalProps) => {
  const router = useRouter();

  const handleNavigateToSignIn = () => {
    router.push(!nextUrl ? "/sign-in" : `/sign-in?next=${nextUrl}`);
  };
  return (
    <div className="bg-white max-w-sm p-10 rounded text-center">
      <Button link onClick={onClose} className="absolute right-0 top-1">
        <IoIosCloseCircleOutline color="#111111" size={30} />
      </Button>
      <h1 className="text-2xl uppercase font-bold mt-3">Entre na Plataforma</h1>
      <span className="block text-xl my-5">
        Ao se cadastrar na plataforma, você poderá ficar por dentro e se
        inscrever em quaisquer eventos
      </span>
      <Button
        onClick={handleNavigateToSignIn}
        className="block mt-7 w-full uppercase text-xs py-2 h-10"
      >
        Entrar/Cadastrar
      </Button>
    </div>
  );
};

export default LogInModal;
