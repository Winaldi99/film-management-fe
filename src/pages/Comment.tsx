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
  VideoCameraOutlined,
  TagOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

// Types
type CommentType = {
  id: number;
  comment: string;
  film_id: number;
  created_at: string;
  updated_at: string;
  film: {
    id: number;
    title: string;
    cover_image?: string;
    genre: {
      id: number;
      name: string;
    };
  };
};

type FilmType = {
  id: number;
  title: string;
};

type CreateCommentDTO = {
  filmId: number;
  comment: string;
};

// API Functions
const fetchComments = async (token: string | null) => {
  return await axios.get<CommentType[]>("/api/comment", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchFilmComments = async (filmId: number, token: string | null) => {
  return await axios.get<CommentType[]>(`/api/comment/film/${filmId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchFilms = async (token: string | null) => {
  return await axios.get<FilmType[]>("/api/films", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const createComment = async (commentData: CreateCommentDTO, token: string | null) => {
  return await axios.post("/api/comment", commentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const updateComment = async (
  id: number,
  commentData: CreateCommentDTO,
  token: string | null
) => {
  return await axios.put(`/api/comment/${id}`, commentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const deleteComment = async (id: number, token: string | null) => {
  return await axios.delete(`/api/comment/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Components
const CommentCard = ({
  comment,
  onEdit,
  onDelete
}: {
  comment: CommentType;
  onEdit: (comment: CommentType) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
      <div className="flex items-center mb-3">
        <div className="flex-grow">
          <h2 className="text-lg font-bold text-gray-800">{comment.film.title}</h2>
          <div className="flex items-center text-xs text-gray-600 mb-1">
            <TagOutlined className="mr-1" />
            <span>{comment.film.genre?.name || "Uncategorized"}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockCircleOutlined className="mr-1" />
            <span>{new Date(comment.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
        {comment.film.cover_image && (
          <img
            src={comment.film.cover_image}
            alt={comment.film.title}
            className="w-16 h-20 object-cover rounded-sm ml-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150x200?text=No+Poster";
            }}
          />
        )}
      </div>
      <p className="text-gray-700 mb-2">{comment.comment}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(comment)}
          className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
        >
          <EditOutlined className="mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(comment.id)}
          className="text-red-500 hover:text-red-700 flex items-center text-sm"
        >
          <DeleteOutlined className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

const CommentForm = ({
  comment,
  onSubmit,
  onCancel
}: {
  comment: Partial<CommentType> | null;
  onSubmit: (data: CreateCommentDTO) => void;
  onCancel: () => void;
}) => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<CreateCommentDTO>({
    filmId: comment?.film_id || 0,
    comment: comment?.comment || ""
  });

  const { data: filmsData } = useQuery({
    queryKey: ["filmsList"],
    queryFn: () => fetchFilms(getToken())
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "filmId" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-lg font-bold mb-3">{comment ? "Edit Comment" : "Add New Comment"}</h2>
      <button onClick={onCancel} className="text-gray-500 mb-2">
        <CloseOutlined />
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="filmId">
            <VideoCameraOutlined className="mr-1" /> Film
          </label>
          <select
            id="filmId"
            name="filmId"
            value={formData.filmId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a film</option>
            {filmsData?.data.map((film) => (
              <option key={film.id} value={film.id}>
                {film.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
            placeholder="Write your comment here..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="border border-gray-300 rounded px-3 py-1.5">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white rounded px-3 py-1.5 flex items-center">
            <SaveOutlined className="mr-1" /> {comment ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FilterPanel = ({
  selectedFilmId,
  setSelectedFilmId
}: {
  selectedFilmId: number | null;
  setSelectedFilmId: (id: number | null) => void;
}) => {
  const { getToken } = useAuth();
  const { data: filmsData } = useQuery({
    queryKey: ["filmsList"],
    queryFn: () => fetchFilms(getToken())
  });

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-lg">
      <h2 className="text-sm font-medium text-gray-600 mb-2">
        <FilterOutlined className="mr-1" /> Filter by Film
      </h2>
      <select
        value={selectedFilmId || ""}
        onChange={(e) =>
          setSelectedFilmId(e.target.value ? parseInt(e.target.value) : null)
        }
        className="w-full px-3 py-2 border border-gray-300 rounded"
      >
        <option value="">All Comments</option>
        {filmsData?.data.map((film) => (
          <option key={film.id} value={film.id}>
            {film.title}
          </option>
        ))}
      </select>
      {selectedFilmId && (
        <button
          onClick={() => setSelectedFilmId(null)}
          className="mt-2 text-gray-600 border border-gray-300 rounded px-2 py-1"
        >
          <CloseOutlined /> Clear
        </button>
      )}
    </div>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 text-center shadow-lg">
      <VideoCameraOutlined className="text-blue-500 text-4xl mb-3" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">No comments found</h3>
      <p className="text-gray-500 mb-4">You haven't added any comments yet.</p>
      <button
        onClick={onAdd}
        className="bg-blue-500 text-white rounded px-3 py-1.5 flex items-center mx-auto"
      >
        <PlusOutlined className="mr-1" /> Add Your First Comment
      </button>
    </div>
  );
};

// Main Component
const Comment = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);

  const { data: allCommentsData, isLoading: isLoadingAllComments } = useQuery({
    queryKey: ["commentsList"],
    queryFn: () => fetchComments(getToken()),
    enabled: !selectedFilmId
  });

  const { data: filmCommentsData, isLoading: isLoadingFilmComments } = useQuery({
    queryKey: ["filmComments", selectedFilmId],
    queryFn: () => fetchFilmComments(selectedFilmId as number, getToken()),
    enabled: !!selectedFilmId
  });

  const createMutation = useMutation({
    mutationFn: (newComment: CreateCommentDTO) =>
      createComment(newComment, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      if (selectedFilmId) {
        queryClient.invalidateQueries({
          queryKey: ["filmComments", selectedFilmId]
        });
      }
      setShowForm(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: CreateCommentDTO }) =>
      updateComment(id, comment, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      if (selectedFilmId) {
        queryClient.invalidateQueries({
          queryKey: ["filmComments", selectedFilmId]
        });
      }
      setShowForm(false);
      setEditingComment(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteComment(id, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentsList"] });
      if (selectedFilmId) {
        queryClient.invalidateQueries({
          queryKey: ["filmComments", selectedFilmId]
        });
      }
    }
  });

  const handleAddClick = () => {
    setEditingComment(null);
    setShowForm(true);
  };

  const handleEditClick = (comment: CommentType) => {
    setEditingComment(comment);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: CreateCommentDTO) => {
    if (editingComment) {
      updateMutation.mutate({ id: editingComment.id, comment: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingComment(null);
  };

  const comments = selectedFilmId ? filmCommentsData?.data : allCommentsData?.data;
  const isLoading = selectedFilmId ? isLoadingFilmComments : isLoadingAllComments;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">My Film Comments</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-500 text-white rounded px-4 py-2 flex items-center"
          >
            <PlusOutlined className="mr-1" /> Add Comment
          </button>
        )}
      </div>

      {showForm ? (
        <CommentForm
          comment={editingComment || null}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <FilterPanel
            selectedFilmId={selectedFilmId}
            setSelectedFilmId={setSelectedFilmId}
          />

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin inline-block size-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
              <p>Loading comments...</p>
            </div>
          ) : comments && comments.length > 0 ? (
            <div>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
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
  );
};

export default Comment;