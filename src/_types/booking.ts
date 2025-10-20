export interface Booking {
  id: string;
  dateTime: Date;
  status: string;
  comment: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  barber: {
    id: string;
    name: string;
    photo: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
  serviceOption?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
  };
}
