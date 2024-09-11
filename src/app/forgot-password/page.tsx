"use client";

import Image from "next/image";
import { Button, Footer, Header } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ResetPasswordT, useResetPasswordMutation } from "@/service/userAPI";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();

  const [resetPassword] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordT>();

  const onSubmit: SubmitHandler<ResetPasswordT> = async (data) => {
    await resetPassword(data).unwrap();
    toast.success("Enviamos o link para seu email");
    reset();
  };

  return (
    <main className="flex min-h-screen flex-col justify-between items-center">
      <Header />
      <div className="px-12 py-8 flex flex-col bg-white w-full md:w-96 items-center md:rounded-2xl md:my-10">
        <Image
          src="/logo.png"
          priority
          alt="Logo"
          width={320}
          height={56}
          className="object-cover w-80 h-16 bg-graceBlack rounded-2xl"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <span className="block text-xl my-5 text-center">
            Informe o email cadastrado e lhe enviaremos um link para restaurar
            sua senha. Lembre de verificar o span.
          </span>
          <input
            autoComplete="email"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-6 ${
              errors.email ? "!border-red-600" : ""
            }`}
            placeholder="Email*"
            type="email"
            {...register("email", { required: "Email Obrigatório" })}
          />
          {errors.email && (
            <span className="text-red-600 text-xs">{errors.email.message}</span>
          )}
          <Button type="submit" className="w-full uppercase text-xs h-12 mt-6">
            Receber Email
          </Button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
