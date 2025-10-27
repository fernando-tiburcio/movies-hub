import { useParams, useNavigate } from "react-router";
import { MovieDetails } from "../components/MovieDetails";

export function meta() {
  return [
    { title: "Movies Hub - Detalhes do Filme" },
    {
      name: "description",
      content: "Detalhes do filme no Movies Hub",
    },
  ];
}

export default function MovieDetailsPage() {
  const params = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  if (!params.movieId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Erro
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ID do filme não fornecido
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <MovieDetails movieId={params.movieId} />;
}
