"use client";

import Image from "next/image";
import { Button } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setAccessToken } from "@/store/authSlice";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "@/service/userAPI";

export type PasswordRecoverForm = {
  password: string;
  passwordConfirmation: string;
};

export default function PasswordRecover() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();
  const [updatePassword] = useUpdatePasswordMutation();

  useEffect(() => {
    if (token) {
      dispatch(setAccessToken(token));
    }
  }, [dispatch, token]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordRecoverForm>();

  const onSubmit: SubmitHandler<PasswordRecoverForm> = async (data) => {
    if (data.password !== data.passwordConfirmation) {
      toast.error("Senhas diferentes!");
      return;
    }
    const res = await updatePassword({ password: data.password }).unwrap();
    if (res) {
      router.push("/sign-in");
      toast.success("Senha atualizada com sucesso");
      reset();
    }
  };

  return (
    <main className="flex min-h-screen w-full h-full flex-col justify-center items-center">
      <div className="px-12 py-8 flex flex-col bg-white w-full md:w-96 items-center md:rounded-2xl md:my-10">
        <Image
          src="/logo.png"
          priority
          alt="Logo"
          width={320}
          height={56}
          className="object-cover w-80 h-16 bg-graceBlack rounded-2xl"
        />
        <span className="text-md text-center mt-6">
          Redefina a sua senha e volte a
          <br />
          desfrutar de nossa plataforma
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            autoComplete="off"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-6 ${
              errors.password ? "!border-red-600" : ""
            }`}
            placeholder="Senha*"
            type="password"
            {...register("password", {
              required: "Senha Obrigatória",
              minLength: {
                value: 10,
                message: "Senha deve conter mais de 10 caracteres",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-600 text-xs">
              {errors.password.message}
            </span>
          )}
          <input
            autoComplete="new-password"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-2 ${
              errors.passwordConfirmation ? "!border-red-600" : ""
            }`}
            placeholder="Confirmar Senha*"
            type="password"
            {...register("passwordConfirmation", {
              required: "Senha Obrigatória",
              minLength: {
                value: 10,
                message: "Senha deve conter mais de 10 caracteres",
              },
            })}
          />
          {errors.passwordConfirmation && (
            <span className="text-red-600 text-xs">
              {errors.passwordConfirmation.message}
            </span>
          )}
          <Button type="submit" className="w-full uppercase text-xs h-12 mt-6">
            Redefinir senha
          </Button>
        </form>
      </div>
    </main>
  );
}
