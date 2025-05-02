// GenreDetail.tsx
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { GenreType } from "./Genre";
import { CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md animate-fadeIn">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Genre Details
            </h2>
            <button
              onClick={onClose}
              className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <CloseOutlined />
            </button>
          </div>
          <h3 className="text-2xl font-bold mt-4 mb-1">{genre.name}</h3>
        </div>

        {error && (
          <div className="m-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">Description</h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{genre.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">Created</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">{formatDate(genre.created_at)}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">Last Updated</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">{formatDate(genre.updated_at)}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={onEdit}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <EditOutlined /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
            >
              <DeleteOutlined /> Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete <span className="font-semibold">"{genre.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreDetail;