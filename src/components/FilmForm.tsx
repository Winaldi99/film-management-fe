// FilmForm.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { FilmType, GenreType } from "../pages/Film";
import { SaveOutlined, TagOutlined } from "@ant-design/icons";

interface FilmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  film: FilmType | null;
  isEditMode: boolean;
  genres: GenreType[];
}

// Update FormData interface to allow empty string for genreId
interface FormData {
  title: string;
  director: string;
  genreId: number | ''; // Allow number or empty string '' for "not selected"
  imageUrl: string;
}

const FilmForm = ({
  isOpen,
  onClose,
  onSubmit,
  film,
  isEditMode,
  genres
}: FilmFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize genreId with empty string ''
  const [formData, setFormData] = useState<FormData>({
    title: "",
    director: "",
    genreId: '', // <--- FIX: Default to empty string
    imageUrl: ""
  });

  useEffect(() => {
    setError(""); // Clear errors when modal opens/changes mode
    if (isEditMode && film) {
      setFormData({
        title: film.title,
        director: film.director,
        // Use film's genre_id if it exists and is not 0 (or null/undefined), otherwise default to ''
        genreId: film.genre_id ? film.genre_id : '', // <--- FIX: Default to '' if no valid film.genre_id
        imageUrl: film.image_url || ""
      });
    } else {
        // Reset form for 'Add' mode
         setFormData({
            title: "",
            director: "",
            genreId: '', // <--- FIX: Reset to empty string
            imageUrl: ""
        });
    }
    // We don't strictly need 'genres' here anymore for default value setting
  }, [isOpen, isEditMode, film]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Parse only if it's genreId AND the value is not empty string
      [name]: name === "genreId" ? (value === '' ? '' : parseInt(value, 10)) : value // <--- FIX: Handle '' correctly
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // *** IMPROVED VALIDATION ***
    if (!formData.title.trim()) {
        setError("Title is required.");
        return; // Stop submission
    }
    if (!formData.director.trim()) {
        setError("Director is required.");
        return; // Stop submission
    }
    // Check if a genre has been selected (it shouldn't be '' or potentially 0 if 0 is invalid)
    if (formData.genreId === '' || formData.genreId === 0) { // <--- FIX: Explicitly check for '' or 0
        setError("Please select a valid Genre.");
        return; // Stop submission
    }

    // If validation passes, proceed
    setIsSubmitting(true);
    setError("");

    // Payload now uses formData.genreId which we know is a valid number
    const payload = {
        title: formData.title.trim(),
        director: formData.director.trim(),
        genre_id: formData.genreId as number, // We validated it's a number (not ''), assert type
        image_url: formData.imageUrl.trim()
    };

    try {
      if (isEditMode && film) {
        await axios.put(`/api/film/${film.id}`, payload, { // Endpoint should be singular
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        await axios.post("/api/film", payload, { // Endpoint should be singular
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "An error occurred while saving the film.";
      if (err.response?.data?.errors) {
          // Handle specific validation errors from backend if structured that way
          const validationErrors = Object.entries(err.response.data.errors)
                                     .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                                     .join(' ');
          setError(`Validation failed: ${validationErrors || errorMsg}`);
      } else {
          setError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // ... (Modal structure)
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-850 rounded-xl shadow-xl overflow-hidden w-full max-w-lg max-h-[90vh] transform transition-all duration-300 scale-95 opacity-0 animate-modal-pop-in">
        {/* ... (Modal Header) */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-slate-700">
            {/* ... header content ... */}
        </div>

        {error && (
          <div className="mx-5 mt-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-130px)]">
          {/* ... (Title Input) ... */}
          {/* ... (Director Input) ... */}

          {/* Genre Select */}
          <div>
            <label htmlFor="genreId" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1">
              <TagOutlined /> Genre <span className="text-red-500">*</span>
            </label>
            <select
              id="genreId"
              name="genreId"
              required // Keep required for browser validation on ''
              value={formData.genreId} // Bind value correctly (can be '')
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8"
              // ... (background image style for dropdown arrow) ...
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
            >
              {/* Placeholder Option */}
              <option value="" disabled>
                 {/* Show loading text if genres haven't loaded yet */}
                 {genres.length === 0 ? "Loading genres..." : "-- Select a Genre --"}
              </option>

              {/* Map over available genres */}
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.category}
                </option>
              ))}
            </select>
          </div>

          {/* ... (Image URL Input) ... */}
          {/* ... (Image Preview) ... */}

           {/* Hidden submit button */}
           <button type="submit" className="hidden" aria-hidden="true" disabled={isSubmitting}></button>
        </form>

        {/* ... (Modal Footer with Cancel/Save Buttons) ... */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
             {/* Cancel Button */}
             <button
               type="button"
               onClick={onClose}
               className="px-5 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
               disabled={isSubmitting}
             >
               Cancel
             </button>
             {/* Submit Button */}
             <button
               type="submit" // Connects to form submission
               onClick={handleSubmit} // Also trigger on click
               disabled={isSubmitting || formData.genreId === ''} // Optionally disable if no genre selected
               className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
             >
               <SaveOutlined />
               {isSubmitting ? "Saving..." : isEditMode ? "Update Film" : "Save Film"}
             </button>
           </div>

      </div>
      {/* ... (style tag for animations) ... */}
    </div>
  );
};

export default FilmForm;