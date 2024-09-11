"use client";

import { EventCard, Footer, Header, LogInModal } from "@/components";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useFetchEventsQuery } from "@/service/eventAPI";
import {
  EventRegistrationStatus,
  useFetchRegistrationsQuery,
} from "@/service/registrationAPI";
import { getAccessToken } from "@/store/authSlice";
import { compareDesc } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Popup from "reactjs-popup";

export default function Events() {
  const router = useRouter();
  const token = useAppSelector(getAccessToken);

  const { data: events } = useFetchEventsQuery(undefined);
  const { data: registrations } = useFetchRegistrationsQuery(undefined, {
    skip: !token,
  });

  const memoizedEvents = useMemo(() => {
    if (!events) {
      return [];
    }
    if (!token || !registrations) {
      return events.map((ev) => ({
        ...ev,
        status: undefined,
        registrationId: undefined,
      }));
    }
    return events.map((ev) => {
      const eventRegistrations = registrations.filter(
        (reg) => reg.event === ev._id
      );

      if (eventRegistrations.length > 0) {
        const registration = eventRegistrations.sort((a, b) =>
          compareDesc(new Date(a.created_at), new Date(b.created_at))
        )[0];
        return {
          ...ev,
          status: registration.status,
          registrationId: registration._id,
        };
      }
      return { ...ev, status: undefined, registrationId: undefined };
    });
  }, [events, registrations, token]);

  const [loginModalEvent, setLoginModalEvent] = useState("");

  const handleEventClick = (
    eventId: string,
    status?: EventRegistrationStatus,
    registrationId?: string
  ) => {
    if (!token) {
      setLoginModalEvent(eventId);
      return;
    }
    if (
      !status ||
      !registrationId ||
      status === "Pagamento Realizado" ||
      status === "Cancelada"
    ) {
      router.push(`/events/${eventId}`);
      return;
    }
    if (status === "Aguardando Pagamento") {
      router.push(`/payment-pending/${registrationId}`);
      setLoginModalEvent(eventId);
      return;
    }
    router.push(`/payment-error/${registrationId}`);
  };

  const closeModal = () => setLoginModalEvent("");

  return (
    <main className="flex min-h-screen flex-col justify-between items-center md:items-start">
      <Header />
      <h1 className="text-white font-semibold text-2xl md:pl-10 mt-5">
        Eventos:
      </h1>
      <div className="flex flex-col md:flex-row flex-wrap flex-grow items-center md:items-start md:px-8 pb-10 pt-6">
        {memoizedEvents?.map((event) => (
          <EventCard
            key={event._id}
            name={event.name}
            date={event.start_date}
            headerImage={event.header_url}
            status={event.status}
            place={event.address}
            price={event.price}
            onClick={() =>
              handleEventClick(event._id, event.status, event.registrationId)
            }
          />
        ))}
      </div>
      <Popup
        overlayStyle={{ background: "#00000080" }}
        open={Boolean(loginModalEvent)}
        closeOnDocumentClick
        onClose={closeModal}
      >
        <LogInModal
          onClose={closeModal}
          nextUrl={loginModalEvent ? `/events/${loginModalEvent}` : ""}
        />
      </Popup>
      <Footer />
    </main>
  );
}
