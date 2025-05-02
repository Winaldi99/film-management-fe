import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  CloseOutlined,
  SaveOutlined,
  VideoCameraOutlined, // Changed from BookOutlined
  TagOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

// Types
type CommentType = {
  id: number;
  comment: string; // Changed from ulasan
  film_id: number; // Changed from book_id
  created_at: string;
  updated_at: string;
  film: { // Changed from book
    id: number;
    title: string;
    cover_image?: string;
    genre: { // Changed from category
      id: number;
      name: string;
    };
  };
};

type FilmType = { // Changed from BookType
  id: number;
  title: string;
};

type CreateCommentDTO = { // Changed from CreateReviewDTO
  filmId: number; // Changed from bookId
  comment: string; // Changed from ulasan
};

// API Functions
const fetchComments = async (token: string | null) => { // Renamed
  return await axios.get<CommentType[]>("/api/comment", { // Changed endpoint and type
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchFilmComments = async (filmId: number, token: string | null) => { // Renamed and changed param
  return await axios.get<CommentType[]>(`/api/comment/film/${filmId}`, { // Changed endpoint, param, and type
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchFilms = async (token: string | null) => { // Renamed
  return await axios.get<FilmType[]>("/api/films", { // Changed endpoint and type
    headers: { Authorization: `Bearer ${token}` }
  });
};

const createComment = async (commentData: CreateCommentDTO, token: string | null) => { // Renamed and changed param type
  return await axios.post("/api/comment", commentData, { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

const updateComment = async (
  id: number,
  commentData: CreateCommentDTO, // Changed param type
  token: string | null
) => { // Renamed
  return await axios.put(`/api/comment/${id}`, commentData, { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

const deleteComment = async (id: number, token: string | null) => { // Renamed
  return await axios.delete(`/api/comment/${id}`, { // Changed endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Components
const CommentCard = ({ // Renamed
  comment, // Renamed prop
  onEdit,
  onDelete
}: {
  comment: CommentType; // Changed prop type
  onEdit: (comment: CommentType) => void; // Changed param type
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 max-w-xl mx-auto">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
            {comment.film.title} {/* Changed access */}
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <TagOutlined className="text-gray-400" />
            {/* Changed access and fallback text */}
            <span>{comment.film.genre?.name || "Uncategorized"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <ClockCircleOutlined className="text-gray-400" />
            <span>{new Date(comment.updated_at).toLocaleDateString()}</span> {/* Changed access */}
          </div>
        </div>
        {comment.film.cover_image && ( // Changed access
          <img
            src={comment.film.cover_image} // Changed access
            alt={comment.film.title} // Changed access
            className="w-16 h-20 object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150x200?text=No+Poster"; // Optional: Changed placeholder text
            }}
          />
        )}
      </div>
      {/* Changed access and border class */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 border-t border-gray-100 dark:border-gray-700 pt-3">
        {comment.comment}
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(comment)} // Pass comment
          className="flex items-center gap-1 px-2 py-1 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <EditOutlined /> Edit
        </button>
        <button
          onClick={() => onDelete(comment.id)} // Pass comment id
          className="flex items-center gap-1 px-2 py-1 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <DeleteOutlined /> Delete
        </button>
      </div>
    </div>
  );
};

const CommentForm = ({ // Renamed
  comment, // Renamed prop
  onSubmit,
  onCancel
}: {
  comment: Partial<CommentType> | null; // Changed prop type
  onSubmit: (data: CreateCommentDTO) => void; // Changed param type
  onCancel: () => void;
}) => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<CreateCommentDTO>({ // Changed state type
    filmId: comment?.film_id || 0, // Changed state key and access
    comment: comment?.comment || "" // Changed state key and access
  });

  // Renamed query and data variable
  const { data: filmsData } = useQuery({
    queryKey: ["filmsList"], // Changed query key
    queryFn: () => fetchFilms(getToken()) // Changed fetch function
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Changed logic for filmId parsing
      [name]: name === "filmId" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {/* Changed text */}
          {comment ? "Edit Comment" : "Add New Comment"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <CloseOutlined />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            htmlFor="filmId" // Changed htmlFor
          >
            <VideoCameraOutlined className="mr-1" /> Film {/* Changed icon and text */}
          </label>
          <select
            id="filmId" // Changed id
            name="filmId" // Changed name
            value={formData.filmId || ""} // Changed state access
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select a film</option> {/* Changed text */}
            {/* Changed data source and mapping */}
            {filmsData?.data.map((film) => (
              <option key={film.id} value={film.id}>
                {film.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            htmlFor="comment" // Changed htmlFor
          >
            Comment {/* Changed text */}
          </label>
          <textarea
            id="comment" // Changed id
            name="comment" // Changed name
            value={formData.comment} // Changed state access
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
            placeholder="Write your comment here..." // Changed placeholder
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
          >
            {/* Changed text based on prop */}
            <SaveOutlined /> {comment ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FilterPanel = ({
  selectedFilmId, // Renamed prop
  setSelectedFilmId // Renamed prop
}: {
  selectedFilmId: number | null; // Changed prop type
  setSelectedFilmId: (id: number | null) => void; // Changed param type
}) => {
  const { getToken } = useAuth();
  // Renamed query and data variable
  const { data: filmsData } = useQuery({
    queryKey: ["filmsList"], // Changed query key
    queryFn: () => fetchFilms(getToken()) // Changed fetch function
  });

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 max-w-xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="flex text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 items-center gap-1">
            <FilterOutlined /> Filter by Film {/* Changed text */}
          </label>
          <select
            value={selectedFilmId || ""} // Changed value access
            onChange={(e) =>
              setSelectedFilmId( // Changed setter function
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Comments</option> {/* Changed text */}
            {/* Changed data source and mapping */}
            {filmsData?.data.map((film) => (
              <option key={film.id} value={film.id}>
                {film.title}
              </option>
            ))}
          </select>
        </div>
        {selectedFilmId && ( // Changed condition variable
          <button
            onClick={() => setSelectedFilmId(null)} // Changed setter function
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 self-end mb-0.5"
          >
            <CloseOutlined /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        {/* Changed icon */}
        <VideoCameraOutlined className="text-blue-500 dark:text-blue-400 text-2xl" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
        No comments found {/* Changed text */}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
        You haven't added any comments yet. {/* Changed text */}
      </p>
      <button
        onClick={onAdd}
        className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1 mx-auto"
      >
        <PlusOutlined /> Add Your First Comment {/* Changed text */}
      </button>
    </div>
  );
};

// Main Component
const Comment = () => { // Renamed component
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null); // Renamed state
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentType | null>(null); // Renamed state and type

  // Queries
  // Renamed query, data variable, key, function, and loading state
  const { data: allCommentsData, isLoading: isLoadingAllComments } = useQuery({
    queryKey: ["commentsList"],
    queryFn: () => fetchComments(getToken()),
    enabled: !selectedFilmId // Changed condition variable
  });

  // Renamed query, data variable, key, function, param, type, and loading state
  const { data: filmCommentsData, isLoading: isLoadingFilmComments } = useQuery({
    queryKey: ["filmComments", selectedFilmId],
    queryFn: () => fetchFilmComments(selectedFilmId as number, getToken()),
    enabled: !!selectedFilmId // Changed condition variable
  });

  // Mutations
  // Renamed mutation, param type, and function
  const createMutation = useMutation({
    mutationFn: (newComment: CreateCommentDTO) =>
      createComment(newComment, getToken()),
    onSuccess: () => {
      // Changed query key
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      if (selectedFilmId) { // Changed condition variable
        // Changed query key and variable
        queryClient.invalidateQueries({
          queryKey: ["filmComments", selectedFilmId]
        });
      }
      setShowForm(false);
    }
  });

  // Renamed mutation, param names/types, and function
  const updateMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: CreateCommentDTO }) =>
      updateComment(id, comment, getToken()),
    onSuccess: () => {
      // Changed query key
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      if (selectedFilmId) { // Changed condition variable
        // Changed query key and variable
        queryClient.invalidateQueries({
          queryKey: ["filmComments", selectedFilmId]
        });
      }
      setShowForm(false);
      setEditingComment(null); // Changed state setter
    }
  });

  // Renamed mutation and function
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteComment(id, getToken()),
    onSuccess: () => {
      // Changed query key
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      if (selectedFilmId) { // Changed condition variable
        // Changed query key and variable
        queryClient.invalidateQueries({
          queryKey: ["filmComments", selectedFilmId]
        });
      }
    }
  });

  // Event Handlers
  const handleAddClick = () => {
    setEditingComment(null); // Changed state setter
    setShowForm(true);
  };

  const handleEditClick = (comment: CommentType) => { // Changed param name and type
    setEditingComment(comment); // Changed state setter
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    // Changed confirmation message
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: CreateCommentDTO) => { // Changed param type
    if (editingComment) { // Changed state variable
      // Pass correct state variable and data
      updateMutation.mutate({ id: editingComment.id, comment: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingComment(null); // Changed state setter
  };

  // Determine which comments to show
  // Renamed variables and data sources
  const comments = selectedFilmId ? filmCommentsData?.data : allCommentsData?.data;
  const isLoading = selectedFilmId ? isLoadingFilmComments : isLoadingAllComments;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-4 max-w-xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          My Film Comments {/* Changed text */}
        </h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1"
          >
            <PlusOutlined /> Add Comment {/* Changed text */}
          </button>
        )}
      </div>

      {showForm ? (
        <CommentForm // Renamed component
          // Pass correct state variable and prop name
          comment={editingComment || null}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <FilterPanel // Renamed component
            // Pass correct state variable and prop names
            selectedFilmId={selectedFilmId}
            setSelectedFilmId={setSelectedFilmId}
          />

          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="animate-spin inline-block size-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
              <p>Loading comments...</p> {/* Changed text */}
            </div>
          ) : comments && comments.length > 0 ? ( // Changed variable name
            <div>
              {/* Changed variable name and map param */}
              {comments.map((comment) => (
                <CommentCard // Renamed component
                  key={comment.id}
                  comment={comment} // Pass correct prop name
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState onAdd={handleAddClick} /> // Renamed component
          )}
        </>
      )}
    </div>
  );
};

export default Comment; // Renamed default export