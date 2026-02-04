import type { FC } from "react";
import { ShieldQuestion } from "lucide-react";
import Image from "next/image";

type Props = Readonly<{
  imageUrl: string | null;
  name: string;
}>;

export const Team: FC<Props> = ({
  imageUrl,
  name,
}) => {
  return (
    <div className={"flex justify-center items-center gap-5"}>
      <div className="flex flex-col items-center gap-2">
        <figure>
          {!imageUrl && (<ShieldQuestion className="text-gray-400" />)}
          {imageUrl && (
            <Image
              src={imageUrl}
              width={100}
              height={100}
              alt={`${name} escudo`}
              className="size-[75px] md:size-[100px] object-cover rounded"
            />
          )}
        </figure>
        <p className="leading-tight text-sm md:leading-relaxed md:text-xl text-center font-semibold italic text-gray-700 dark:text-gray-200">
          {name}
        </p>
      </div>
    </div>
  );
};