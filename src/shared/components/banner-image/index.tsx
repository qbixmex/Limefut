import type { FC } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <figure className="w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg relative">
      <Image
        src={imageUrl}
        width={1200}
        height={400}
        alt={title ?? 'Imagen del Banner'}
        className={cn("w-full h-[400px] lg:max-w-[1200px] object-cover m-auto", className)}
      />
      <section className={cn("absolute  w-full h-full px-5 lg:px-20 flex flex-col justify-center gap-2 bg-black/20", {
        "top-0 left-0": showData,
        "top-[9999] left-[9999]": !showData,
      })
      }>
        <h2 className={cn("text-2xl md:text-3xl lg:text-5xl text-emerald-500 font-open-sans uppercase text-shadow-md/50 text-shadow-black font-black text-wrap lg:w-2/3", {
          "mr-auto text-left": dataAlignment === 'left',
          "mx-auto text-center": dataAlignment === 'center',
          "ml-auto text-right": dataAlignment === 'right',
        })}>
          {title}
        </h2>
        <div className={cn("text-lg md:text-xl lg:text-2xl text-white text-shadow-xs text-shadow-black font-medium lg:w-2/3", {
          "mr-auto text-left": dataAlignment === 'left',
          "mx-auto text-center": dataAlignment === 'center',
          "ml-auto text-right": dataAlignment === 'right',
        })}>
          {description}
        </div>
      </section>
    </figure>
  );
};
