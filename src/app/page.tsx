import Image from "next/image";
import styles from "./home-styles.module.css";
import { PublicLayout } from "./(public)/public.layout";

const Home = () => {
  return (    
      <PublicLayout>
        <section className="bg-gray-50 md:rounded p-5 flex-1">
          <h1 className="text-gray-800 font-arimo font-bold">Bienvenidos a LIMEFUT</h1>
          <section className={styles.banners}>
            <Image
              src="/images/inscription.jpg"
              width={640}
              height={640}
              alt="Inscripciones"
              className="rounded"
            />
            <Image
              src="/images/set-aside-spot.jpg"
              width={640}
              height={640}
              alt="Aparta tu lugar"
              className="rounded"
            />
            <Image
              src="/images/fixed-headquarters.png"
              width={640}
              height={640}
              alt="Sede Fija"
              className="rounded"
            />
          </section>
        </section>
      </PublicLayout>
  );
};

export default Home;