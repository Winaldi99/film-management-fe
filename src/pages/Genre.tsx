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
    // New layout: Changed container style, gradient background
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      {/* Header area with shadow */}
      <div className="bg-white dark:bg-gray-800 shadow-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
            Genre Library
          </h1>
          <button
            onClick={handleAddNewClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-colors duration-200 shadow-sm"
          >
            <PlusOutlined /> New Genre
          </button>
        </div>
      </div>
      
      {/* Main content container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Your Collection
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Manage and organize your genres
            </div>
          </div>
          
          {/* Genre List with new styling */}
          {genreData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <GenreList
                genres={genreData.data}
                onEdit={handleEditClick}
                onView={handleViewClick}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      </div>

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

      {/* Genre Detail Modal */}
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