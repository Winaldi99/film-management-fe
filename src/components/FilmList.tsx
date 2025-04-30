// FilmList.tsx - Component to display list of films in a card grid
import { FilmType } from "../pages/Films"; // Updated import path and type
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined, PlayCircleOutlined, TagOutlined } from "@ant-design/icons"; // Added icons

interface FilmListProps {
  films: FilmType[]; // Renamed prop and type
  onEdit: (film: FilmType) => void; // Updated type
  onView: (film: FilmType) => void; // Updated type
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages?: number; // Optional: for disabling next button
}

const FilmList = ({
  films, // Renamed prop
  onEdit,
  onView,
  onPageChange,
  currentPage,
  totalPages
}: FilmListProps) => {
  const hasNextPage = totalPages ? currentPage < totalPages : films.length > 0; // Basic check if next page likely exists

  return (
    <div>
      {films.length === 0 ? (
        // Changed styling: Empty state message
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
           <PlayCircleOutlined className="text-5xl text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No films found.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your film collection is empty. Add a film!</p>
        </div>
      ) : (
        // Changed styling: Grid layout for cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {/* Use renamed variable 'films' and 'film' */}
          {films.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              onEdit={() => onEdit(film)}
              onView={() => onView(film)}
            />
          ))}
        </div>
      )}

      {/* Pagination - Changed Styling */}
      {films.length > 0 && ( // Only show pagination if there are items
        <div className="flex justify-center mt-8 py-4">
          <nav className="flex items-center space-x-3" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous Page"
              // Changed styling: Pagination buttons
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <LeftOutlined className="text-base" />
            </button>
            <span className="px-4 py-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-sm font-semibold">
              Page {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNextPage} // Use calculated value
              aria-label="Next Page"
              // Changed styling: Pagination buttons
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <RightOutlined className="text-base" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

// Renamed component and props
interface FilmCardProps {
  film: FilmType;
  onEdit: () => void;
  onView: () => void;
}

const FilmCard = ({ film, onEdit, onView }: FilmCardProps) => {
  return (
    // Changed styling: Card appearance, hover effect
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
      <div className="relative h-56 sm:h-64 w-full overflow-hidden">
        {film.image_url ? (
          <img
            src={film.image_url}
            alt={film.title}
            // Changed styling: Image scaling on hover
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/cccccc/969696?text=No+Poster'; // Placeholder image
            }}
            loading="lazy" // Add lazy loading
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
            <PlayCircleOutlined className="text-4xl text-gray-500 dark:text-gray-400 opacity-50" />
          </div>
        )}
        {/* Changed styling: Genre badge position and style */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
          <TagOutlined />
          {film.genre?.category || "N/A"} {/* Use film.genre */}
        </div>
      </div>
      {/* Changed styling: Card content area */}
      <div className="p-4">
        {/* Use film.title */}
        <h3 className="font-semibold text-base text-gray-800 dark:text-white mb-1 truncate" title={film.title}>
            {film.title}
        </h3>
        {/* Use film.director */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 truncate" title={`Directed by ${film.director}`}>
            Dir. {film.director}
        </p>
        {/* Changed styling: Action buttons area */}
        <div className="flex justify-end items-center space-x-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          {/* Changed styling: View button */}
          <button
            onClick={onView}
            title="View Details"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
          >
            <EyeOutlined /> Details
          </button>
          {/* Changed styling: Edit button */}
          <button
            onClick={onEdit}
            title="Edit Film"
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
          >
            <EditOutlined /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmList;