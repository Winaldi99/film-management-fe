// GenreList.tsx - Component to display list of genre
import { GenreType } from "../pages/Genre"; // Updated import path and type
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined, DatabaseOutlined } from "@ant-design/icons"; // Added icon

interface GenreListProps {
  genre: GenreType[]; // Renamed prop and type
  onEdit: (genre: GenreType) => void; // Updated type
  onView: (genre: GenreType) => void; // Updated type
  onPageChange: (page: number) => void;
  currentPage: number;
}

const GenreList = ({
  genre, // Renamed prop
  onEdit,
  onView,
  onPageChange,
  currentPage
}: GenreListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { // Example: Indonesian locale
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="mt-5">
      {genre.length === 0 ? (
        // Changed styling: background, padding, border, text
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-dashed border-gray-300 dark:border-gray-600">
          <DatabaseOutlined className="text-4xl text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No genre found.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add a new genre to see it listed here.</p>
        </div>
      ) : (
        // Changed styling: wrapper background, shadow, border
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            {/* Changed styling: table layout */}
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 table-fixed">
              {/* Changed styling: header background, text */}
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="w-1/4 px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Genre {/* Changed text */}
                  </th>
                  <th scope="col" className="w-2/4 px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="w-1/6 px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="w-auto px-5 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Changed styling: body divider */}
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {/* Use renamed variable 'genre' */}
                {genre.map((genre) => (
                  // Changed styling: row hover effect
                  <tr key={genre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    {/* Use genre.category instead of genre.name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{genre.category}</div>
                    </td>
                    <td className="px-5 py-4">
                      {/* Changed styling: description truncation */}
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2" title={genre.description}>
                          {genre.description}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(genre.created_at)}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Changed styling: button colors, spacing */}
                      <button
                        onClick={() => onView(genre)}
                        title="View Details"
                        className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 mr-3 inline-flex items-center"
                      >
                        <EyeOutlined />
                      </button>
                      <button
                        onClick={() => onEdit(genre)}
                        title="Edit Genre"
                        className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 inline-flex"
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
        </div>
      )}
    </div>
  );
};

export default GenreList;