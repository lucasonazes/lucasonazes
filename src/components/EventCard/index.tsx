"use client";

import React from "react";
import Image from "next/image";
import {
  MdPlace,
  MdCalendarMonth,
  MdOutlineAttachMoney,
  MdOutlineAssignment,
  MdCheck,
} from "react-icons/md";
import Button from "../Button";
import { format, parseISO } from "date-fns";
import { EventRegistrationStatus } from "@/service/registrationAPI";

export interface EventCardProps {
  name: string;
  place: string;
  date: string;
  headerImage: string;
  price: number;
  spots?: number;
  status?: EventRegistrationStatus;
  onClick: () => void;
}

export default function EventCard({
  name,
  place,
  date,
  headerImage,
  price,
  spots,
  status,
  onClick,
}: EventCardProps) {
  const handleCardClick = () => {
    onClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-80 md:w-72 h-80 relative rounded-lg border-2 border-white md:mx-2 my-2 cursor-pointer transition-all duration-500 md:hover:scale-105"
    >
      {status && (
        <div
          className={`${
            status === "Pagamento Realizado"
              ? "bg-graceGreen"
              : status === "Aguardando Pagamento"
              ? "bg-yellow-400"
              : "bg-red-500"
          } text-graceBlack text-xs font-semibold px-3 py-1 rounded-full absolute top-3 right-3 border border-white shadow-xl`}
        >
          {status === "Pagamento Realizado"
            ? "Inscrito"
            : status === "Cancelada"
            ? "Pagamento Expirou"
            : status}
        </div>
      )}
      <Image
        priority
        src={headerImage}
        width={288}
        height={208}
        alt="event-image"
        className="w-80 md:w-72 h-40 object-cover rounded-ss-md rounded-se-md"
      />
      <div className="w-full h-32 flex flex-col py-2 px-4">
        <h2 className="font-semibold text-lg text-white">
          {name?.length > 30 ? `${name.slice(0, 30)}...` : name}
        </h2>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="w-4/5 flex flex-col">
            <span className="text-base text-white flex items-center">
              <MdPlace color="#FFFFFF" size={14} className="mr-2" />
              {place?.length > 20 ? `${place.slice(0, 20)}...` : place}
            </span>
            <span className="text-base text-white flex items-center">
              <MdCalendarMonth color="#FFFFFF" size={14} className="mr-2" />
              {format(parseISO(date), "dd/MM/yyyy")}
            </span>
            <span className="text-base text-white flex items-center">
              <MdOutlineAttachMoney
                color="#FFFFFF"
                size={14}
                className="mr-2"
              />
              R${price.toFixed(2)}
            </span>
            {spots && (
              <span className="text-base text-white flex items-center">
                <MdCheck color="#FFFFFF" size={14} className="mr-2" />
                {spots} vagas
              </span>
            )}
          </div>
          <Button className="rounded-full" onClick={handleCardClick}>
            {status && status === "Pagamento Realizado" ? (
              <MdCheck size={15} color="#111111" />
            ) : (
              <MdOutlineAssignment size={15} color="#111111" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
