// Comment.tsx - Component for managing film comments
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react"; // Added useEffect
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import {
  PlusCircleOutlined, // Changed icon
  EditFilled,       // Changed icon
  DeleteFilled,     // Changed icon
  FilterFilled,     // Changed icon
  CloseCircleFilled,// Changed icon
  SaveFilled,       // Changed icon
  VideoCameraOutlined, // Changed icon
  TagOutlined,
  ClockCircleOutlined,
  MessageOutlined,   // New icon
  LoadingOutlined,   // New icon
  ExclamationCircleFilled // New icon
} from "@ant-design/icons";

// --- Types ---
// Renamed Type: ReviewType -> CommentType
// Updated fields: ulasan -> comment, book_id -> film_id, book -> film
type CommentType = {
  id: number;
  comment: string; // Changed from 'ulasan'
  film_id: number; // Changed from 'book_id'
  created_at: string;
  updated_at: string;
  film: {         // Changed from 'book'
    id: number;
    title: string;
    image_url?: string; // Renamed from 'cover_image' for consistency with Film page
    genre: {           // Changed from 'category'
      id: number;
      name: string;
    };
  };
};

// Renamed Type: BookType -> FilmType (simplified for dropdown/filter needs)
type FilmType = {
  id: number;
  title: string;
};

// Renamed DTO: CreateReviewDTO -> CreateCommentDTO
// Updated fields: bookId -> filmId, ulasan -> comment
type CreateCommentDTO = {
  filmId: number;  // Changed from 'bookId'
  comment: string; // Changed from 'ulasan'
};

