import type { FC } from "react";
import { es } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { getStatusTranslation } from "@/lib/utils";
import type { MATCH_STATUS_TYPE } from "@/shared/enums";

const TIME_ZONE = "America/Mexico_City";

type Props = Readonly<{
  tournamentName: string;
  category: string | null;
  format: string | null;
  week: number | null;
  place: string | null;
  date: Date | null;
  status: string;
}>;

export const MatchMetadata: FC<Props> = ({
  tournamentName,
  category,
  format,
  week = 0,
  place,
  date,
  status,
}) => {
  return (
    <div className="h-full flex flex-col justify-center gap-2">
      <h3 className="text-lg font-semibold">{tournamentName}</h3>
      <section className="flex flex-col md:flex-row">
        <div className="w-full md:1/2">
          <p><b>Categoría:</b> {category ?? <span>No especificada</span>}</p>
          <p><b>Formato:</b> {format} vs {format}</p>
          <p><b>Sede:</b> {place ?? <span>No especificado</span>}</p>
          <p>
            <b>Estado:</b>&nbsp;
            <span className="capitalize italic">
              {getStatusTranslation(status as MATCH_STATUS_TYPE)}
            </span>
          </p>
        </div>
        <div className="w-full md:1/2">
          <p><b>Fecha:</b> {formatInTimeZone(date as Date, TIME_ZONE, "dd / LLL / yyyy", { locale: es })}</p>
          <p><b>Hora:</b> {formatInTimeZone(date as Date, TIME_ZONE, "h:mm a", { locale: es })}</p>
          <p><b>Jornada:</b> {week}</p>
        </div>
      </section>
    </div>
  );
};

export default MatchMetadata;