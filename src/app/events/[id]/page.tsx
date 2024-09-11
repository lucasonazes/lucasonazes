"use client";

import Image from "next/image";
import { Button, ConfirmationModal, Footer, Header } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { compareDesc, format, isSameDay, parseISO } from "date-fns";
import {
  MdPlace,
  MdCalendarMonth,
  MdOutlineAttachMoney,
  MdWatch,
} from "react-icons/md";
import { getAccessToken, getTokenCookie, getUser } from "@/store/authSlice";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useFetchEventByIdQuery } from "@/service/eventAPI";
import {
  RegistrationResponse,
  useFetchRegistrationsQuery,
  useRegisterToEventMutation,
} from "@/service/registrationAPI";
import Popup from "reactjs-popup";

export type EventFormT = {
  room: string;
  church: string;
  special_needs: string;
};

export default function Event() {
  const router = useRouter();
  const params = useParams();
  const eventId: string = params.id as string;
  const user = useAppSelector(getUser);
  const token = useAppSelector(getAccessToken);
  const tokenCookie = getTokenCookie();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { data: event } = useFetchEventByIdQuery({ id: eventId });
  const [registerToEvent] = useRegisterToEventMutation();
  const { data: registrations } = useFetchRegistrationsQuery(undefined, {
    skip: !token,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EventFormT>();

  useEffect(() => {
    if (!token && !tokenCookie) {
      router.push(`/sign-in?next=/events/${eventId}`);
    }
  }, [router, token, tokenCookie, eventId]);

  const memoizedRegistration: RegistrationResponse | undefined = useMemo(() => {
    if (!registrations) {
      return undefined;
    }
    const registration = registrations
      .filter((res) => res.event === eventId)
      .sort((a, b) =>
        compareDesc(new Date(a.created_at), new Date(b.created_at))
      )[0];

    if (registration?.status === "Pagamento Realizado") {
      setValue("church", registration.church);
      setValue("room", registration.retreat_config.room_name);
      setValue("special_needs", registration.special_needs);
    }
    return registration;
  }, [registrations, eventId, setValue]);

  useEffect(() => {
    if (memoizedRegistration) {
      if (memoizedRegistration.status === "Aguardando Pagamento") {
        router.push(`/payment-pending/${memoizedRegistration._id}`);
      } else if (memoizedRegistration.status === "Erro no pagamento") {
        router.push(`/payment-error/${memoizedRegistration._id}`);
      }
    }
  }, [router, memoizedRegistration]);

  const memoizedRooms = useMemo(() => {
    if (
      !event?.retreat_config.rooms ||
      event.retreat_config.rooms.length === 0
    ) {
      return [];
    }
    return event.retreat_config.rooms.filter((room) => {
      if (
        room.gender &&
        room.gender === user?.gender &&
        room.max_number_of_people > 0 &&
        room.available_spots >= 0
      ) {
        return true;
      } else {
        return false;
      }
    });
  }, [event, user]);

  const handleAddressClick = () => {
    window
      .open(`http://maps.google.com/?q=${event?.address}`, "_blank")
      ?.focus();
  };

  const handleCheckIn = () => {
    if (
      memoizedRegistration?.status === "Pagamento Realizado" &&
      event?.start_date
    ) {
      if (isSameDay(new Date(event?.start_date!), new Date())) {
        // TODO: Check in logic
      } else {
        toast("Check-in ficará disponível no dia do evento!");
      }
    }
  };

  const handleCloseModal = () => setIsConfirmationModalOpen(false);

  const onSubmit: SubmitHandler<EventFormT> = (data) => {
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    handleCloseModal();
    const data = getValues();
    const res = await registerToEvent({
      event: eventId,
      church: data.church,
      special_needs: data.special_needs,
      retreat_config: {
        room_name: data.room,
      },
    }).unwrap();
    if (res) {
      router.push(`/payment-pending/${res._id}`);
      toast.success(
        "Inscrição concluída! Estamos aguardando seu pagamento para confirmar sua participação."
      );
      reset();
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-between items-center bg-graceGreen">
      <Header />
      <div className="min-h-screen w-full md:w-[700px] bg-white">
        {event && (
          <>
            {event?.header_url && (
              <Image
                src={event?.header_url}
                width={700}
                height={208}
                alt="event-image"
                className="w-[700px] h-52 object-cover"
              />
            )}
            <div className="w-full flex flex-col md:flex-row justify-between py-5 px-6 bg-graceBlack">
              <span className="text-lg font-semibold text-white flex items-center mb-2 md:mb-0 md:max-w-80">
                {event?.name}
              </span>
              <div className="md:max-w-80 flex flex-col">
                {event?.address && (
                  <Button
                    link
                    onClick={handleAddressClick}
                    className="text-start font-normal !p-0 text-base text-white flex items-start my-1"
                  >
                    <MdPlace
                      color="#FFFFFF"
                      size={16}
                      className="mr-2 min-w-4 min-h-4 mt-1"
                    />
                    {event?.address}
                  </Button>
                )}
                {event?.start_date && (
                  <span className="text-base text-white flex items-start my-1">
                    <MdCalendarMonth
                      color="#FFFFFF"
                      size={16}
                      className="mr-2 min-w-4 min-h-4 mt-1"
                    />
                    {format(parseISO(event?.start_date), "dd/MM/yyyy")} -{" "}
                    {format(parseISO(event?.start_date), "kk:mm")} (Entrada)
                  </span>
                )}
                {event?.end_date && (
                  <span className="text-base text-white flex items-start my-1">
                    <MdCalendarMonth
                      color="#FFFFFF"
                      size={16}
                      className="mr-2 min-w-4 min-h-4 mt-1"
                    />
                    {format(parseISO(event?.end_date), "dd/MM/yyyy")} -{" "}
                    {format(parseISO(event?.end_date), "kk:mm")} (Saída)
                  </span>
                )}
                {event?.price && (
                  <span className="text-base text-white flex items-start my-1">
                    <MdOutlineAttachMoney
                      color="#FFFFFF"
                      size={16}
                      className="mr-2 min-w-4 min-h-4 mt-1"
                    />
                    R${event?.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full p-6 bg-white">
              <span
                className="text-base text-graceBlack mb-6"
                dangerouslySetInnerHTML={{ __html: event.description }}
              ></span>
              <form onSubmit={handleSubmit(onSubmit)}>
                <select
                  disabled={Boolean(
                    memoizedRegistration?.status === "Pagamento Realizado"
                  )}
                  className={`bg-white rounded border border-graceBlack px-3 w-full h-12 mt-6 disabled:opacity-50 disabled:bg-gray-200 ${
                    errors.room ? "!border-red-600" : ""
                  } ${watch("room") ? "text-gray-black" : "text-gray-400"}`}
                  {...register("room", { required: "Quarto Obrigatório" })}
                >
                  <option value="">Quarto / Líder*</option>
                  {memoizedRooms.map((room) => (
                    <option
                      disabled={room.available_spots === 0}
                      key={room.room_name}
                      value={room.room_name}
                    >
                      {room.room_name} / {room.room_leader} (
                      {room.available_spots} vagas)
                    </option>
                  ))}
                </select>
                {errors.room && (
                  <span className="text-red-600 text-xs">
                    {errors.room.message}
                  </span>
                )}
                <input
                  disabled={Boolean(
                    memoizedRegistration?.status === "Pagamento Realizado"
                  )}
                  autoComplete="name"
                  className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-2 disabled:opacity-50 disabled:bg-gray-200 ${
                    errors.church ? "!border-red-600" : ""
                  }`}
                  placeholder="Igreja"
                  {...register("church")}
                />
                {errors.church && (
                  <span className="text-red-600 text-xs">Igreja inválida</span>
                )}
                <textarea
                  disabled={Boolean(
                    memoizedRegistration?.status === "Pagamento Realizado"
                  )}
                  autoComplete="off"
                  className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-24 mt-2 disabled:opacity-50 disabled:bg-gray-200 ${
                    errors.special_needs ? "!border-red-600" : ""
                  }`}
                  placeholder="Possui alguma necessidade especial?"
                  {...register("special_needs")}
                />
                {errors.special_needs && (
                  <span className="text-red-600 text-xs">
                    Necessidades inválidas
                  </span>
                )}
                {Boolean(
                  memoizedRegistration?.status === "Pagamento Realizado"
                ) ? (
                  <Button
                    onClick={handleCheckIn}
                    type="button"
                    className="w-full uppercase text-xs h-12 mt-6"
                  >
                    Realizar check-in
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full uppercase text-xs h-12 mt-6"
                  >
                    Ir Para Pagamento
                  </Button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
      <Footer />
      <Popup
        overlayStyle={{ background: "#00000080" }}
        open={isConfirmationModalOpen}
        closeOnDocumentClick
        onClose={handleCloseModal}
      >
        <ConfirmationModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmRegistration}
        />
      </Popup>
    </main>
  );
}
