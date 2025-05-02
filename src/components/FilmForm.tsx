// FilmForm.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
// Pastikan path import ini benar mengarah ke file definisi type Anda
import { FilmType, GenreType } from "../pages/Film"; // <-- Sesuaikan path jika perlu
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

// Interface untuk props komponen
interface FilmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // Callback setelah submit sukses
  film: FilmType | null; // Data film jika mode edit
  isEditMode: boolean;
  genres: GenreType[]; // Daftar genre yang tersedia
}

// Interface untuk state form data
interface FormData {
  title: string;
  director: string;
  // Tipe genreId diubah menjadi number | "" untuk menangani kondisi "belum dipilih"
  genreId: number | ""; // <--- PERUBAHAN TIPE
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

  // Inisialisasi state form data
  const [formData, setFormData] = useState<FormData>({
    title: "",
    director: "",
    // Nilai awal genreId diubah menjadi string kosong "" (belum dipilih)
    genreId: "", // <--- PERUBAHAN NILAI AWAL
    imageUrl: ""
  });

  // Effect untuk mengisi form saat mode edit atau mereset saat mode tambah
  useEffect(() => {
    if (isEditMode && film) {
      // Mode Edit: Isi form dengan data film
      setFormData({
        title: film.title,
        director: film.director,
        // Gunakan genre_id dari film, atau "" jika tidak ada (meski seharusnya ada)
        genreId: film.genre_id || "", // <--- PENYESUAIAN EDIT
        imageUrl: film.image_url || "" // Gunakan || "" untuk handle null/undefined
      });
    } else if (!isEditMode) {
      // Mode Tambah: Reset form ke nilai awal
      setFormData({
        title: "",
        director: "",
        // Reset genreId ke string kosong ""
        genreId: "", // <--- PENYESUAIAN RESET
        imageUrl: ""
      });
    }
    // Hapus 'genres' dari dependency array agar tidak memicu reset saat genres baru terload
  }, [isEditMode, film]); // <--- DEPENDENCY ARRAY DIPERBAIKI

  // Handler untuk perubahan pada input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Jika field adalah genreId:
      // - Jika value ada (bukan string kosong), parse ke integer
      // - Jika value kosong, set state ke string kosong ""
      // Untuk field lain, gunakan value apa adanya
      [name]: name === "genreId" ? (value ? parseInt(value, 10) : "") : value // <--- LOGIKA PARSE DIPERBAIKI
    });
  };

  // Handler saat form disubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDASI FRONTEND SEBELUM SUBMIT ---
    if (formData.genreId === "" || typeof formData.genreId !== 'number' || formData.genreId <= 0) {
      setError("Please select a valid genre."); // Tampilkan pesan error
      return; // Hentikan submit jika genre tidak valid
    }
    // --- AKHIR VALIDASI ---

    setIsSubmitting(true);
    setError(""); // Bersihkan error sebelumnya

    // Siapkan payload untuk dikirim ke API
    // Pastikan nama field (genre_id) sesuai dengan ekspektasi backend Anda
    const payload = {
      title: formData.title,
      director: formData.director,
      genre_id: formData.genreId, // <--- Pastikan backend mengharapkan 'genre_id'
      image_url: formData.imageUrl
    };

    try {
      if (isEditMode && film) {
        // Mode Edit: Kirim request PUT
        await axios.put(`/api/films/${film.id}`, payload, { // Endpoint: /api/films/{id}
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Mode Tambah: Kirim request POST
        await axios.post("/api/films", payload, { // Endpoint: /api/films
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit(); // Panggil callback onSubmit dari props jika sukses
    } catch (err: any) {
      // Tangani error dari API
      const apiErrorMessage = err.response?.data?.message || err.message || "An unknown error occurred";
      console.error("API Error:", err.response?.data || err); // Log detail error
      setError(`Failed to save film: ${apiErrorMessage}`); // Tampilkan pesan error ke pengguna
    } finally {
      setIsSubmitting(false); // Set isSubmitting kembali ke false
    }
  };

  // Jangan render apapun jika modal tidak terbuka (isOpen false)
  if (!isOpen) return null;

  // Render JSX
  return (
    <div className="fixed inset-0 bg-slate-100 bg-opacity-30 flex items-center justify-center z-50 p-4">
      {/* Container Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {isEditMode ? "Edit Film" : "Add Film"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Konten Form (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          {/* Tampilkan Pesan Error Global */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Input Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter film title"
              disabled={isSubmitting}
            />
          </div>

          {/* Input Director */}
          <div className="mb-4">
            <label htmlFor="director" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Director <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="director"
              name="director"
              required
              value={formData.director}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter director name"
              disabled={isSubmitting}
            />
          </div>

          {/* Dropdown Genre */}
          <div className="mb-4">
            <label htmlFor="genreId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              id="genreId"
              name="genreId"
              value={formData.genreId} // Bind ke state (bisa number atau "")
              onChange={handleChange}
              required // Validasi HTML5
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              // Disable jika genre belum ada atau sedang submit
              disabled={genres.length === 0 || isSubmitting}
            >
              {/* Opsi placeholder, tidak bisa dipilih */}
              <option value="" disabled>
                {genres.length === 0 ? "Loading genres..." : "-- Select a Genre --"}
              </option>
              {/* Render opsi genre */}
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
             {/* Opsional: Tampilkan error spesifik genre jika ada */}
             {error && error.toLowerCase().includes("genre") && !formData.genreId && <p className="text-xs text-red-500 mt-1">Please select a genre.</p>}
          </div>

          {/* Input Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Poster URL
            </label>
            <input
              type="text" // Bisa diubah ke type="url" untuk validasi browser dasar
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter poster URL (optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Preview Gambar */}
          {formData.imageUrl && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Poster Preview:</p>
              <div className="w-full h-36 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Poster Preview"
                  className="w-full h-full object-contain" // Gunakan object-contain agar tidak terpotong
                  // Fallback jika URL gambar error
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none'; // Sembunyikan img tag jika error
                    // Atau tampilkan placeholder
                    // target.src = 'https://via.placeholder.com/300x200?text=Invalid+Poster';
                  }}
                  // Tampilkan kembali jika URL diubah dan valid (opsional)
                  onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                />
                {/* Teks placeholder jika gambar gagal load */}
                 <span style={{ display: formData.imageUrl ? 'none' : 'block' }} className="text-gray-400 dark:text-gray-500 text-sm">Invalid Poster URL</span>
              </div>
            </div>
          )}

          {/* Tombol Aksi Form */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={isSubmitting} // Disable saat submit
            >
              Cancel
            </button>
            <button
              type="submit"
              // Disable saat submit ATAU jika genre belum dipilih
              disabled={isSubmitting || formData.genreId === ""} // <--- KONDISI DISABLED DIPERBAIKI
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

export default FilmForm;