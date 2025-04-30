// GenreForm.tsx - Modal form for adding/editing genre
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { GenreType } from "../pages/Genre"; // Updated import path and type
import { CloseOutlined, SaveOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"; // Added icons

interface GenreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  genre: GenreType | null; // Renamed prop and type
  isEditMode: boolean;
}

// Updated FormData interface to use 'category' key
interface FormData {
  category: string; // Changed from 'name'
  description: string;
}

const GenreForm = ({
  isOpen,
  onClose,
  onSubmit,
  genre, // Renamed prop
  isEditMode
}: GenreFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize with 'category' key
  const [formData, setFormData] = useState<FormData>({
    category: "", // Changed from 'name'
    description: ""
  });

  useEffect(() => {
    if (isEditMode && genre) {
      // Populate form using genre.category
      setFormData({
        category: genre.category, // Use genre.category
        description: genre.description
      });
    } else {
      // Reset form
      setFormData({
        category: "", // Reset 'category'
        description: ""
      });
    }
    setError(""); // Clear error when modal opens or mode changes
  }, [isOpen, isEditMode, genre]); // Depend on isOpen to reset form when re-opened for 'Add'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // 'name' here refers to the input's name attribute ('category' or 'description')
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Ensure the payload matches the expected backend structure (using 'category')
    const payload: FormData = {
      category: formData.category.trim(), // Trim whitespace
      description: formData.description.trim() // Trim whitespace
    };
    
    // Basic validation example
    if (!payload.category) {
        setError("Genre name cannot be empty.");
        setIsSubmitting(false);
        return;
    }

    try {
      if (isEditMode && genre) {
        // Update existing genre - Updated endpoint
        await axios.put(`/api/genre/${genre.id}`, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new genre - Updated endpoint
        await axios.post("/api/genre", payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit(); // Call parent onSubmit (refreshes list, closes form)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error || // Check for different error structures
          "An error occurred while saving the genre."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Changed styling: overlay background, opacity
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      {/* Changed styling: modal background, shape, shadow, width */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in">
        {/* Changed styling: header padding, border, text, icon */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
             {isEditMode ? <EditOutlined/> : <PlusOutlined/>}
             {isEditMode ? "Edit Genre" : "Add New Genre"} {/* Changed Text */}
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
           <div className="mx-5 mt-4 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2.5 rounded text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Changed styling: form padding */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            {/* Changed label text and htmlFor to 'category' */}
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Genre Name {/* Changed Label Text */}
            </label>
            {/* Changed input id and name to 'category', value binding */}
            <input
              type="text"
              id="category"
              name="category" // Ensure this matches the key in FormData and handleChange
              required
              value={formData.category}
              onChange={handleChange}
              // Changed styling: input appearance
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="e.g., Science Fiction, Fantasy, Thriller"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description <span className="text-xs text-gray-400">(Optional)</span>
            </label>
            {/* Changed styling: textarea appearance */}
            <textarea
              id="description"
              name="description"
              // Removed required attribute to make it optional
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-y"
              placeholder="Provide a brief description of the genre"
            ></textarea>
          </div>

          {/* Changed styling: button container, button appearance */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              // Changed styling: submit button appearance
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-wait flex items-center gap-1.5 font-medium transition-colors shadow-sm"
            >
              <SaveOutlined />
              {isSubmitting ? "Saving..." : isEditMode ? "Update Genre" : "Save Genre"}
            </button>
          </div>
        </form>
      </div>
       {/* Add CSS for the animation */}
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

export default GenreForm;