import { fetchPublicSponsorsAction } from '../../(actions)/home/fetchPublicSponsorsAction';
import { SponsorCarousel } from './sponsor-carousel';

export const Sponsors = async () => {
  const { ok, sponsors } = await fetchPublicSponsorsAction();

  if (!ok && sponsors.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block">
      <h2 className="visually-hidden">Patrocinadores</h2>

      <SponsorCarousel
        sponsors={sponsors}
        time={10}
      />
    </div>
  );
};
