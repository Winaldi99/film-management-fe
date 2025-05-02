// Film.tsx (atau FilmPage.tsx)
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import FilmList from "../components/FilmList";
import FilmForm from "../components/FilmForm";
import FilmDetail from "./FilmDetail"; // Pastikan path ini benar
import { PlusOutlined } from "@ant-design/icons";

// Tipe Film
export type FilmType = {
  id: number;
  title: string;
  director: string;
  genre_id: number;
  genre: {
    id: number;
    name: string;
  };
  image_url: string;
  created_at: string;
  updated_at: string;
};

// Tipe Genre (hanya id dan name yang dibutuhkan FilmForm)
export type GenreType = {
  id: number;
  name: string;
  // Mungkin ada field lain dari API /api/genre, tapi ini cukup untuk dropdown
  // description?: string;
  // user_id?: number;
};

// Fungsi fetch list film (SESUAI KOREKSI ANDA)
const fetchFilmList = async (token: string | null, page = 1, limit = 10) => {
  try {
      // Mengharapkan API mengembalikan FilmType[] secara langsung
      const response = await axios.get<FilmType[]>(`/api/films?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Axios akan otomatis memberikan array dari response.data karena generic <FilmType[]>
      console.log("API Response for /api/films:", response.data); // Log untuk memastikan array
      return response.data; // Mengembalikan array FilmType[]
  } catch (error) {
      console.error("Error fetching film list:", error);
      throw error;
  }
};

// Fungsi fetch list genre (DIASUMSIKAN SAMA, MENGEMBALIKAN ARRAY LANGSUNG)
const fetchGenres = async (token: string | null) => {
    console.log("Fetching genres from /api/genre...");
    try {
      // Mengharapkan API mengembalikan GenreType[] secara langsung
      const response = await axios.get<GenreType[]>("/api/genre", { // <-- PERBAIKAN TIPE GENERIC
        headers: { Authorization: `Bearer ${token}` }
      });
      // Axios akan otomatis memberikan array dari response.data
      console.log("API Response for /api/genre:", JSON.stringify(response.data, null, 2)); // Log respons mentah
      return response.data; // Mengembalikan array GenreType[] <-- PERBAIKAN RETURN
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error;
    }
};

// Komponen Utama
const Film = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Query untuk list film
  // 'filmData' SEKARANG adalah array FilmType[] atau undefined
  const { data: filmData, refetch: refetchFilm, isLoading: isLoadingFilms } = useQuery({
    queryKey: ["filmList", currentPage],
    queryFn: () => fetchFilmList(getToken(), currentPage),
  });

  // Query untuk list genre
  // 'genreData' SEKARANG adalah array GenreType[] atau undefined
  const { data: genreData, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => fetchGenres(getToken()),
    staleTime: 5 * 60 * 1000,
  });

  // Ekstrak array film langsung dari data query
  const films = filmData || []; // <-- CARA AKSES DIPERBAIKI (tanpa .data)
  console.log("Films extracted for List:", films);

  // Ekstrak array genre langsung dari data query
  const genresForForm = genreData || []; // <-- CARA AKSES DIPERBAIKI (tanpa .data)
  console.log("Genres extracted for Form:", JSON.stringify(genresForForm));

  const handleAddNewClick = () => {
    setSelectedFilm(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (filmToEdit: FilmType) => {
    setSelectedFilm(filmToEdit);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (filmToView: FilmType) => {
    setSelectedFilm(filmToView);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedFilm(null);
  };

  const handleFormSubmitSuccess = () => {
    refetchFilm();
    setIsFormOpen(false);
    setSelectedFilm(null);
  };

  const handleDeleteSuccess = () => {
    refetchFilm();
    setSelectedFilm(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          My Film Collection
        </h1>
        <button
          onClick={handleAddNewClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm transition-colors duration-200"
          disabled={isLoadingGenres}
        >
          <PlusOutlined /> Add Film
        </button>
      </div>

      {isLoadingFilms && <p className="text-center py-4">Loading films...</p>}
      {isLoadingGenres && !isFormOpen && <p className="text-center py-4">Loading genres...</p>} {/* Tampilkan loading genre jika form belum terbuka */}

      {/* Film List Section */}
      {!isLoadingFilms && filmData && ( // Gunakan filmData untuk cek data ada
        <FilmList
          film={films} // <-- Kirim array 'films'
          onEdit={handleEditClick}
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}

      {/* Film Form Modal */}
      {isFormOpen && (
        <FilmForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmitSuccess}
          film={isEditMode ? selectedFilm : null}
          isEditMode={isEditMode}
          genres={genresForForm} // <-- Kirim array 'genresForForm'
        />
      )}

      {/* Film Detail Modal */}
      {selectedFilm && !isFormOpen && (
        <FilmDetail
          films={selectedFilm} // <-- Nama prop sudah benar
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedFilm)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Film;