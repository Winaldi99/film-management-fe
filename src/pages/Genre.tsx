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
    // Redesigned layout with sidebar-like structure
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Left sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-400">
            Genre Library
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your collection
          </p>
        </div>
        
        <div className="p-5">
          <button
            onClick={handleAddNewClick}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <PlusOutlined /> Create New Genre
          </button>
        </div>
        
        <div className="p-5 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Total Genres: {genreData?.data.length || 0}</p>
            <p className="mt-2">Current Page: {currentPage}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Genre List Section */}
        {genreData && (
          <GenreList
            genres={genreData.data}
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
    </div>
  );
};

export default Genre;