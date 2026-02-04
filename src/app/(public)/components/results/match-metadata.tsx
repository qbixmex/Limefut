import type { FC } from "react";
import { format as formatDate } from "date-fns";
import { es } from "date-fns/locale";

type Props = Readonly<{
  tournamentName: string;
  category: string | null;
  format: string | null;
  week: number | null;
  place: string | null;
  date: Date | null;
}>;

export const MatchMetadata: FC<Props> = ({
  tournamentName,
  category,
  format,
  week = 0,
  place,
  date,
}) => {
  return (
    <div className="h-full flex flex-col justify-center gap-2">
      <h3 className="text-lg font-semibold">{tournamentName}</h3>
      <section className="flex flex-col md:flex-row">
        <div className="w-full md:1/2">
          <p><b>Categoría:</b> {category ?? <span>No especificada</span>}</p>
          <p><b>Formato:</b> {format} vs {format}</p>
          <p><b>Lugar:</b> {place ?? <span>No especificado</span>}</p>
        </div>
        <div className="w-full md:1/2">
          {/* <p><b>Fecha:</b> 12 / Oct / 2025</p> */}
          <p><b>Fecha:</b> {formatDate(date as Date, "dd / LLL / yyyy", { locale: es })}</p>
          <p><b>Hora:</b> {formatDate(date as Date, "h:mm a", { locale: es })}</p>
          <p><b>Jornada:</b> {week}</p>
        </div>
      </section>
    </div>
  );
};

export default MatchMetadata;