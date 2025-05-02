// FilmForm.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
// Renamed import source and types
import { FilmType, GenreType } from "../pages/Film";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

// Renamed interface and updated properties/types
interface FilmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  film: FilmType | null; // Renamed prop and type
  isEditMode: boolean;
  genres: GenreType[]; // Renamed prop and type
}

// Renamed state interface properties
interface FormData {
  title: string;
  director: string; // Renamed from author
  genreId: number; // Renamed from categoryId
  imageUrl: string;
}

// Renamed component and destructured props
const FilmForm = ({
  isOpen,
  onClose,
  onSubmit,
  film, // Renamed prop
  isEditMode,
  genres // Renamed prop
}: FilmFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Updated state structure and initial value logic
  const [formData, setFormData] = useState<FormData>({
    title: "",
    director: "", // Renamed field
    // Use genres for initial value
    genreId: genres.length > 0 ? genres[0].id : 0, // Renamed field
    imageUrl: ""
  });

  useEffect(() => {
    // If editing an existing film, populate the form
    if (isEditMode && film) { // Check film prop
      setFormData({
        title: film.title,
        director: film.director, // Use director field
        // Use genre_id and genres for value
        genreId: film.genre_id || (genres.length > 0 ? genres[0].id : 0), // Use genreId field
        imageUrl: film.image_url
      });
    } else if (!isEditMode) {
      // Reset form for adding new, ensuring default genre is set if available
       setFormData({
        title: "",
        director: "",
        genreId: genres.length > 0 ? genres[0].id : 0,
        imageUrl: ""
      });
    }
  // Watch film and genres now
  }, [isEditMode, film, genres]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Check for genreId when parsing
      [name]: name === "genreId" ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Prepare payload, ensuring correct property names if backend expects them
    // Adjust this payload structure if your backend expects different names (e.g., category_id instead of genreId)
    const payload = {
      title: formData.title,
      director: formData.director, // Use director
      genre_id: formData.genreId, // Map genreId back to category_id if needed by backend
      // OR if backend expects genre_id:
      // genre_id: formData.genreId,
      image_url: formData.imageUrl
    };

    try {
      if (isEditMode && film) { // Check film prop
        // Update existing film - updated endpoint and ID access
        await axios.put(`/api/films/${film.id}`, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new film - updated endpoint
        await axios.post("/api/films", payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      // Updated error message
      setError(err.response?.data?.message || "An error occurred while saving the film");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {/* Changed text */}
            {isEditMode ? "Edit Film" : "Add Film"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseOutlined />
          </button>
        </div>

        {error && (
          <div className="m-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter film title" // Changed placeholder text
            />
          </div>

          <div className="mb-4">
             {/* Changed label text and htmlFor */}
            <label htmlFor="director" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Director
            </label>
            <input
              type="text"
              id="director" // Changed id
              name="director" // Changed name
              required
              value={formData.director} // Use director field
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter director name" // Changed placeholder text
            />
          </div>

          <div className="mb-4">
             {/* Changed label text and htmlFor */}
            <label htmlFor="genreId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Genre
            </label>
            <select
              id="genreId" // Changed id
              name="genreId" // Changed name
              required
              value={formData.genreId} // Use genreId field
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {/* Check genres length */}
              {genres.length === 0 && (
                // Changed text
                <option value="">No genres available</option>
              )}
              {/* Map over genres */}
              {genres.map((genre) => (
                // Use genre id and name
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
             {/* Changed label text */}
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Poster URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter poster URL (optional)" // Changed placeholder text
            />
          </div>

          {formData.imageUrl && (
            <div className="mb-4">
               {/* Changed text */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Poster Preview:</p>
              <div className="w-full h-36 overflow-hidden rounded border border-gray-200 dark:border-gray-700">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Optional: Changed placeholder
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Poster';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
            >
              <SaveOutlined /> {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmForm; // Renamed default export