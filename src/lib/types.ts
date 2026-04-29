export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
  price: number;
  creatorId: number;
  creator?: User;
  attendees?: Attendee[];
  createdAt: string;
}

export interface Attendee {
  id: number;
  eventId: number;
  userId: number;
  status: string;
  user?: User;
  event?: Event;
  createdAt: string;
}

export interface ApiError {
  error: string;
}
