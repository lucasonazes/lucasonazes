"use client";

import Image from "next/image";
import { Button, Footer, Header } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreateUserT,
  useCreateMemberMutation,
  useLoginMutation,
} from "@/service/userAPI";
import toast from "react-hot-toast";
import { format, isBefore, isValid, parse, parseISO } from "date-fns";
import InputMask from "react-input-mask";
import { setAccessToken } from "@/store/authSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";

export default function SignUp() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");
  const [createMember] = useCreateMemberMutation();
  const [login] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserT>();

  function formatDate(dateStr: string) {
    let [day, month, year] = dateStr.split("/");
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const validateDate = (value: string) => {
    const parsedDate = parse(value, "dd/MM/yyyy", new Date());
    if (!isValid(parsedDate)) {
      return "Data inválida";
    }

    if (!isBefore(parsedDate, new Date())) {
      return "A data deve ser menor do que a data de hoje";
    }

    return true;
  };

  const onSubmit: SubmitHandler<CreateUserT> = async (data) => {
    const res = await createMember({
      ...data,
      birth_date: format(parseISO(formatDate(data.birth_date)), "dd-MM-yyyy"),
      phone: `+55${data.phone}`.replace(/[()\s-]/g, ""),
    }).unwrap();
    if (res) {
      const loginRes = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      if (loginRes) {
        dispatch(setAccessToken(loginRes.token));
        router.push(nextUrl ?? "/events");
        toast.success("Agora você faz parte da Grace Gate");
        reset();
      }
    }
  };

  const handleNavigateToSignIn = () => {
    router.push(!nextUrl ? "/sign-in" : `/sign-in?next=${nextUrl}`);
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
            autoComplete="name"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-6 ${
              errors.name ? "!border-red-600" : ""
            }`}
            placeholder="Nome Completo*"
            {...register("name", { required: "Nome Obrigatório" })}
          />
          {errors.name && (
            <span className="text-red-600 text-xs">{errors.name?.message}</span>
          )}
          <input
            autoComplete="email"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-2 ${
              errors.email ? "!border-red-600" : ""
            }`}
            placeholder="Email*"
            type="email"
            {...register("email", { required: "Email Obrigatório" })}
          />
          {errors.email && (
            <span className="text-red-600 text-xs">{errors.email.message}</span>
          )}
          <InputMask
            autoComplete="mobile tel"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-2 ${
              errors.phone ? "!border-red-600" : ""
            }`}
            mask="(99) 99999-9999"
            placeholder="Telefone (com DDD)*"
            type="tel"
            {...register("phone", { required: "Telefone Obrigatório" })}
          />
          {errors.email && (
            <span className="text-red-600 text-xs">
              {errors.phone?.message}
            </span>
          )}
          <InputMask
            autoComplete="bday-day"
            className={`bg-white text-graceBlack rounded border border-graceBlack px-3 w-full h-12 mt-2 ${
              errors.birth_date ? "!border-red-600" : ""
            }`}
            mask="99/99/9999"
            maskPlaceholder="dd/mm/aaaa"
            type={"text"}
            placeholder="Data de nascimento*"
            {...register("birth_date", {
              required: "Data Obrigatória",
              validate: validateDate,
            })}
          />
          {errors.birth_date && (
            <span className="text-red-600 text-xs">
              {errors.birth_date.message}
            </span>
          )}
          <select
            className={`bg-white rounded border border-graceBlack px-3 w-full h-12 mt-2 ${
              errors.gender ? "!border-red-600" : ""
            } ${watch("gender") ? "text-gray-black" : "text-gray-400"}`}
            {...register("gender", { required: "Genero Obrigatório" })}
          >
            <option value="">Genero*</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
          {errors.gender && (
            <span className="text-red-600 text-xs">
              {errors.gender.message}
            </span>
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
            Cadastrar
          </Button>
        </form>
        <Button
          outlined
          className="w-full uppercase text-xs h-12 mt-2 !text-graceBlack !border-graceBlack"
          onClick={handleNavigateToSignIn}
        >
          Já tenho conta
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
