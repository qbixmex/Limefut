import type { FC } from 'react';
import Image from "next/image";
import "./styles.css";

export const About: FC = () => {
  return (
    <div className="wrapper">
      <h1>¿ Quienes Somos ?</h1>

      <section className="flex flex-col md:flex md:flex-row">
        <div className="order-2 w-full md:w-1/2 grid place-content-center">
          <h2>Misión</h2>
          <p>Somos una liga de fútbol infantil dedicada a fomentar el desarrollo integral de niños y jóvenes a través del deporte, la sana competencia y los valores que el fútbol transmite.</p>
          <p>Creemos firmemente que el fútbol es más que un juego: es una herramienta de aprendizaje, disciplina y trabajo en equipo que forma carácter y fortalece la amistad.</p>
        </div>
        <div className="order-1 w-full md:w-1/2 grid place-content-center">
          <Image
            src="/liga-menor-de-futbol-black.webp"
            width={500}
            height={500}
            alt="Liga menor de futbol"
            className="size-[500px] object-cover"
          />
        </div>
      </section>

      <section className="flex flex-col md:flex md:flex-row mb-3">
        <div className="w-full md:w-1/2 grid place-content-center">
          <h2>Visión</h2>
          <p>Ser la mejor liga formativa líder en nuestra región, reconocida por su organización, sus valores y la calidad de sus entrenadores, instituciones deportivas y profesionales.</p>
          <p>Queremos consolidarnos como un espacio donde los niños aprendan a competir con alegría, respeto y compañerismo, fortaleciendo su amor por el deporte y su desarrollo personal.</p>
        </div>
        <div className="w-full md:w-1/2 grid place-content-center">
          <figure>
            <Image
              src="/images/kids-playing-football.webp"
              width={500}
              height={500}
              alt="Niños entrenando con su entrenador"
              className="picture"
            />
          </figure>
        </div>
      </section>

      <h2 className="text-center">Valores</h2>

      <section className="flex flex-col md:flex md:flex-row">
        <div className="lg:order-2 w-full md:w-1/2 grid place-content-center">
          <h3>Trabajo en Equipo</h3>
          <p>Enseñar que los logros más grandes se alcanzan juntos, compartiendo metas, apoyando a los compañeros y aprendiendo del esfuerzo colectivo.</p>
          <h3>Espíritu deportivo</h3>
          <p>Promover la competencia sana, la humildad en la victoria y la dignidad en la derrota, entendiendo que el verdadero triunfo está en mejorar cada día.</p>
          <h3>Pasión</h3>
          <p>Transmitir el amor por el fútbol, motivando a los niños a disfrutar del juego con entusiasmo y alegría, mientras aprenden valores que los acompañarán toda la vida.</p>
        </div>
        <div className="lg:order-1 w-full md:w-1/2 grid place-content-center">
          <Image
            src="/images/kids-team.webp"
            width={500}
            height={500}
            alt="Niños apoyándose antes de un partido de fútbol"
            className="picture"
          />
        </div>
      </section>

      <section className="flex flex-col md:flex md:flex-row">
        <div className="w-full md:w-1/2 grid place-content-center">
          <h3>Disciplina</h3>
          <p>Fomentar la constancia, el esfuerzo y la responsabilidad en cada entrenamiento y partido, promoviendo hábitos positivos dentro y fuera de la cancha.</p>
          <h3>Respeto</h3>
          <p>Valorar a todos los participantes de la liga (rivales, padres, árbitros, directores técnicos y organizadores) reconociendo que cada uno cumple un papel importante en el crecimiento deportivo y humano de los jugadores.</p>
        </div>
        <div className="order-1 w-full md:w-1/2 grid place-content-center">
          <Image
            src="/images/kids-celebrating.webp"
            width={500}
            height={500}
            alt="Niños celebrando el triunfo en un partido de fútbol"
            className="picture"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
