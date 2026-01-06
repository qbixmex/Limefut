import Link from "next/link";

export const FooterLinks = () => {
  return (
    <section className="w-full md:w-1/2">
      <ul className="flex flex-col md:flex-row justify-start items-center gap-5">
        <li>
          <Link
            className="font-semibold italic"
            href="/quienes-somos"
            target="_blank"
          >
            ¿ Quienes Somos ?
          </Link>
        </li>
        <li>
          <Link
            className="font-semibold italic"
            href="/reglamento"
            target="_blank"
          >
            Reglamento
          </Link>
        </li>
        <li>
          <Link
            className="font-semibold italic"
            href="/contacto"
            target="_blank"
          >
            Contacto
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default FooterLinks;