// Films.tsx - Main component for managing films
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import FilmList from "../components/FilmList"; // Renamed import
import FilmForm from "../components/FilmForm"; // Renamed import
import FilmDetail from "./FIlmDetail"; // Renamed import
import { VideoCameraAddOutlined } from "@ant-design/icons"; // Changed Icon

// Updated Type: Renamed, 'author' -> 'director', 'category'/'category_id' -> 'genre'/'genre_id'
export type FilmType = {
  id: number;
  title: string;
  director: string; // Changed from 'author'
  genre_id: number; // Changed from 'category_id'
  genre: { // Changed from 'category'
    id: number;
    name: string; // Assuming Genre API returns 'name'
  };
  image_url: string;
  created_at: string;
  updated_at: string;
};

// Renamed Type for clarity (could reuse from Genre page if structure is identical)
export type GenreType = {
  id: number;
  name: string; // Assuming Genre API returns 'name'
};

// Updated fetch function name and endpoint
const fetchFilmList = async (token: string | null, page = 1, limit = 12) => { // Increased limit for grid view
  // Changed API endpoint
  return await axios.get<{ data: FilmType[], total: number }>( // Assuming API returns pagination data
    `/api/films?page=${page}&limit=${limit}`, // Changed endpoint
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Updated fetch function name and endpoint
const fetchGenres = async (token: string | null) => {
  // Changed API endpoint
  return await axios.get<GenreType[]>("/api/genre", { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Films = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  // Renamed state variable and type
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Updated queryKey, queryFn, and data variable name
  const { data: filmResponse, refetch: refetchFilms } = useQuery({ // Renamed data variable
    queryKey: ["filmList", currentPage], // Changed query key
    queryFn: () => fetchFilmList(getToken(), currentPage) // Changed function call
  });

  // Updated queryKey, queryFn, and data variable name
  const { data: genreData } = useQuery({
    queryKey: ["genres"], // Changed query key
    queryFn: () => fetchGenres(getToken()) // Changed function call
  });

  const handleAddNewClick = () => {
    setSelectedFilm(null); // Use renamed state setter
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Updated parameter type and state setter
  const handleEditClick = (film: FilmType) => {
    setSelectedFilm(film); // Use renamed state setter
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Updated parameter type and state setter
  const handleViewClick = (film: FilmType) => {
    setSelectedFilm(film); // Use renamed state setter
    setIsFormOpen(false); // Keep form closed when viewing details
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedFilm(null); // Use renamed state setter
  };

  const handleFormSubmit = () => {
    refetchFilms(); // Use renamed refetch function
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchFilms(); // Use renamed refetch function
    setSelectedFilm(null); // Use renamed state setter
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const films = filmResponse?.data?.data || []; // Extract films array
  // const totalFilms = filmResponse?.data?.total || 0; // Extract total count if available
  // const totalPages = Math.ceil(totalFilms / 12); // Calculate total pages if needed

  return (
    // Changed styling: background, padding, max-width
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-slate-800 min-h-screen p-5 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          {/* Changed styling: Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            My Film Collection
          </h1>
          <button
            onClick={handleAddNewClick}
            // Changed styling: Add button
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <VideoCameraAddOutlined /> Add Film
          </button>
        </div>

        {/* Film List Section - Pass renamed props */}
        {/* Pass films array directly */}
        <FilmList
          films={films}
          onEdit={handleEditClick}
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          // Pass totalPages if available for better pagination control
          // totalPages={totalPages}
        />

        {/* Film Form Modal - Pass renamed props */}
        {isFormOpen && (
          <FilmForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            film={isEditMode ? selectedFilm : null} // Pass renamed prop 'film'
            isEditMode={isEditMode}
            genres={genreData?.data || []} // Pass renamed prop 'genres'
          />
        )}

        {/* Film Detail Modal - Pass renamed prop 'film' */}
        {/* Condition ensures Detail only shows if a film is selected AND the form is NOT open */}
        {selectedFilm && !isFormOpen && (
          <FilmDetail
            film={selectedFilm} // Pass renamed prop 'film'
            onClose={handleCloseDetail}
            onEdit={() => handleEditClick(selectedFilm)} // Pass correct film object
            onDelete={handleDeleteSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Films;