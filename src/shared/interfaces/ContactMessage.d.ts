export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
