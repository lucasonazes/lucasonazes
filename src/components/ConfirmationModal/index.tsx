"use client";

import React from "react";
import Button from "../Button";
import { IoIosCloseCircleOutline } from "react-icons/io";

export interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ onClose, onConfirm }: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="bg-white max-w-sm p-10 rounded text-center">
      <Button link onClick={onClose} className="absolute right-0 top-1">
        <IoIosCloseCircleOutline color="#111111" size={30} />
      </Button>
      <h1 className="text-2xl uppercase font-bold mt-3">Confirmar inscrição</h1>
      <span className="block text-xl my-5">
        Ao confirmar, você terá 5 dias para concluir o pagamento e garantir sua
        vaga. <br />
        Caso o pagamento não seja efetuado dentro desse prazo, sua inscrição
        será automaticamente cancelada.
      </span>
      <Button
        onClick={handleConfirm}
        className="block mt-7 w-full uppercase text-xs py-2 h-10"
      >
        Confirmar
      </Button>
      <Button
        onClick={handleCancel}
        className="bg-red-600 block mt-2 w-full uppercase text-xs py-2 h-10"
      >
        Cancelar
      </Button>
    </div>
  );
};

export default ConfirmationModal;
