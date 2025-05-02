<<<<<<< HEAD:src/pages/Films.tsx
// Films.tsx - Main component
=======
// Film.tsx - Main component for managing film
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
<<<<<<< HEAD:src/pages/Films.tsx
import FilmList from "../components/FilmList";
import FilmForm from "../components/FilmForm";
import FilmDetail from "./FilmDetail";
import { PlusOutlined } from "@ant-design/icons";
=======
import FilmList from "../components/FilmList"; // Renamed import
import FilmForm from "../components/FilmForm"; // Renamed import
import FilmDetail from "./FilmDetail"; // Renamed import
import { VideoCameraAddOutlined } from "@ant-design/icons"; // Changed Icon
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx

export type FilmType = {
  id: number;
  title: string;
  director: string;
  genre_id: number;
  genre: {
    id: number;
<<<<<<< HEAD:src/pages/Films.tsx
    name: string;
=======
    category: string; // Assuming Genre API returns 'name'
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
  };
  
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type GenreType = {
  id: number;
<<<<<<< HEAD:src/pages/Films.tsx
  name: string;
};

const fetchFilmList = async (token: string | null, page = 1, limit = 10) => {
  return await axios.get<FilmType[]>(`/api/films?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
=======
  category: string; // Assuming Genre API returns 'name'
};

// Updated fetch function name and endpoint
const fetchFilmList = async (token: string | null, page = 1, limit = 12) => { // Increased limit for grid view
  // Changed API endpoint
  return await axios.get<{ data: FilmType[], total: number }>( // Assuming API returns pagination data
    `/api/film?page=${page}&limit=${limit}`, // Changed endpoint
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
};

const fetchGenres = async (token: string | null) => {
  return await axios.get<GenreType[]>("/api/genre", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Film = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

<<<<<<< HEAD:src/pages/Films.tsx
  const { data: filmData, refetch: refetchFilms } = useQuery({
    queryKey: ["filmList", currentPage],
    queryFn: () => fetchFilmList(getToken(), currentPage)
=======
  // Updated queryKey, queryFn, and data variable name
  const { data: filmResponse, refetch: refetchFilm } = useQuery({ // Renamed data variable
    queryKey: ["filmList", currentPage], // Changed query key
    queryFn: () => fetchFilmList(getToken(), currentPage) // Changed function call
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
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
<<<<<<< HEAD:src/pages/Films.tsx
    refetchFilms();
=======
    refetchFilm(); // Use renamed refetch function
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
<<<<<<< HEAD:src/pages/Films.tsx
    refetchFilms();
    setSelectedFilm(null);
=======
    refetchFilm(); // Use renamed refetch function
    setSelectedFilm(null); // Use renamed state setter
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

<<<<<<< HEAD:src/pages/Films.tsx
=======
  const film = filmResponse?.data?.data || []; // Extract film array
  // const totalFilm = filmResponse?.data?.total || 0; // Extract total count if available
  // const totalPages = Math.ceil(totalFilm / 12); // Calculate total pages if needed

>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
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

<<<<<<< HEAD:src/pages/Films.tsx
      {/* Film List Section */}
      {filmData && (
        <FilmList
          films={filmData.data}
=======
        {/* Film List Section - Pass renamed props */}
        {/* Pass film array directly */}
        <FilmList
          films={film}
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53:src/pages/Film.tsx
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

export default Film;