import type { FC } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "./styles.css";

type Props = Readonly<{
  title: string;
  imageUrl: string;
  dataAlignment: string;
  description: string;
  showData?: boolean;
  className?: string;
}>;

export const BannerImage: FC<Props> = (props) => {
  const {
    title,
    imageUrl,
    dataAlignment,
    description,
    showData = false,
    className='',
  } = props;

  return (
    <figure className="figure-container">
      <Image
        src={imageUrl}
        width={1280}
        height={548}
        alt={title ?? 'Imagen del Banner'}
        className={cn("image", className)}
      />
      <section className={cn("data-wrapper", {
        "top-0 left-0": showData,
        "top-[9999] left-[9999]": !showData,
      })
      }>
        <h2 className={cn("heading", {
          ["align-left"]: dataAlignment === 'left',
          ["align-center"]: dataAlignment === 'center',
          ["align-right"]: dataAlignment === 'right',
        })}>
          {title}
        </h2>

        <p className={cn("description", {
          ["align-left"]: dataAlignment === 'left',
          ["align-center"]: dataAlignment === 'center',
          ["align-right"]: dataAlignment === 'right',
        })}>
          {description}
        </p>
      </section>
    </figure>
  );
};
