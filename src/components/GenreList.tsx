// GenreList.tsx
import { GenreType } from "../pages/Genre";
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined, BookOutlined } from "@ant-design/icons";

interface GenreListProps {
  genres: GenreType[];
  onEdit: (genre: GenreType) => void;
  onView: (genre: GenreType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const GenreList = ({ 
  genres, 
  onEdit, 
  onView, 
  onPageChange, 
  currentPage 
}: GenreListProps) => {
  return (
    <div>
      {genres.length === 0 ? (
        // New empty state design
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <BookOutlined className="text-4xl text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Your genre collection is empty. Add your first genre to start organizing your content.
          </p>
        </div>
      ) : (
        // New card-based layout instead of table
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => (
            <div 
              key={genre.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="border-l-4 border-indigo-500 dark:border-indigo-600 pl-3 py-3 bg-indigo-50 dark:bg-indigo-900/30">
                <h3 className="font-medium text-gray-900 dark:text-white truncate px-3">{genre.name}</h3>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 h-14">
                  {genre.description}
                </p>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(genre.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(genre)}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50"
                      title="View details"
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      onClick={() => onEdit(genre)}
                      className="p-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-800/50"
                      title="Edit genre"
                    >
                      <EditOutlined />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* New pagination style */}
      {genres.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full shadow-sm px-2 py-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-full disabled:opacity-50 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              title="Previous page"
            >
              <LeftOutlined />
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage}
            </span>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Next page"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreList;