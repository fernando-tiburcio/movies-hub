import { Home as HomeComponent } from "../Home";

export function meta() {
  return [
    { title: "Movies Hub - Filmes Populares" },
    {
      name: "description",
      content: "Descubra os filmes mais populares do momento com Movies Hub",
    },
  ];
}

export default function Home() {
  return <HomeComponent />;
}
