import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const TeamsPage = () => {
  return (
    <section className="flex-1 rounded flex flex-col item-center justify-center">
      <Card className="p-10 flex-1">
        <CardContent>
          <div className="bg-amber-600 text-amber-950 p-8 rounded-lg mb-10 text-center font-black text-5xl">
            Página en Construcción
          </div>

          <Image
            src="/images/under-construction.webp"
            width={1536}
            height={1024}
            alt="En Construcción"
            className="rounded-lg"
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default TeamsPage;