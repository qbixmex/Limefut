import type { FC } from "react";
import Link from "next/link";
import { fetchPagesAction } from "../../(actions)";

export const FooterLinks: FC = async () => {
  const { pageLinks } = await fetchPagesAction();

  return (
    <section className="w-full md:w-1/2">
      <ul className="flex flex-col md:flex-row justify-start items-center gap-5">
        {pageLinks.map(({ id, title, permalink }) => (
          <li key={id}>
            <Link
              className="font-semibold italic"
              href={`/${permalink}`}
              target="_blank"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FooterLinks;
