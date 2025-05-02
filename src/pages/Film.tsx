// Film.tsx - Main component
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import FilmList from "../components/FilmList"; // Renamed import
import FilmForm from "../components/FilmForm"; // Renamed import
import FilmDetail from "./FilmDetail"; // Renamed import
import { PlusOutlined } from "@ant-design/icons";

// Renamed Type and updated properties
export type FilmType = {
  id: number;
  title: string;
  director: string; // Renamed from author
  genre_id: number; // Renamed from category_id
  genre: { // Renamed from category
    id: number;
    name: string;
  };
  image_url: string; // Kept as image_url, could be poster_url if preferred
  created_at: string;
  updated_at: string;
};

// Renamed Type
export type GenreType = {
  id: number;
  name: string;
};

// Renamed function, updated endpoint and return type
const fetchFilmList = async (token: string | null, page = 1, limit = 10) => {
  return await axios.get<FilmType[]>(`/api/films?page=${page}&limit=${limit}`, { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Renamed function, updated endpoint and return type
const fetchGenres = async (token: string | null) => {
  return await axios.get<GenreType[]>("/api/genre", { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Renamed component
const Film = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  // Renamed state and type
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Renamed query data, key, and function
  const { data: filmData, refetch: refetchFilm } = useQuery({
    queryKey: ["filmList", currentPage], // Changed query key
    queryFn: () => fetchFilmList(getToken(), currentPage) // Changed function call
  });

  // Renamed query data, key, and function
  const { data: genreData } = useQuery({
    queryKey: ["genres"], // Changed query key
    queryFn: () => fetchGenres(getToken()) // Changed function call
  });

  const handleAddNewClick = () => {
    setSelectedFilm(null); // Changed state setter
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Updated parameter name and type, changed state setter
  const handleEditClick = (films: FilmType) => {
    setSelectedFilm(films);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Updated parameter name and type, changed state setter
  const handleViewClick = (films: FilmType) => {
    setSelectedFilm(films);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedFilm(null); // Changed state setter
  };

  const handleFormSubmit = () => {
    refetchFilm(); // Changed refetch function
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchFilm(); // Changed refetch function
    setSelectedFilm(null); // Changed state setter
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          My Films Collection {/* Changed text */}
        </h1>
        <button
          onClick={handleAddNewClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm transition-colors duration-200"
        >
          <PlusOutlined /> Add Film {/* Changed text */}
        </button>
      </div>

      {/* Film List Section */}
      {filmData && (
        <FilmList // Renamed component
          film={filmData.data} // Changed prop name and data source
          onEdit={handleEditClick}
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}

      {/* Film Form Modal */}
      {isFormOpen && (
        <FilmForm// Renamed component
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          film={isEditMode ? selectedFilm : null} // Changed prop name and data source
          isEditMode={isEditMode}
          genres={genreData?.data || []} // Changed prop name and data source
        />
      )}

      {/* Film Detail Modal */}
      {/* Changed condition variable */}
      {selectedFilm && !isFormOpen && (
        <FilmDetail // Renamed component
          films={selectedFilm} // Changed prop name and data source
          onClose={handleCloseDetail}
          // Pass the correct selected item
          onEdit={() => handleEditClick(selectedFilm)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Film; // Renamed default export