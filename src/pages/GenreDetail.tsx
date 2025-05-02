// GenreDetail.tsx
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { GenreType } from "./Genre";
import { CloseOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, LockOutlined } from "@ant-design/icons";

interface GenreDetailProps {
  genre: GenreType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GenreDetail = ({
  genre,
  onClose,
  onEdit,
  onDelete
}: GenreDetailProps) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/genre/${genre.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete genre");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    // New layout: Changed modal design with sidebar layout
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden w-full max-w-2xl flex flex-col md:flex-row">
        {/* Sidebar with color accent */}
        <div className="bg-purple-100 dark:bg-purple-900 md:w-1/3 p-6">
          <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-3">
            {genre.name}
          </h2>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
            <CalendarOutlined className="mr-2" />
            <span>Created: {formatDate(genre.created_at)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <LockOutlined className="mr-2" />
            <span>Updated: {formatDate(genre.updated_at)}</span>
          </div>
          
          <div className="mt-6 space-y-2">
            <button
              onClick={onEdit}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 text-sm"
            >
              <EditOutlined /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 text-sm"
            >
              <DeleteOutlined /> Delete
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6 md:w-2/3 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseOutlined />
          </button>
          
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Description
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4 min-h-40">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {genre.description}
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="mt-4 p-4 border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-red-600 dark:text-red-300 text-sm mb-3">
                Are you sure you want to delete "{genre.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreDetail;