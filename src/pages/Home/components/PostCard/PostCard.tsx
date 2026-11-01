import { useContext, useEffect, useState } from "react";

import type {
  Comment,
  CommentsResponse,
  PostCardProps,
} from "../../../../types/post.type";
import TopComment from "../topComment/topComment";

import axios, { type AxiosError, type AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoaderApi from "../../../../components/LoaderApi/LoaderApi";
import CreateComment from "../commentCreation/commentCreation";
import CreatePostModal from "../CreatePostModal/CreatePostModal";
import toast from "react-hot-toast";
import { userDataContext } from "../../../../Context/userData.Context";

import PostHeaderShare from "./components/PostHeaderShare";
import PostStats from "./components/PostStats";
import PostActions from "./components/PostActions";
import OptionsMenu from "../CreationReply/OptionsMenu/OptionsMenu";
import { showDeleteConfirm } from "../showDeleteConfirm";
import PostContent from "./components/PostContent";

const DEFAULT_PHOTO =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function PostCard({ post, postDetails = false }: PostCardProps) {
  const { _id, topComment, user } = post;

  const userContext = useContext(userDataContext);
  const userData = userContext?.userData;
  const myID = userData?._id;

  const [isLiked, setIsLiked] = useState<boolean>(
    post.likes?.includes(`${myID}`) ?? false,
  );

  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    Boolean(post.bookmarked),
  );

  // States الخاصة بمودل التعديل (Edit Post)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(
    post.image || null,
  );
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [isEditedLocally, setIsEditedLocally] = useState<boolean>(() => {
    const editedPosts = JSON.parse(localStorage.getItem("editedPosts") || "{}");
    return Boolean(editedPosts[_id]);
  });

  const query = useQueryClient();

  const isOwner = Boolean(myID && user?._id === myID);

  useEffect(() => {
    setIsLiked(post.likes?.includes(`${myID}`) ?? false);
    setLikesCount(post.likesCount || 0);
    setIsBookmarked(Boolean(post.bookmarked));
    setEditImagePreview(post.image || null);
  }, [post, myID]);

  // دالة تغيير الصورة أثناء التعديل
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditSelectedFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // LIKE
  function handelLike() {
    const token = localStorage.getItem("userToken");
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}/like`,
      {},
      {
        headers: {
          token: token || "",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: handelLike,
    onSuccess: (response) => {
      const { liked, likesCount: updatedLikesCount } = response.data.data;
      setIsLiked(liked);
      setLikesCount(updatedLikesCount);
      query.invalidateQueries({ queryKey: ["getAllPost"] });
      query.invalidateQueries({ queryKey: ["getPostDetails"] });
      toast.success("Like updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to like post");
    },
  });

  // BOOKMARK
  function handelBookmarked() {
    const token = localStorage.getItem("userToken");
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}/bookmark`,
      {},
      {
        headers: {
          token: token || "",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { isPending: loadingBookmarked, mutate: Mutate } = useMutation({
    mutationFn: handelBookmarked,
    onSuccess: (response) => {
      const { bookmarked } = response.data.data;
      setIsBookmarked(Boolean(bookmarked));

      query.invalidateQueries({ queryKey: ["getAllPost"] });
      query.invalidateQueries({ queryKey: ["getPostDetails"] });
      query.invalidateQueries({ queryKey: ["getUserBookmarks"] });

      toast.success("Bookmark updated successfully");

      if (userContext?.getUserProfile) {
        userContext.getUserProfile();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update bookmark");
    },
  });

  // SHARE
  function handelShare() {
    const token = localStorage.getItem("userToken");
    return axios.post(
      `https://route-posts.routemisr.com/posts/${_id}/share`,
      { body: "Sharing this great post" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  const { isPending: loadingShare, mutate: mutateShare } = useMutation({
    mutationFn: handelShare,
    onSuccess: () => {
      toast.success("Post shared successfully");
      query.invalidateQueries({ queryKey: ["getAllPost"] });
      query.invalidateQueries({ queryKey: ["getPostDetails"] });
      query.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to share post");
    },
  });

  // DELETE POST
  function handelDeletePost() {
    const token = localStorage.getItem("userToken");
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: {
        token: token || "",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { isPending: loadingDelete, mutate: mutateDelete } = useMutation({
    mutationFn: handelDeletePost,
    onSuccess: (response) => {
      toast.success(response.data?.message || "Post deleted successfully");
      query.invalidateQueries({ queryKey: ["getAllPost"] });
      query.invalidateQueries({ queryKey: ["getPostDetails"] });
      query.invalidateQueries({ queryKey: ["getAllComments", _id] });
      query.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
    },
  });

  // استخدام دالة الحذف المساعدة المشتركة
  function handleDeleteClick() {
    showDeleteConfirm(() => {
      mutateDelete();
    }, "Are you sure you want to delete this post?");
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function getAllComments() {
    return axios.get<CommentsResponse>(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<CommentsResponse>,
    AxiosError
  >({
    queryKey: ["getAllComments", _id],
    queryFn: getAllComments,
    enabled: postDetails,
  });

  if (isLoading) return <LoaderApi />;
  if (isError) return <p>{error.message}</p>;

  const isSharedPost = Boolean(post.isShare);
  const originalPost = post.sharedPost;
  const displayedUser = isSharedPost ? originalPost?.user : user;
  const displayedBody = isSharedPost ? originalPost?.body : post.body;
  const displayedImage = isSharedPost ? originalPost?.image : post.image;
  const displayedCreatedAt = isSharedPost
    ? originalPost?.createdAt
    : post.createdAt;
  const displayedPrivacy = isSharedPost ? originalPost?.privacy : post.privacy;

  return (
    <article className="w-full relative bg-white dark:bg-[#1a1a1b] rounded-xl p-3.5 sm:p-4 shadow-2xs border border-gray-200 dark:border-[#343536] hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-150">
      {isSharedPost && (
        <PostHeaderShare
          user={user}
          DEFAULTPHOTO={DEFAULT_PHOTO}
          postCreatAt={post.createdAt}
          formatData={formatDate}
          renderOptionsMenu={() => (
            <OptionsMenu
              isOwner={isOwner}
              onEdit={() => setIsEditOpen(true)}
              onDelete={handleDeleteClick}
              isDeleting={loadingDelete}
              editLabel="Edit Post"
              deleteLabel={isSharedPost ? "Delete Share" : "Delete Post"}
            />
          )}
          isEditedLocally={isEditedLocally}
        />
      )}

      <PostContent
        userId={post.user._id}
        isSharedPost={isSharedPost}
        displayedUser={displayedUser}
        DEFAULT_PHOTO={DEFAULT_PHOTO}
        displayedCreatedAt={displayedCreatedAt}
        displayedPrivacy={displayedPrivacy}
        isEditedLocally={isEditedLocally}
        isOwner={isOwner}
        setIsEditOpen={setIsEditOpen}
        handleDeleteClick={handleDeleteClick}
        loadingDelete={loadingDelete}
        displayedBody={displayedBody}
        displayedImage={displayedImage}
        formatDate={formatDate}
      />

      <PostStats
        likesCount={likesCount}
        commentsCount={post.commentsCount || 0}
        sharesCount={post.sharesCount || 0}
      />

      <PostActions
        isLiked={isLiked}
        isPending={isPending}
        loadingShare={loadingShare}
        loadingBookmarked={loadingBookmarked}
        isBookmarked={isBookmarked}
        mutate={() => mutate()}
        mutateShare={() => mutateShare()}
        mutateBookmark={() => Mutate()}
        postId={_id as string}
        postDetails={Boolean(postDetails)}
      />

      <div className="space-y-2 mt-2">
        {postDetails
          ? data?.data?.data?.comments?.map((comment: Comment) => (
              <TopComment
                key={comment._id}
                comment={comment}
                createdAt={comment.createdAt}
                postId={_id as string}
                postDetails={postDetails}
              />
            ))
          : topComment && (
              <TopComment
                comment={topComment}
                createdAt={topComment.createdAt}
                postDetails={postDetails}
                postId={_id as string}
              />
            )}
      </div>

      {post && (
        <div
          className={`${
            postDetails ? "hidden" : "block"
          } shrink-0 pt-2 mt-2 border-t border-gray-100 dark:border-[#272729]`}
        >
          <CreateComment
            postId={post._id}
            querykey={postDetails ? ["getPostDetails"] : ["getAllPost"]}
          />
        </div>
      )}

      {/* Edit Post Modal */}
      <CreatePostModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isEditMode={true}
        postId={_id}
        initialBody={post.body || ""}
        selectedImage={editImagePreview}
        selectedFile={editSelectedFile}
        setSelectedImage={setEditImagePreview}
        setSelectedFile={setEditSelectedFile}
        handleImageChange={handleEditImageChange}
        setIsEditedLocally={setIsEditedLocally}
      />
    </article>
  );
}
