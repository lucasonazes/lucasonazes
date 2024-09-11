"use client";

import Image from "next/image";
import { Button, Footer, Header } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInT, useLoginMutation } from "@/service/userAPI";
import { useAppDispatch } from "@/hooks/reduxHooks";
import toast from "react-hot-toast";
import { setAccessToken } from "@/store/authSlice";

export default function SignIn() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInT>();

  const onSubmit: SubmitHandler<SignInT> = async (data) => {
    const res = await login(data).unwrap();
    if (res) {
      dispatch(setAccessToken(res.token));
      router.push(nextUrl ?? "/events");
      toast.success("Bem vindo(a) à Grace Gate");
      reset();
    }
  };

  const handleNavigateToSignUp = () => {
    router.push(!nextUrl ? "/sign-up" : `/sign-up?next=${nextUrl}`);
  };

  const handleNavigateToForgotPassword = () => {
    router.push("/forgot-password");
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
          <input
            autoComplete="current-password"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-2 ${
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
          <Button type="submit" className="w-full uppercase text-xs h-12 mt-6">
            Entrar
          </Button>
        </form>
        <Button
          outlined
          className="w-full uppercase text-xs h-12 mt-2 !text-graceBlack !border-graceBlack"
          onClick={handleNavigateToSignUp}
        >
          Cadastrar
        </Button>
        <Button
          link
          className="w-full uppercase text-xs h-12 mt-2 !text-graceBlack"
          onClick={handleNavigateToForgotPassword}
        >
          Esqueci Minha Senha
        </Button>
      </div>
      <Footer />
    </main>
  );
}
