// Genre.tsx - Main component for managing genre
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import GenreList from "../components/GenreList";
import GenreForm from "../components/GenreForm";
import GenreDetail from "./GenreDetail";
import { PlusOutlined } from "@ant-design/icons";

export type GenreType = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

const fetchGenreList = async (
  token: string | null,
  page = 1,
  limit = 10
) => {
  return await axios.get<GenreType[]>(
    `/api/genre?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

const Genre = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<GenreType | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Updated queryKey, queryFn, and data variable name
  const { data: genreData, refetch: refetchGenre } = useQuery({
    queryKey: ["genreList", currentPage], // Changed query key
    queryFn: () => fetchGenreList(getToken(), currentPage) // Changed function call
  });

  const handleAddNewClick = () => {
    setSelectedGenre(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (genre: GenreType) => {
    setSelectedGenre(genre);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (genre: GenreType) => {
    setSelectedGenre(genre);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedGenre(null);
  };

  const handleFormSubmit = () => {
    refetchGenre(); // Use renamed refetch function
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchGenre(); // Use renamed refetch function
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
          Genre Management
        </h1>
        <button
          onClick={handleAddNewClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm transition-colors duration-200"
        >
          <PlusOutlined /> Add Genre
        </button>
      </div>

      {/* Genre List Section */}
      {genreData && (
        <GenreList
          genres={genreData.data} // Pass renamed prop 'genre'
          onEdit={handleEditClick}
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}

      {/* Genre Form Modal */}
      {isFormOpen && (
        <GenreForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          genre={isEditMode ? selectedGenre : null}
          isEditMode={isEditMode}
        />
      )}

      {/* Genre Detail Modal - Pass renamed prop 'genre' */}
      {selectedGenre && !isFormOpen && (
        <GenreDetail
          genre={selectedGenre}
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedGenre)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Genre;