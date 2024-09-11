import React from "react";

import Button from "../Button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHooks";
import { getUser } from "@/store/authSlice";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(getUser);

  const handleNavigateToHome = () => {
    if (pathname === "/events") {
      router.push("/");
    } else {
      router.push("/events");
    }
  };

  return (
    <div className="w-screen bottom-0 flex  justify-between bg-graceGreen z-10 p-8 flex-col items-start md:flex-row md:items-center">
      <Button
        onClick={handleNavigateToHome}
        link
        className="bg-graceBlack rounded h-20 flex items-center justify-center -ml-4"
      >
        <Image
          src="/logo.png"
          priority
          alt="Logo"
          width={200}
          height={100}
          className="object-cover w-52 h-14 bg-graceBlack rounded-2xl"
        />
      </Button>
      <div className="flex justify-center mt-3 flex-col">
        <span className="text-graceBlack font-bold">Navegue</span>
        <Link href="/" className="text-graceBlack hover:text-blue-600">
          Home
        </Link>
        <Link href="/events" className="text-graceBlack hover:text-blue-600 ">
          Eventos
        </Link>
        {!user?.name && (
          <Link
            href="/sign-in"
            className="text-graceBlack hover:text-blue-600 "
          >
            Entrar / Cadastrar
          </Link>
        )}
      </div>

      <div className="flex justify-center mt-3 flex-col">
        <span className="text-graceBlack font-bold">Contato</span>
        <span className="text-graceBlack">gracegateadm@gmail.com</span>
        <span className="text-graceBlack ">(41) 9 9503-6787</span>
      </div>

      <span className="text-graceBlack mt-3 text-sm">
        © 2024 Grace Gate. All rights reserved
      </span>
    </div>
  );
};

export default Footer;
