import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";
import { PiUserCircleCheckBold } from "react-icons/pi";

import Button from "../Button";
import { useAppSelector } from "@/hooks/reduxHooks";
import { getAccessToken, getUser } from "@/store/authSlice";

const Header = () => {
  const router = useRouter();
  const user = useAppSelector(getUser);

  const handleNavigateToHome = () => {
    router.push("/");
  };

  return (
    <div className="w-screen h-20 shadow-md sticky top-0 flex items-center justify-between z-10 pt-12 pb-5 pr-8 bg-graceBlack">
      <Button link onClick={handleNavigateToHome} className="-ml-5">
        <Image
          src="/logo.png"
          priority
          width={300}
          height={100}
          alt="Logo"
          className="w-56 h-24 object-cover"
        />
      </Button>
      <Button
        link
        className="flex items-center"
      >
        {user?.name ? (
          <PiUserCircleCheckBold size={35} color="#FFE9B0" />
        ) : (
          <FaRegUserCircle size={30} color="#FFE9B0" />
        )}
        <span className="text-white ml-2 hidden md:block">
          {user?.name ?? "Entrar/Cadastrar"}
        </span>
      </Button>
    </div>
  );
};

export default Header;
