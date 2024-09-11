import { apiBase } from ".";

type EventResponse = {
  _id: string;
  name: string;
  description: string;
  address: string;
  available_spots: number;
  start_date: string;
  end_date: string;
  price: number;
  type: string;
  active: boolean;
  header_url: string;
  retreat_config: {
    rooms: {
      room_name: string;
      room_leader: string;
      max_number_of_people: number;
      gender: string;
      available_spots: number;
    }[];
  };
  created_at: string;
  updated_at: string;
};

export const EventService = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    fetchEvents: builder.query<EventResponse[], undefined>({
      query: () => ({
        url: `/event`,
      }),
    }),
    fetchEventById: builder.query<EventResponse, { id: string }>({
      query: (params) => ({
        url: `/event/${params.id}`,
      }),
    }),
  }),
});

export const { useFetchEventsQuery, useFetchEventByIdQuery } = EventService;
