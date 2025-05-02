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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-2">Film Collection</h1>
            <p className="text-blue-100 text-lg">Manage your favorite movies in one place</p>
            <button
              onClick={handleAddNewClick}
              className="absolute top-6 right-6 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-md transition-all duration-200"
            >
              <PlusOutlined /> Add New Film
            </button>
          </div>
        </div>

        {/* Film List Section */}
        <div className="mb-10">
          {filmData && (
            <FilmList
              films={filmData.data}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}
        </div>

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
    </div>
  );
};

export default Films;