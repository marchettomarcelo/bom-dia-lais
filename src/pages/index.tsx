import Head from "next/head";
import Image from "next/image";

import { api } from "~/utils/api";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Home() {
  const { data } = api.bomDia.getLatestBomDia.useQuery();

  return (
    <>
      <Head>
        <title>Bom dia Laís</title>
        <meta
          name="description"
          content="Que o seu dia seja muito abençoado, minha gatinha!!"
        />
        <link rel="icon" href="/core.png" />
      </Head>
      <main
        style={{
          background: `linear-gradient(${getRandomColor()}, ${getRandomColor()});`,
        }}
        className={`flex min-h-screen flex-col items-center`}
      >
        <div className="relative mx-auto flex w-full max-w-screen-lg flex-col gap-5 px-4 py-16">
          <h1 className="text-5xl font-bold">Bom dia, Laís!!! ❤️❤️❤️ </h1>
          <div className="relative h-[600px] w-full">
            {" "}
            {/* Container da imagem */}
            <Image
              src={data?.imgaeUrl || ""} // Imagem de fundo
              alt="imagem de bom dia"
              fill={true} // Faz a imagem ocupar o container
              className="rounded-lg object-cover opacity-70" // Classe para moldar a imagem ao container
            />
            <h1 className="absolute items-center justify-center gap-5 bg-opacity-10 p-3 pr-0 font-serif text-3xl font-extrabold drop-shadow-xl lg:text-7xl">
              {data?.fraseMotivacional}
            </h1>
            <h3 className="absolute bottom-0 right-0 rounded-lg bg-white p-2 opacity-70">
              Feito com ❤️ pelo seu namoradinho
            </h3>
          </div>
        </div>
      </main>
    </>
  );
}
