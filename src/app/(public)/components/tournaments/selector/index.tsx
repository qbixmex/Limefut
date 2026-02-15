'use client';

import { Activity, useState, type FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { TournamentType } from "../../../(actions)";
import { usePathname, useRouter } from "next/navigation";
import './styles.css';

type Props = Readonly<{
  tournaments: TournamentType[];
}>;

export const SelectorInputs: FC<Props> = ({ tournaments }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedPermalink, setSelectedPermalink] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');

  const uniqueTournaments = Array.from(
    new Map(tournaments.map(t => [t.permalink, t])).values(),
  );

  const availableCategories = tournaments.filter(
    tournament => tournament.permalink === selectedPermalink,
  );

  const availableFormats = Array.from(
    new Set(
      tournaments
        .filter(
          tournament =>
            tournament.permalink == selectedPermalink &&
            tournament.category == selectedCategory,
        )
        .map(tournament => tournament.format),
    ),
  );

  const handleTournamentChange = (value: string) => {
    setSelectedPermalink(value);
    setSelectedCategory('');
    setSelectedFormat('');
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedFormat("");
  };

  const setTournamentParams = ({
    permalink,
    category,
    format,
  }: {
    permalink: string;
    category: string;
    format: string;
  }) => {
    const params = new URLSearchParams();
    params.set('torneo', permalink);
    params.set('categoria', category);
    params.set('formato', format);
    router.push(`${pathname}?${params}`);
  };

  return (
    <section className="flex flex-col md:flex-row gap-5">
      <div>
        <Select value={selectedPermalink} onValueChange={handleTournamentChange}>
          <SelectTrigger id="permalink" className="w-full">
            <SelectValue placeholder="Seleccione Torneo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {uniqueTournaments.map(({ id, name, permalink }) => (
                <SelectItem key={id} value={permalink}>{name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Activity mode={selectedPermalink ? 'visible' : 'hidden'}>
        <div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="w-full" disabled={!selectedPermalink}>
              <SelectValue placeholder="Seleccione Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableCategories.map(({ id, category }) => (
                  <SelectItem key={id} value={category}>{category}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Activity>

      <Activity mode={selectedCategory ? 'visible' : 'hidden'}>
        <div>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger id="format" className="w-full" disabled={!selectedCategory}>
              <SelectValue placeholder="Seleccione Formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format} vs {format}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Activity>

      <Activity mode={
        (selectedPermalink && selectedCategory && selectedFormat)
          ? 'visible'
          : 'hidden'
      }>
        <Button variant="outline-info" onClick={() => {
          setTournamentParams({
            permalink: selectedPermalink,
            category: selectedCategory,
            format: selectedFormat,
          });
        }}>Ver</Button>
      </Activity>
    </section>
  );
};

// Tournaments from Props.
/*
[
  {
    "id": "4f15ec94-28e4-4bf6-90a6-db8e58acd232",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2013",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "ae9cf47e-b98b-487d-aba8-391c89c4e6c6",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2014",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "1d76cb81-eca0-4980-83e9-c20971e9590d",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2015",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "f5ff83b2-98e9-4b5c-8e81-99a6784666e0",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2016",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "30a88096-5ded-4daf-a7d6-53a0174c352b",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2017",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "d79133af-a336-4744-a666-e8addcc6e10a",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2018",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "39c5d0d5-b357-4048-8349-cdcdeb4b9ae4",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2018-colegial",
    "format": "7",
    "gender": "male"
  },
  {
    "id": "a5908c82-70c8-42e7-94f5-a6b86316ced9",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "2019",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "820cdf52-bd69-4416-8d20-c554c6de9cb8",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "preparatoria-femenil",
    "format": "7",
    "gender": "female"
  },
  {
    "id": "4b79f249-7d22-47cc-8844-cc8ce78c05c2",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "preparatoria-varonil",
    "format": "7",
    "gender": "male"
  },
  {
    "id": "8d44e378-a5ac-40c5-adf9-23a3a9d6a8aa",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "primaria-femenil",
    "format": "7",
    "gender": "female"
  },
  {
    "id": "31e70ff5-293f-4d91-91ec-997178cb0e20",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "secundaria-femenil",
    "format": "7",
    "gender": "female"
  },
  {
    "id": "e6fc69f9-5c88-4eec-b7bc-4eebbb4032b9",
    "name": "Torneo Febrero - Junio 2026 Edición Copa del Mundo",
    "permalink": "torneo-febrero-junio-2026-edicion-copa-del-mundo",
    "category": "secundaria-varonil",
    "format": "7",
    "gender": "male"
  },
  {
    "id": "c7c39534-7676-4788-9752-5256fb20ece3",
    "name": "Torneo Septiembre - Diciembre 2025",
    "permalink": "torneo-septiembre-diciembre-2025",
    "category": "2014",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "8e282b68-5df1-4437-a238-0248c949aa7a",
    "name": "Torneo Septiembre - Diciembre 2025",
    "permalink": "torneo-septiembre-diciembre-2025",
    "category": "2015",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "10a85200-98fc-4840-b478-60b3eba0ccca",
    "name": "Torneo Septiembre - Diciembre 2025",
    "permalink": "torneo-septiembre-diciembre-2025",
    "category": "2016",
    "format": "9",
    "gender": "male"
  },
  {
    "id": "50ab01eb-ef6f-4989-a740-090feef72f8b",
    "name": "Torneo Septiembre - Diciembre 2025",
    "permalink": "torneo-septiembre-diciembre-2025",
    "category": "2017",
    "format": "9",
    "gender": "male"
  }
]
*/