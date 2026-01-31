import { Card, CardContent } from "@/components/ui/card";
import Heading from '../components/heading';
import { fetchGalleriesAction } from "./(actions)/fetchGalleriesAction";
import Image from "next/image";
import Link from "next/link";

const GalleriesPage = async () => {
  const response = await fetchGalleriesAction();

  const galleries = response.galleries;

  return (
    <section className="wrapper justify-center">
      <Card className="p-10 flex-1">
        <CardContent>
          <Heading
            level="h1"
            className="text-emerald-600 mb-10"
          >Galeria de Imágenes</Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleries.map((gallery) => (
              <Link href={`/imagenes/${gallery.permalink}`} key={gallery.id}>
                <figure className="rounded">
                  <Image
                    width={300}
                    height={300}
                    src={gallery.image.imageUrl}
                    alt={gallery.image.title}
                    className="size-[300px] object-cover rounded mb-5"
                  />
                  <figcaption className="text-center">
                    <Heading level="h2" className="text-2xl! font-medium text-sky-500 mb-2">{gallery.title}</Heading>
                  </figcaption>
                </figure>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GalleriesPage;