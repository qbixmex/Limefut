import { Suspense, type FC } from 'react';
import { Heading } from '../../components';
import { MatchForm } from './match-form';
import { CategorySelect } from './category-select';
import { FieldSelect } from './field-select';
import { TeamsSlot } from './teams-slot';

type Props = Readonly<{
  searchParams: Promise<{
    category?: string;
  }>;
}>;

export const SaveMatchPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600 text-center">
        Guardar Encuentro
      </Heading>
      <Suspense>
        <SaveMatchContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

const SaveMatchContent: FC<Props> = async ({ searchParams }) => {
  const { category } = await searchParams;

  return (
    <MatchForm
      categorySlot={<CategorySelect />}
      fieldSlot={<FieldSelect />}
      teamsSlot={
        <TeamsSlot
          key={`${category ?? 'category'}`}
          categoryPermalink={category}
        />
      }
    />
  );
};

export default SaveMatchPage;
