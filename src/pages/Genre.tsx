// Genre.tsx - Main component for managing genres
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import GenreList from "../components/GenreList"; // Renamed import
import GenreForm from "../components/GenreForm"; // Renamed import
import GenreDetail from "./GenreDetail"; // Renamed import
import { PlusCircleOutlined } from "@ant-design/icons"; // Changed Icon for variety

// Updated Type: 'name' changed to 'category'
export type GenreType = {
  id: number;
  category: string; // Changed from 'name'
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

// Updated fetch function name and endpoint
const fetchGenreList = async (token: string | null, page = 1, limit = 10) => {
  // Changed API endpoint
  return await axios.get<GenreType[]>(`/api/genre?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Genre = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  // Renamed state variable and type
  const [selectedGenre, setSelectedGenre] = useState<GenreType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Updated queryKey, queryFn, and data variable name
  const { data: genreData, refetch: refetchGenres } = useQuery({
    queryKey: ["genreList", currentPage], // Changed query key
    queryFn: () => fetchGenreList(getToken(), currentPage) // Changed function call
  });

  const handleAddNewClick = () => {
    setSelectedGenre(null); // Use renamed state setter
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Updated parameter type and state setter
  const handleEditClick = (genre: GenreType) => {
    setSelectedGenre(genre); // Use renamed state setter
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Updated parameter type and state setter
  const handleViewClick = (genre: GenreType) => {
    setSelectedGenre(genre); // Use renamed state setter
    setIsFormOpen(false); // Keep form closed when viewing details
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Optional: Deselect genre when form closes if not viewing details
    // if (!selectedGenre) {
    //   setSelectedGenre(null);
    // }
  };

  const handleCloseDetail = () => {
    setSelectedGenre(null); // Use renamed state setter
  };

  const handleFormSubmit = () => {
    refetchGenres(); // Use renamed refetch function
    setIsFormOpen(false);
    // Optionally close detail view after successful edit from detail view
    // setSelectedGenre(null);
  };

  const handleDeleteSuccess = () => {
    refetchGenres(); // Use renamed refetch function
    setSelectedGenre(null); // Use renamed state setter
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    // Changed styling: padding, max-width, background
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
        {/* Changed styling: text size, weight, color */}
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
          Genres Management
        </h1>
        <button
          onClick={handleAddNewClick}
          // Changed styling: background, hover, padding, shape, icon
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <PlusCircleOutlined /> Add New Genre
        </button>
      </div>

      {/* Genre List Section - Pass renamed props */}
      {genreData && (
        <GenreList
          genre={genreData.data} // Pass renamed prop 'genres'
          onEdit={handleEditClick}
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}

      {/* Genre Form Modal - Pass renamed prop 'genre' */}
      {isFormOpen && (
        <GenreForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          genre={isEditMode ? selectedGenre : null} // Pass renamed prop 'genre'
          isEditMode={isEditMode}
        />
      )}

      {/* Genre Detail Modal - Pass renamed prop 'genre' */}
      {/* Condition ensures Detail only shows if a genre is selected AND the form is NOT open */}
      {selectedGenre && !isFormOpen && (
        <GenreDetail
          genre={selectedGenre} // Pass renamed prop 'genre'
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedGenre)} // Pass correct genre object
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Genre;