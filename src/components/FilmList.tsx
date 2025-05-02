// FilmList.tsx
import { FilmType } from "../pages/Films";
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

interface FilmListProps {
  films: FilmType[];
  onEdit: (film: FilmType) => void;
  onView: (film: FilmType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const FilmList = ({ films, onEdit, onView, onPageChange, currentPage }: FilmListProps) => {
  return (
    <div>
      {films.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No films found. Add a new film to your collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:text-gray-300 dark:disabled:text-gray-600"
          >
            <LeftOutlined />
          </button>
          <span className="px-3 py-1.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm">
            {currentPage}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

interface FilmCardProps {
  film: FilmType;
  onEdit: () => void;
  onView: () => void;
}

const FilmCard = ({ film, onEdit, onView }: FilmCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform duration-200 hover:shadow-md">
      <div className="relative h-48">
        {film.image_url ? (
          <img
            src={film.image_url}
            alt={film.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded text-xs font-medium text-blue-700 dark:text-blue-300">
          {film.genre?.name || "Uncategorized"}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 dark:text-white mb-1 truncate">{film.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Directed by {film.director}</p>
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={onView}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            <EyeOutlined /> View
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
          >
            <EditOutlined /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmList;