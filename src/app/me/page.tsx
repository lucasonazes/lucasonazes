"use client";

import { Button, Footer, Header } from "@/components";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  EventRegistrationStatus,
  useFetchRegistrationsQuery,
} from "@/service/registrationAPI";
import {
  getAccessToken,
  getTokenCookie,
  getUser,
  logout,
} from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import { FaUser, FaPhone, FaRegCalendar } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useFetchEventsQuery } from "@/service/eventAPI";
import { compareDesc } from "date-fns";

export default function Me() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const token = useAppSelector(getAccessToken);
  const tokenCookie = getTokenCookie();
  const { data: registrations } = useFetchRegistrationsQuery(undefined, {
    skip: !token,
  });
  const { data: events } = useFetchEventsQuery(undefined);

  const memoizedRegistrations = useMemo(() => {
    if (!registrations) {
      return [];
    }
    if (!events) {
      return registrations.map((reg) => ({
        ...reg,
        event: undefined,
      }));
    }
    return registrations
      .map((reg) => {
        const event = events.find((ev) => reg.event === ev._id);
        if (event) {
          return {
            ...reg,
            event,
          };
        }
        return { ...reg, event: undefined };
      })
      .sort((a, b) =>
        compareDesc(new Date(a.created_at), new Date(b.created_at))
      );
  }, [events, registrations]);

  useEffect(() => {
    if (!token && !tokenCookie) {
      router.push("/sign-in?next=/me");
    }
  }, [router, token, tokenCookie]);

  const handleEventClick = (
    eventId: string,
    status: EventRegistrationStatus,
    registrationId: string
  ) => {
    if (status === "Pagamento Realizado") {
      router.push(`/events/${eventId}`);
      return;
    }
    if (status === "Aguardando Pagamento") {
      router.push(`/payment-pending/${registrationId}`);
      return;
    }
    router.push(`/payment-error/${registrationId}`);
  };

  const handleLogOut = () => {
    router.push("/");
    setTimeout(() => dispatch(logout()), 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="min-h-screen w-full md:w-[500px] py-5">
        {user && (
          <>
            <h1 className="text-white font-semibold text-xl mb-2">
              Meus Dados:
            </h1>
            <div className="bg-white mb-4 rounded-2xl py-5 px-4 flex flex-row items-center">
              <div className="flex pl-5 pr-8 items-center justify-center">
                {user?.gender === "masculino" ? (
                  <FcBusinessman size={100} />
                ) : (
                  <FcBusinesswoman size={100} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base text-graceBlack flex items-start my-1">
                  <FaUser
                    color="#111111"
                    size={16}
                    className="mr-2 min-w-4 min-h-4 mt-1"
                  />
                  {user?.name}
                </span>
                <span className="text-base text-graceBlack flex items-start my-1">
                  <MdOutlineEmail
                    color="#111111"
                    size={16}
                    className="mr-2 min-w-4 min-h-4 mt-1"
                  />
                  {user?.email}
                </span>
                <span className="text-base text-graceBlack flex items-start my-1">
                  <FaPhone
                    color="#111111"
                    size={16}
                    className="mr-2 min-w-4 min-h-4 mt-1"
                  />
                  {user?.phone}
                </span>
                <span className="text-base text-graceBlack flex items-start my-1">
                  <FaRegCalendar
                    color="#111111"
                    size={16}
                    className="mr-2 min-w-4 min-h-4 mt-1"
                  />
                  {user.birth_date.replaceAll("-", "/")}
                </span>
              </div>
            </div>
          </>
        )}
        {memoizedRegistrations.length > 0 && (
          <>
            <h1 className="text-white font-semibold text-xl mb-2">
              Minhas inscrições:
            </h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-graceBlack uppercase bg-graceGreen">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Evento
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedRegistrations.map((reg) => (
                    <tr
                      key={reg._id}
                      onClick={() =>
                        handleEventClick(
                          reg.event?._id ?? "",
                          reg.status,
                          reg._id
                        )
                      }
                      className="bg-white border-b hover:opacity-90 hover:cursor-pointer transition-all duration-500"
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 font-medium text-graceBlack whitespace-nowrap"
                      >
                        {reg.event?.name}
                      </th>
                      <td className="px-4 py-4">{reg.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <Button
          onClick={handleLogOut}
          className="bg-red-600 mt-6 uppercase text-xs h-12 w-full text-white"
        >
          Sair
        </Button>
      </div>
      <Footer />
    </main>
  );
}
