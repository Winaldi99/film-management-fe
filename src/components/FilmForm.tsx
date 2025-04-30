// FilmForm.tsx - Modal form for adding/editing films
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { FilmType, GenreType } from "../pages/Film"; // Updated import path and types
import { CloseOutlined, SaveOutlined, VideoCameraOutlined, UserOutlined, TagOutlined, LinkOutlined, PictureOutlined, EditFilled, PlusCircleFilled } from "@ant-design/icons"; // Added icons

interface FilmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  film: FilmType | null; // Renamed prop and type
  isEditMode: boolean;
  genres: GenreType[]; // Renamed prop and type
}

// Updated FormData interface: 'author' -> 'director', 'categoryId' -> 'genreId', 'imageUrl' -> 'image_url' (match FilmType)
interface FormData {
  title: string;
  director: string; // Changed from 'author'
  genreId: number; // Changed from 'categoryId'
  imageUrl: string; // Changed from 'imageUrl', match backend expectation potentially (or rename if backend expects imageUrl)
}

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

  // Initialize with 'director' and 'genreId'
  const [formData, setFormData] = useState<FormData>({
    title: "",
    director: "", // Changed from 'author'
    genreId: genres.length > 0 ? genres[0].id : 0, // Changed from 'categoryId'
    imageUrl: ""
  });

  useEffect(() => {
    // Populate form if editing
    if (isEditMode && film) {
      setFormData({
        title: film.title,
        director: film.director, // Use film.director
        genreId: film.genre_id || (genres.length > 0 ? genres[0].id : 0), // Use film.genre_id
        imageUrl: film.image_url || "" // Use film.image_url
      });
    } else {
        // Reset form for 'Add' mode or when genres load
         setFormData({
            title: "",
            director: "",
            genreId: genres.length > 0 ? genres[0].id : 0,
            imageUrl: ""
        });
    }
    setError(""); // Clear errors when modal opens/changes mode
  }, [isOpen, isEditMode, film, genres]); // Depend on genres too

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // 'name' is the input's name attribute ('title', 'director', 'genreId', 'imageUrl')
      [name]: name === "genreId" ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const payload = {
        title: formData.title.trim(),
        director: formData.director.trim(),
        genre_id: formData.genreId,
        image_url: formData.imageUrl.trim()
    };

    if (!payload.title || !payload.director || !payload.genre_id) {
        setError("Title, Director, and Genre are required.");
        setIsSubmitting(false);
        return;
    }

    try {
      if (isEditMode && film) {
        // Update existing film - Gunakan endpoint singular
        await axios.put(`/api/film/${film.id}`, payload, { // <--- UBAH DI SINI
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new film - Gunakan endpoint singular
        await axios.post("/api/film", payload, { // <--- UBAH DI SINI
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "An error occurred while saving the film.";
      if (err.response?.data?.errors) {
          const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
          setError(`Validation failed: ${validationErrors}`);
      } else {
          setError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Changed styling: Overlay with blur
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
      {/* Changed styling: Modal container - different background, shape, max-height */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-850 rounded-xl shadow-xl overflow-hidden w-full max-w-lg max-h-[90vh] transform transition-all duration-300 scale-95 opacity-0 animate-modal-pop-in">
        {/* Changed styling: Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {isEditMode ? <EditFilled/> : <PlusCircleFilled/>}
            {isEditMode ? "Edit Film" : "Add New Film"} {/* Changed Text */}
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
          <div className="mx-5 mt-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Changed styling: Form with padding and scroll */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-130px)]"> {/* Adjust max-h based on header/footer */}
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1">
                <VideoCameraOutlined /> Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              // Changed styling: Input field
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
              placeholder="Enter film title (e.g., Blade Runner)"
            />
          </div>

          {/* Director Input */}
          <div>
            {/* Changed label text and htmlFor */}
            <label htmlFor="director" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1">
              <UserOutlined /> Director <span className="text-red-500">*</span>
            </label>
            {/* Changed input id, name, value binding */}
            <input
              type="text"
              id="director"
              name="director" // Use 'director' here
              required
              value={formData.director}
              onChange={handleChange}
              // Changed styling: Input field
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
              placeholder="Enter director's name (e.g., Ridley Scott)"
            />
          </div>

          {/* Genre Select */}
          <div>
             {/* Changed label text and htmlFor */}
            <label htmlFor="genreId" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1">
              <TagOutlined /> Genre <span className="text-red-500">*</span>
            </label>
            {/* Changed select id, name, value binding */}
            <select
              id="genreId"
              name="genreId" // Use 'genreId' here
              required
              value={formData.genreId}
              onChange={handleChange}
              // Changed styling: Select field
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
            >
              {/* Map over renamed 'genres' prop */}
              {genres.length === 0 ? (
                <option value="" disabled>Loading genres...</option>
              ) : (
                genres.map((genre) => (
                  // Use genre.id and genre.name
                  <option key={genre.id} value={genre.id}>
                    {genre.category}
                  </option>
                ))
              )}
               {genres.length > 0 && formData.genreId === 0 && (
                    <option value="" disabled>-- Select a Genre --</option>
               )}
            </select>
          </div>

          {/* Image URL Input */}
          <div>
            <label htmlFor="imageUrl" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1">
               <LinkOutlined /> Poster Image URL <span className="text-xs text-gray-400">(Optional)</span>
            </label>
            {/* Changed input id, name, value binding */}
            <input
              type="text" // Consider type="url" for basic validation
              id="imageUrl"
              name="imageUrl" // Use 'imageUrl' here
              value={formData.imageUrl}
              onChange={handleChange}
              // Changed styling: Input field
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div>
                <p className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1 gap-1"><PictureOutlined /> Image Preview:</p>
                {/* Changed styling: Image preview container */}
                <div className="w-full h-40 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <img
                    src={formData.imageUrl}
                    alt="Poster Preview"
                    className="w-auto h-full object-contain" // Use contain to see the whole preview
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'; // Hide broken image icon
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent && !parent.querySelector('.placeholder-text')) { // Add text only once
                          const placeholderText = document.createElement('span');
                          placeholderText.className = 'text-red-500 text-xs placeholder-text';
                          placeholderText.textContent = 'Invalid Image URL';
                          parent.appendChild(placeholderText);
                      }
                    }}
                    onLoad={(e) => { // Remove placeholder text if image loads
                        const parent = (e.target as HTMLImageElement).parentElement;
                         (e.target as HTMLImageElement).style.display = 'block';
                        const placeholder = parent?.querySelector('.placeholder-text');
                        if (placeholder) parent?.removeChild(placeholder);
                    }}
                />
                 {/* Add initial placeholder for invalid URL case */}
                {!formData.imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) && !formData.imageUrl.startsWith('data:image') && (
                     <span className="text-gray-400 text-xs">Enter a valid image URL</span>
                 )}
                </div>
            </div>
          )}

           {/* Add hidden submit button to allow Enter key submission */}
           <button type="submit" className="hidden" aria-hidden="true" disabled={isSubmitting}></button>
        </form>

        {/* Changed styling: Form Actions/Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            // Changed styling: Cancel button
            className="px-5 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit" // Connects to form submission
            onClick={handleSubmit} // Also trigger on click
            disabled={isSubmitting}
            // Changed styling: Save/Update button
            className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-wait flex items-center gap-1.5 font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            <SaveOutlined />
            {isSubmitting ? "Saving..." : isEditMode ? "Update Film" : "Save Film"}
          </button>
        </div>
      </div>
       {/* Add CSS for animations */}
       <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes modalPopIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-pop-in { animation: modalPopIn 0.3s ease-out 0.1s forwards; }
      `}</style>
    </div>
  );
};

export default FilmForm;