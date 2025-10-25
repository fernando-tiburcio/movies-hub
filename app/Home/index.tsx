import { useState } from "react";
import { Header } from "../components/Header";
import { MovieGrid } from "../components/MovieGrid";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onSearch={handleSearch} />

      {/* Conteúdo principal com padding para o header fixo */}
      <main className="pt-20">
        <MovieGrid searchQuery={searchQuery} />
      </main>
    </div>
  );
}
