import { Send, Image } from "lucide-react";
import { useContext, useState } from "react";
import { userDataContext } from "../../../../Context/userData.Context";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  PostSchema,
  type PostSchemaType,
} from "../../../../schemas/posts.schema";

interface CommentReplyBoxProps {
  onClose?: () => void;
  commentID: string;
  postId: string;
}

export default function CommentReplyBox({
  onClose,
  postId,
  commentID,
}: CommentReplyBoxProps) {
  const user = useContext(userDataContext);
  const [isClose, setIsClose] = useState(false);
  const userdata = user?.userData;

  if (isClose) return null;

  const form = useForm<PostSchemaType>({
    defaultValues: {
      content: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(PostSchema),
    reValidateMode: "onSubmit",
  });
  const { register, handleSubmit, formState, reset } = form;
  const formdata = new FormData();
  const query = useQueryClient();

  function createReplay(formdata: FormData) {
    const token = localStorage.getItem("userToken");

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentID}/replies`,
      formdata,
      {
        headers: {
          token: token || "",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createReplay,
    onSuccess: () => {
      toast.success("Comment created successfully");
      query.invalidateQueries({
        queryKey: ["getAllReplies", postId, commentID],
      });
      reset();
      setIsClose(true);
      if (onClose) onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create comment");
    },
  });

  function handelReplay(value: PostSchemaType) {
    formdata.append("content", value.content);
   
    if (value.image?.[0]) {
      formdata.append("image", value.image[0]);
    }

    mutate(formdata);
  }

  if (formState.errors.content) {
    toast.error(`${formState.errors.content.message}`);
  }
  if (formState.errors.image) {
    toast.error(`${formState.errors.image.message}`);
  }

  return (
    <div
      className="relative w-full bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-xl p-2.5 sm:p-3 shadow-2xs transition-colors"
      dir="ltr"
    >
      {/* Close Button Handler */}
      <button
        type="button"
        onClick={() => {
          setIsClose(true);
          if (onClose) onClose();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1 cursor-pointer"
        title="Close"
      >
        <IoCloseSharp className="w-4 h-4" />
      </button>

      {/* Input area with user avatar */}
      <div className="flex items-start gap-2.5 mt-0.5">
        <img
          src={userdata?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
          alt={userdata?.name || "User"}
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200 dark:border-[#343536] mt-0.5"
        />

        <form
          onSubmit={handleSubmit(handelReplay)}
          className="flex-1 bg-[#f6f7f8] dark:bg-[#121213] border border-gray-200 dark:border-[#343536] focus-within:border-[#ff4500] rounded-xl px-3 py-2 transition"
        >
          <textarea
            {...register("content")}
            rows={2}
            placeholder="Write a reply..."
            className="w-full bg-transparent text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-[#272729] mt-1">
            <label 
              className="text-gray-400 hover:text-[#ff4500] dark:hover:text-[#ff4500] transition p-1 cursor-pointer"
              title="Attach image"
            >
              <input hidden {...register("image")} type="file" />
              <Image className="w-4 h-4" />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1 bg-[#ff4500] hover:bg-[#e03d00] disabled:opacity-40 text-white rounded-full flex items-center gap-1.5 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <span>{isPending ? "Posting..." : "Reply"}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
