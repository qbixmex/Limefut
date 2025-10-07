import Image from "next/image";

const Home = () => {
  return (
    <>
      <Image
        src="/limefut-logo.png"
        width={256}
        height={256}
        alt="Limefut Logo"
        className="w-full max-w-[256] h-auto mb-5"
      />
      <h1 className="text-lg font-arimo font-bold">Bienvenidos a LIMEFUT</h1>
    </>
  );
};

export default Home;