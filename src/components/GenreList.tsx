<<<<<<< HEAD
// GenreList.tsx
import { GenreType } from "../pages/Genre";
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

interface GenreListProps {
  genres: GenreType[];
  onEdit: (genre: GenreType) => void;
  onView: (genre: GenreType) => void;
=======
// GenreList.tsx - Component to display list of genre
import { GenreType } from "../pages/Genre"; // Updated import path and type
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined, DatabaseOutlined } from "@ant-design/icons"; // Added icon

interface GenreListProps {
  genre: GenreType[]; // Renamed prop and type
  onEdit: (genre: GenreType) => void; // Updated type
  onView: (genre: GenreType) => void; // Updated type
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53
  onPageChange: (page: number) => void;
  currentPage: number;
}

<<<<<<< HEAD
const GenreList = ({ 
  genres, 
  onEdit, 
  onView, 
  onPageChange, 
  currentPage 
=======
const GenreList = ({
  genre, // Renamed prop
  onEdit,
  onView,
  onPageChange,
  currentPage
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53
}: GenreListProps) => {
  return (
<<<<<<< HEAD
    <div>
      {genres.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No genres found. Add a new genre to get started!</p>
=======
    <div className="mt-5">
      {genre.length === 0 ? (
        // Changed styling: background, padding, border, text
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-dashed border-gray-300 dark:border-gray-600">
          <DatabaseOutlined className="text-4xl text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No genre found.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add a new genre to see it listed here.</p>
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Created
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
<<<<<<< HEAD
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {genres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{genre.name}</div>
=======
              {/* Changed styling: body divider */}
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {/* Use renamed variable 'genre' */}
                {genre.map((genre) => (
                  // Changed styling: row hover effect
                  <tr key={genre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    {/* Use genre.category instead of genre.name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{genre.category}</div>
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{genre.description}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(genre.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onView(genre)}
                        className="text-blue-500 hover:text-blue-700 mr-2 inline-flex items-center gap-1"
                      >
                        <EyeOutlined />
                      </button>
                      <button
                        onClick={() => onEdit(genre)}
                        className="text-green-500 hover:text-green-700 inline-flex"
                      >
                        <EditOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
<<<<<<< HEAD
      
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
=======

      {/* Pagination - Changed Styling */}
      {genre.length > 0 && ( // Only show pagination if there are items
        <div className="flex justify-center items-center mt-6 py-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous Page"
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <LeftOutlined className="text-sm" />
            </button>
            <span className="px-4 py-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
              Page {currentPage}
            </span>
            <button
              // Basic check if next page might exist (can be improved with total count)
              onClick={() => onPageChange(currentPage + 1)}
              // Add a disabled check if you know the total pages
              // disabled={currentPage >= totalPages} 
              aria-label="Next Page"
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <RightOutlined className="text-sm" />
            </button>
          </div>
>>>>>>> 6e1b5c049d4436ca7f33042c37e2a4953aab3c53
        </div>
      </div>
    </div>
  );
};

export default GenreList;