// --- API Functions ---
// Renamed function and updated endpoint
const fetchComments = async (token: string | null) => {
  return await axios.get<CommentType[]>("/api/comment", { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Renamed function and updated endpoint
const fetchFilmComments = async (filmId: number, token: string | null) => {
  return await axios.get<CommentType[]>(`/api/comment/film/${filmId}`, { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Renamed function and updated endpoint
const fetchFilms = async (token: string | null) => {
  // Assuming endpoint for films list is /api/films
  return await axios.get<FilmType[]>("/api/films", { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Renamed function, updated DTO type, and endpoint
const createComment = async (comment: CreateCommentDTO, token: string | null) => {
    // Ensure payload keys match backend expectations (e.g., film_id, comment)
    const payload = { film_id: comment.filmId, comment: comment.comment };
    return await axios.post("/api/comment", payload, { // Changed endpoint
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Renamed function, updated DTO type, and endpoint
const updateComment = async (id: number, comment: CreateCommentDTO, token: string | null) => {
    // Ensure payload keys match backend expectations (e.g., film_id, comment)
    const payload = { film_id: comment.filmId, comment: comment.comment };
    return await axios.put(`/api/comment/${id}`, payload, { // Changed endpoint
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Renamed function and updated endpoint
const deleteComment = async (id: number, token: string | null) => {
  return await axios.delete(`/api/comment/${id}`, { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- Components ---

// Renamed Component: ReviewCard -> CommentCard
// Updated props and internal data access
const CommentCard = ({
  comment, // Renamed prop
  onEdit,
  onDelete
}: {
  comment: CommentType; // Updated type
  onEdit: (comment: CommentType) => void; // Updated type
  onDelete: (id: number) => void;
}) => {

  const formatDate = (dateString: string) => {
     try {
       return new Date(dateString).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
     } catch { return "Invalid Date"; }
  }

  return (
    // Changed Styling: Card appearance, layout, shadow, border
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-850 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-5 mb-5 transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        {/* Film Info Section */}
        <div className="flex-grow">
           {/* Use comment.film.title */}
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-1">{comment.film.title}</h2>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
            {/* Use comment.film.genre */}
            <span className="inline-flex items-center gap-1">
              <TagOutlined className="text-gray-400" />
              {comment.film.genre?.name || "N/A"}
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockCircleOutlined className="text-gray-400" />
              {formatDate(comment.updated_at)}
            </span>
          </div>
        </div>
        {/* Film Image */}
        {comment.film.image_url && ( // Use comment.film.image_url
          <img
            src={comment.film.image_url}
            alt={comment.film.title}
            // Changed Styling: Image size, shape
            className="w-20 h-28 object-cover rounded-md shadow-md flex-shrink-0 order-first sm:order-last"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x220/cccccc/969696?text=No+Poster';
            }}
            loading="lazy"
          />
        )}
      </div>
      {/* Use comment.comment */}
      {/* Changed Styling: Comment text area */}
      <p className="text-gray-700 dark:text-gray-300 text-base mb-4 border-t border-gray-100 dark:border-slate-700 pt-4 whitespace-pre-wrap">
        {comment.comment}
      </p>
      {/* Changed Styling: Action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => onEdit(comment)} // Pass comment object
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
          title="Edit Comment"
        >
          <EditFilled /> Edit
        </button>
        <button
          onClick={() => onDelete(comment.id)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
          title="Delete Comment"
        >
          <DeleteFilled /> Delete
        </button>
      </div>
    </div>
  );
};

// Renamed Component: ReviewForm -> CommentForm
// Updated props, state, and internal logic
const CommentForm = ({
  comment, // Renamed prop
  onSubmit,
  onCancel,
  isSubmitting // Added isSubmitting prop
}: {
  comment: Partial<CommentType> | null; // Updated type
  onSubmit: (data: CreateCommentDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean; // Added prop
}) => {
  const { getToken } = useAuth();
  // Renamed state and updated type/fields
  const [formData, setFormData] = useState<CreateCommentDTO>({
    filmId: 0, // Initialize with 0 or a valid default
    comment: ""
  });
  const [formError, setFormError] = useState<string | null>(null); // Local form error

  // Fetch films for the dropdown
  const { data: filmsData, isLoading: isLoadingFilms } = useQuery({
    queryKey: ["filmsListSimple"], // Use a different key if fetching simplified data
    queryFn: () => fetchFilms(getToken())
  });

  // Effect to initialize/reset form data when comment or filmsData changes
   useEffect(() => {
    setFormData({
      filmId: comment?.film_id || (filmsData?.data && filmsData.data.length > 0 ? filmsData.data[0].id : 0),
      comment: comment?.comment || ""
    });
    setFormError(null); // Clear error on re-render/prop change
  }, [comment, filmsData]); // Depend on filmsData as well

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "filmId" ? parseInt(value) : value // Use filmId
    }));
     setFormError(null); // Clear error on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.filmId || formData.filmId === 0) {
        setFormError("Please select a film.");
        return;
    }
    if (!formData.comment.trim()) {
        setFormError("Comment cannot be empty.");
        return;
    }
    setFormError(null);
    onSubmit(formData);
  };

  return (
    // Changed Styling: Form container, background, shadow
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-5 mb-5 animate-fade-in-slow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {comment ? "Edit Comment" : "Add New Comment"} {/* Changed Text */}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Cancel"
          disabled={isSubmitting}
        >
          <CloseCircleFilled />
        </button>
      </div>
      {formError && (
          <div className="mb-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm">
              {formError}
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Film Select */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1" htmlFor="filmId">
            <VideoCameraOutlined /> Film <span className="text-red-500">*</span>
          </label>
          <select
            id="filmId"
            name="filmId" // Use filmId
            value={formData.filmId || ""}
            onChange={handleChange}
            // Changed Styling: Select field
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white disabled:opacity-50"
            required
            disabled={isLoadingFilms || isSubmitting} // Disable while loading films or submitting
          >
            <option value="">{isLoadingFilms ? "Loading films..." : "-- Select a Film --"}</option>
            {/* Use filmsData */}
            {filmsData?.data.map(film => (
              <option key={film.id} value={film.id}>
                {film.title}
              </option>
            ))}
          </select>
        </div>
        {/* Comment Textarea */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1" htmlFor="comment">
            Comment <span className="text-red-500">*</span>
          </label>
          {/* Use comment field name */}
          <textarea
            id="comment"
            name="comment" // Use comment
            value={formData.comment}
            onChange={handleChange}
            rows={5}
            // Changed Styling: Textarea field
            className="w-full px-3 py-2 text-base border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white resize-y disabled:opacity-50"
            required
            placeholder="Share your thoughts about the film..."
            disabled={isSubmitting}
          />
        </div>
        {/* Changed Styling: Form Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 font-medium transition-colors shadow-sm disabled:opacity-60 disabled:cursor-wait"
            disabled={isSubmitting} // Disable during submission
          >
            <SaveFilled /> {isSubmitting ? "Saving..." : comment ? "Update Comment" : "Submit Comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Renamed Props, updated internal logic
const FilterPanel = ({
  selectedFilmId, // Renamed prop
  setSelectedFilmId // Renamed prop
}: {
  selectedFilmId: number | null; // Updated type
  setSelectedFilmId: (id: number | null) => void; // Updated type
}) => {
  const { getToken } = useAuth();
  // Use films list query
  const { data: filmsData, isLoading: isLoadingFilms } = useQuery({
    queryKey: ["filmsListSimple"], // Use consistent key
    queryFn: () => fetchFilms(getToken())
  });

  return (
    // Changed Styling: Filter panel appearance
    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-grow w-full sm:w-auto">
          <label className="flex text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 items-center gap-1">
            <FilterFilled /> Filter by Film
          </label>
          <select
            value={selectedFilmId || ""} // Use selectedFilmId
            onChange={(e) => setSelectedFilmId(e.target.value ? parseInt(e.target.value) : null)}
            // Changed Styling: Filter select
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8 disabled:opacity-50"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
            disabled={isLoadingFilms}
          >
            <option value="">All Comments</option> {/* Changed Text */}
            {/* Use filmsData */}
            {filmsData?.data.map(film => (
              <option key={film.id} value={film.id}>
                {film.title}
              </option>
            ))}
          </select>
        </div>
        {/* Changed Styling: Clear button */}
        {selectedFilmId && (
          <button
            onClick={() => setSelectedFilmId(null)}
            className="px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-1 self-end sm:self-center whitespace-nowrap"
            title="Clear Filter"
          >
            <CloseCircleFilled /> Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

// Renamed texts and icon
const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    // Changed Styling: Empty state appearance
    <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 text-center shadow-inner">
      <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700/50">
        <MessageOutlined className="text-gray-400 dark:text-slate-500 text-4xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No comments yet</h3> {/* Changed Text */}
      <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm">Be the first one to share your thoughts!</p> {/* Changed Text */}
      <button
        onClick={onAdd}
        // Changed Styling: Add button in empty state
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-1.5 mx-auto transition-colors shadow-md"
      >
        <PlusCircleOutlined /> Add Your First Comment {/* Changed Text */}
      </button>
    </div>
  );
};

// --- Main Component ---
// Renamed Component: Review -> Comment
const Comment = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  // Renamed state
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  // Renamed state
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);
  const [deleteError, setDeleteError] = useState<string|null>(null); // Error state for delete

  // --- Queries ---
  // Renamed query key and function call
  const { data: allCommentsData, isLoading: isLoadingAllComments } = useQuery({
    queryKey: ["commentsList"],
    queryFn: () => fetchComments(getToken()),
    enabled: !selectedFilmId // Only fetch all if no film is selected
  });

  // Renamed query key and function call
  const { data: filmCommentsData, isLoading: isLoadingFilmComments } = useQuery({
    queryKey: ["filmComments", selectedFilmId], // Use filmId in key
    queryFn: () => fetchFilmComments(selectedFilmId as number, getToken()),
    enabled: !!selectedFilmId // Fetch only when filmId is selected
  });

  // --- Mutations ---
  // Renamed mutation and function call
  const createMutation = useMutation({
    mutationFn: (newComment: CreateCommentDTO) => createComment(newComment, getToken()),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      // Invalidate specific film's comments *if* the new comment matches the filter
      if (variables.filmId === selectedFilmId) {
          queryClient.invalidateQueries({ queryKey: ["filmComments", selectedFilmId] });
      } else if (selectedFilmId === null) {
          // If viewing 'All' and adding, the main list is already invalidated
      }
      setShowForm(false);
    },
    onError: (error: any) => {
        console.error("Error creating comment:", error);
        // Potentially show error to user in the form component
    }
  });

  // Renamed mutation and function call
  const updateMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: CreateCommentDTO }) =>
      updateComment(id, comment, getToken()),
    onSuccess: (_data, variables) => {
      // Invalidate both all comments and specific film comments for simplicity,
      // or be more specific based on `variables.comment.filmId` and `selectedFilmId`
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      queryClient.invalidateQueries({ queryKey: ["filmComments", variables.comment.filmId] });
      if (selectedFilmId && selectedFilmId !== variables.comment.filmId) {
        queryClient.invalidateQueries({ queryKey: ["filmComments", selectedFilmId] });
      }
      setShowForm(false);
      setEditingComment(null);
    },
     onError: (error: any) => {
        console.error("Error updating comment:", error);
         // Potentially show error to user in the form component
    }
  });

  // Renamed mutation and function call
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteComment(id, getToken()),
    onSuccess: (_data, id) => {
      setDeleteError(null); // Clear previous delete error
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      // Remove the deleted comment from the specific film cache if it exists
      queryClient.setQueryData<CommentType[]>(['filmComments', selectedFilmId], (oldData) =>
          oldData ? oldData.filter((comment) => comment.id !== id) : []
      );
       // Also invalidate if viewing a specific film
       if(selectedFilmId) {
           queryClient.invalidateQueries({ queryKey: ["filmComments", selectedFilmId] });
       }
    },
    onError: (error: any) => {
      console.error("Error deleting comment:", error);
      setDeleteError(error.response?.data?.message || "Could not delete the comment.");
    }
  });

  // --- Event Handlers ---
  const handleAddClick = () => {
    setEditingComment(null); // Clear editing state
    setShowForm(true);
    setDeleteError(null); // Clear delete error when opening form
  };

  // Updated parameter type
  const handleEditClick = (comment: CommentType) => {
    setEditingComment(comment); // Set comment to edit
    setShowForm(true);
    setDeleteError(null); // Clear delete error when opening form
  };

  const handleDeleteClick = (id: number) => {
    setDeleteError(null); // Clear previous error
    // Changed Confirmation Message
    if (window.confirm("Are you sure you want to permanently delete this comment?")) {
      deleteMutation.mutate(id);
    }
  };

  // Updated parameter type
  const handleFormSubmit = (data: CreateCommentDTO) => {
    if (editingComment) {
      updateMutation.mutate({ id: editingComment.id, comment: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingComment(null); // Clear editing state on cancel
  };

  // --- Data Preparation ---
  // Determine which comments to show based on filter
  const comments = selectedFilmId ? filmCommentsData?.data : allCommentsData?.data;
  const isLoading = selectedFilmId ? isLoadingFilmComments : isLoadingAllComments;
  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending; // Combined mutation loading state

  return (
    // Changed Styling: Main container, background, padding
    <div className="bg-gradient-to-b from-gray-50 to-indigo-50 dark:from-slate-900 dark:to-gray-900 min-h-screen px-4 py-6 md:px-6 md:py-8">
       <div className="max-w-3xl mx-auto"> {/* Centered content with max-width */}
        {/* Changed Styling: Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-slate-700 gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Film Comments {/* Changed Text */}
          </h1>
          {!showForm && (
            <button
              onClick={handleAddClick}
              // Changed Styling: Add button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-md hover:shadow-lg"
              disabled={isMutating} // Disable if any mutation is happening
            >
              <PlusCircleOutlined /> Add Comment {/* Changed Text */}
            </button>
          )}
        </div>

         {/* Global Loading/Error Indicators */}
          {deleteMutation.isError && (
             <div className="mb-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2" role="alert">
               <ExclamationCircleFilled /> {deleteError || 'An error occurred during deletion.'}
             </div>
          )}
          {(createMutation.isError || updateMutation.isError) && !showForm && ( // Show mutation error if form is closed
             <div className="mb-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2" role="alert">
               <ExclamationCircleFilled /> {createMutation.error?.message || updateMutation.error?.message || 'Failed to save the comment.'}
             </div>
          )}


        {/* Conditional Rendering: Form or List+Filter */}
        {showForm ? (
          <CommentForm
            comment={editingComment} // Pass renamed prop
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={createMutation.isPending || updateMutation.isPending} // Pass combined submitting state
          />
        ) : (
          <>
            <FilterPanel
              selectedFilmId={selectedFilmId} // Pass renamed prop
              setSelectedFilmId={setSelectedFilmId} // Pass renamed prop
            />

            {isLoading ? (
              // Changed Styling: Loading indicator
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <LoadingOutlined className="text-3xl animate-spin mb-3 text-indigo-500"/>
                <p>Loading comments...</p> {/* Changed Text */}
              </div>
            ) : comments && comments.length > 0 ? (
              // Changed Styling: Comments list container
              <div className="space-y-5">
                 {/* Map over renamed 'comments' */}
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment} // Pass comment object
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onAdd={handleAddClick} />
            )}
          </>
        )}
      </div>
      {/* Add animation style */}
       <style>{`
        @keyframes fadeInSlow { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-slow { animation: fadeInSlow 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Comment; // Export renamed component