// Genre.tsx - Main component
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

  const { data: genreData, refetch: refetchGenres } = useQuery({
    queryKey: ["genreList", currentPage],
    queryFn: () => fetchGenreList(getToken(), currentPage)
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
    refetchGenres();
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchGenres();
    setSelectedGenre(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Genres
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
  );
};

export default Genre;