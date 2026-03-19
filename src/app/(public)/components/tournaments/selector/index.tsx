'use client';

import { Activity, useState, type FC } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TournamentType } from '../../../(actions)';
import { usePathname, useRouter } from 'next/navigation';
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
            tournament.permalink === selectedPermalink &&
            tournament.category === selectedCategory,
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
    setSelectedFormat('');
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
    <section className="flex flex-col gap-5">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <Select value={selectedPermalink} onValueChange={handleTournamentChange}>
          <SelectTrigger className="w-full" id="permalink">
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
        <div className="w-full md:w-2/3">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full lg:w-auto" id="category" disabled={!selectedPermalink}>
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
        <div className="w-full md:w-2/3">
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger id="format" className="w-full lg:w-auto" disabled={!selectedCategory}>
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
        <div className="w-full lg:w-1/2 flex justify-end">
          <Button
            variant="outline-info"
            onClick={() => {
              setTournamentParams({
                permalink: selectedPermalink,
                category: selectedCategory,
                format: selectedFormat,
              });
            }}
            className="w-full md:w-fit"
          >Ver</Button>
        </div>
      </Activity>
    </section>
  );
};
