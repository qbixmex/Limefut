import type { FC } from 'react';
import type { Metadata } from 'next/types';
import "./styles.css";
import { ContactForm } from './(components)/ContactForm';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con nosotros y envíanos tu mensaje',
  robots: 'noindex, nofollow',
};

export const ContactPage: FC = () => {
  return (
    <div className="wrapper justify-center">
      <h1>Contacto</h1>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
