import { Header } from "../components/Header";
import { MovieGrid } from "../components/MovieGrid";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Conteúdo principal com padding para o header fixo */}
      <main className="pt-20">
        <MovieGrid />
      </main>
    </div>
  );
}
