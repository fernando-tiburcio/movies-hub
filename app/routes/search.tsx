import { useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { MovieGrid } from "../components/MovieGrid";

export function meta() {
  return [
    { title: "Movies Hub - Buscar Filmes" },
    {
      name: "description",
      content: "Busque e descubra filmes com Movies Hub",
    },
  ];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        <MovieGrid searchQuery={query} />
      </main>
    </div>
  );
}
