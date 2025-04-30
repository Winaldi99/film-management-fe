// FilmDetail.tsx - Modal to display film details
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { FilmType } from "./Films"; // Updated import path and type
import { CloseOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, TagOutlined, ExclamationCircleFilled, VideoCameraOutlined } from "@ant-design/icons"; // Added icons

interface FilmDetailProps {
  film: FilmType; // Renamed prop and type
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const FilmDetail = ({
  film, // Renamed prop
  onClose,
  onEdit,
  onDelete
}: FilmDetailProps) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      // Updated API endpoint with film.id
      await axios.delete(`/api/films/${film.id}`, { // Changed endpoint
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete(); // Call onDelete callback from parent
    } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete film");
      // Keep the modal open to show the error
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", { // Example: UK locale
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    // Changed styling: Overlay with blur
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
      {/* Changed styling: Modal container - wider, different background, rounded */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-modal-pop-in">
        {/* Changed styling: Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <VideoCameraOutlined /> Film Details {/* Changed Text */}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded-full p-1 hover:bg-gray-200 dark:hover:bg-slate-600"
            aria-label="Close modal"
          >
            <CloseOutlined />
          </button>
        </div>

        {error && (
          // Changed styling: Error alert
          <div className="m-5 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-800 dark:text-red-300 p-4 rounded-r-md text-sm" role="alert">
            <p><strong className="font-bold">Error:</strong> {error}</p>
          </div>
        )}

        {/* Changed styling: Content Area Layout (Image top, details below) */}
        <div className="max-h-[80vh] overflow-y-auto">
            <div className="h-64 md:h-80 w-full relative overflow-hidden">
                {film.image_url ? (
                <img
                    src={film.image_url}
                    alt={`Poster for ${film.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400/cccccc/969696?text=Poster+Not+Available';
                    }}
                    loading="lazy"
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600">
                    <VideoCameraOutlined className="text-6xl text-gray-500 dark:text-gray-400 opacity-60" />
                </div>
                )}
                {/* Title overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                     <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 shadow-text">{film.title}</h1>
                </div>
            </div>

            <div className="p-5">
              {/* Use film.director */}
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4 flex items-center gap-2">
                <UserOutlined className="text-gray-500 dark:text-gray-400" /> Directed by <span className="font-medium">{film.director}</span>
              </p>

              {/* Use film.genre */}
              <div className="mb-5 flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Genre:</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900/60 px-3 py-1 rounded-full text-sm font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-1">
                       <TagOutlined /> {film.genre?.category || "Unspecified"}
                  </span>
              </div>


              {/* Changed styling: Metadata section */}
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 border-t pt-4 border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    <span className="w-28 font-medium text-gray-600 dark:text-gray-300">Added on:</span>
                    <span>{formatDate(film.created_at)}</span>
                </div>
                {film.updated_at !== film.created_at && (
                    <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    <span className="w-28 font-medium text-gray-600 dark:text-gray-300">Updated:</span>
                    <span>{formatDate(film.updated_at)}</span>
                    </div>
                )}
              </div>

            {/* Delete Confirmation Dialog - Changed styling */}
            {showDeleteConfirm && (
                <div className="mt-6 p-4 border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-inner">
                <h3 className="text-md font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                    <ExclamationCircleFilled /> Confirm Deletion
                </h3>
                {/* Use film.title */}
                <p className="text-red-700 dark:text-red-200 text-sm mb-4">
                    Are you sure you want to permanently delete the film "{film.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-slate-500 transition-colors"
                    disabled={isDeleting}
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handleDelete}
                    className="px-4 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-wait transition-colors flex items-center gap-1"
                    disabled={isDeleting}
                    >
                    <DeleteOutlined/> {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
                </div>
            )}
            </div>
        </div>


        {/* Changed styling: Footer Action buttons */}
        {!showDeleteConfirm && (
            <div className="flex justify-end space-x-3 p-5 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <button
                onClick={onEdit}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1.5 hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
                <EditOutlined /> Edit
            </button>
            <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-5 py-2 bg-white dark:bg-slate-600 border border-red-500 text-red-500 dark:text-red-400 dark:border-red-600 rounded-lg flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-slate-500 text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
                <DeleteOutlined /> Delete
            </button>
            </div>
        )}
      </div>
      {/* Add CSS for animations & text shadow */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes modalPopIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-pop-in { animation: modalPopIn 0.3s ease-out 0.1s forwards; }
        .shadow-text { text-shadow: 1px 1px 3px rgba(0,0,0,0.7); }
      `}</style>
    </div>
  );
};

export default FilmDetail;