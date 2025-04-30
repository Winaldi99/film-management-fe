// GenreDetail.tsx - Modal to display genre details
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { GenreType } from "./Genre"; // Updated import path and type
import { CloseOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons"; // Added icons

interface GenreDetailProps {
  genre: GenreType; // Renamed prop and type
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GenreDetail = ({
  genre, // Renamed prop
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
      // Updated API endpoint with genre.id
      await axios.delete(`/api/genre/${genre.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete(); // Call onDelete callback from parent
      // onClose(); // Optionally close detail after delete
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete genre");
      // Keep the modal open to show the error
    } finally {
      setIsDeleting(false);
      // Don't automatically hide confirm dialog on error, let user cancel
      // setShowDeleteConfirm(false); 
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", { // Example: UK locale with time
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    // Changed styling: overlay background, opacity
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      {/* Changed styling: modal background, shape, shadow, width */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-xl shadow-2xl overflow-hidden w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in">
        {/* Changed styling: header padding, border, text */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <InfoCircleOutlined /> Genre Details {/* Changed Text */}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <CloseOutlined />
          </button>
        </div>

        {error && (
          // Changed styling: error message appearance
          <div className="m-4 bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500 text-red-800 dark:text-red-300 px-4 py-3 rounded-r text-sm" role="alert">
            <p><strong className="font-medium">Error:</strong> {error}</p>
          </div>
        )}

        {/* Changed styling: content padding */}
        <div className="p-5">
          {/* Changed styling: detail section background, padding, border */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg mb-5 border border-gray-200 dark:border-gray-600">
            {/* Use genre.category */}
            <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
              {genre.category}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {genre.description || <span className="italic text-gray-400">No description provided.</span>}
            </p>
          </div>

          {/* Changed styling: metadata text, spacing */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-700 dark:text-gray-300">Date Created:</span>
              <span>{formatDate(genre.created_at)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-700 dark:text-gray-300">Last Updated:</span>
              <span>{formatDate(genre.updated_at)}</span>
            </div>
          </div>

          {/* Changed styling: action buttons alignment, spacing, appearance */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-1.5 hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
            >
              <EditOutlined /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md flex items-center gap-1.5 hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-red-600 dark:hover:bg-gray-600 text-sm font-medium transition-colors shadow-sm"
            >
              <DeleteOutlined /> Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Dialog - Changed styling */}
        {showDeleteConfirm && (
          <div className="mx-5 mb-5 p-4 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-lg shadow-inner">
            <h3 className="text-base font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
              <ExclamationCircleOutlined /> Confirm Deletion
            </h3>
            {/* Use genre.category */}
            <p className="text-red-700 dark:text-red-200 text-sm mb-4">
              Are you sure you want to permanently delete the genre "{genre.category}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-1.5 bg-white border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 rounded-md text-sm hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-wait transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Add CSS for the animation (in your global CSS or a style tag) */}
      <style>{`
        @keyframes modal-scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-scale-in { animation: modal-scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GenreDetail;