export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}
