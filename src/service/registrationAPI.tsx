import { apiBase } from ".";

export const EVENT_REGISTRATION_STATUS = {
  AWAITING_PAYMENT: "Aguardando Pagamento",
  PAID: "Pagamento Realizado",
  CANCELLED: "Cancelada",
  PAYMENT_ERROR: "Erro no pagamento",
  INTERNAL_ERROR: "Erro interno",
} as const;

export type EventRegistrationStatus =
  (typeof EVENT_REGISTRATION_STATUS)[keyof typeof EVENT_REGISTRATION_STATUS];

type EventRegistration = {
  event: string;
  special_needs?: string;
  church?: string;
  retreat_config: {
    room_name: string;
  };
};

export type RegistrationResponse = {
  _id: string;
  user: string;
  event: string;
  type: string;
  status: EventRegistrationStatus;
  special_needs: string;
  church: string;
  payment_url: string;
  payment_id: string;
  retreat_config: {
    room_name: string;
  };
  created_at: string;
  updated_at: string;
};

export const RegistrationService = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    registerToEvent: builder.mutation<RegistrationResponse, EventRegistration>({
      query: (params) => ({
        url: `/event-registration`,
        method: "POST",
        body: params,
      }),
    }),
    fetchRegistrations: builder.query<RegistrationResponse[], undefined>({
      query: () => ({
        url: `/event-registration`,
      }),
    }),
    fetchRegistrationById: builder.query<RegistrationResponse, { id: string }>({
      query: (params) => ({
        url: `/event-registration/${params.id}`,
      }),
    }),
  }),
});

export const {
  useRegisterToEventMutation,
  useFetchRegistrationsQuery,
  useFetchRegistrationByIdQuery,
} = RegistrationService;
