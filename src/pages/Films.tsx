// Films.tsx - Main component
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import FilmList from "../components/FilmList";
import FilmForm from "../components/FilmForm";
import FilmDetail from "./FilmDetail";
import { PlusOutlined } from "@ant-design/icons";

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

export type GenreType = {
  id: number;
  name: string;
};

const fetchFilmList = async (token: string | null, page = 1, limit = 10) => {
  return await axios.get<FilmType[]>(`/api/films?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchGenres = async (token: string | null) => {
  return await axios.get<GenreType[]>("/api/genre", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Films = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: filmData, refetch: refetchFilms } = useQuery({
    queryKey: ["filmList", currentPage],
    queryFn: () => fetchFilmList(getToken(), currentPage)
  });

  const { data: genreData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => fetchGenres(getToken())
  });

  const handleAddNewClick = () => {
    setSelectedFilm(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (film: FilmType) => {
    setSelectedFilm(film);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (film: FilmType) => {
    setSelectedFilm(film);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedFilm(null);
  };

  const handleFormSubmit = () => {
    refetchFilms();
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchFilms();
    setSelectedFilm(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          My Films Collection
        </h1>
        <button
          onClick={handleAddNewClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm transition-colors duration-200"
        >
          <PlusOutlined /> Add Film
        </button>
      </div>

      {/* Film List Section */}
      {filmData && (
        <FilmList
          films={filmData.data}
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
          onSubmit={handleFormSubmit}
          film={isEditMode ? selectedFilm : null}
          isEditMode={isEditMode}
          genres={genreData?.data || []}
        />
      )}

      {/* Film Detail Modal */}
      {selectedFilm && !isFormOpen && (
        <FilmDetail
          film={selectedFilm}
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedFilm)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Films;