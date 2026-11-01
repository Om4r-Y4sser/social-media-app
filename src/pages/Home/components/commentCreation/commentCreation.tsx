import { Send, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { userDataContext } from "../../../../Context/userData.Context";
import { useContext, useState } from "react";
import EmojiPickerPopover from "../../../../components/EmojiPickerPopover/EmojiPickerPopover";
import type { CommentType } from "../../../../types/post.type";

export default function CreateComment({
  postId,
  querykey,
}: {
  postId: string;
  querykey?: string[];
}) {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const form = useForm<CommentType>({
    defaultValues: {
      content: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { register, handleSubmit, formState, reset, watch, setValue } = form;
  
  // بنراقب قيمة المحتوى عشان نضيف عليها الإيموجي صح
  const currentContent = watch("content") || "";

  const handleAddEmoji = (emoji: string) => {
    setValue("content", currentContent + emoji, { shouldValidate: true });
  };

  const query = useQueryClient();

  function createComment(formdata: FormData) {
    const token = localStorage.getItem("userToken");

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
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
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment created successfully");
      query.invalidateQueries({
        queryKey: querykey,
      });
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create comment");
    },
  });

  function handelComment(value: CommentType) {
    const formdata = new FormData();
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
      className="w-full pt-2"
      dir="ltr"
    >
      <div className="flex items-start gap-2.5">
        {/* User Profile Avatar */}
        <img
          src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
          alt={userData?.name || "User"}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-[#343536] mt-0.5"
        />

        {/* Input Box Container */}
        <form
          onSubmit={handleSubmit(handelComment)}
          className="flex-1 bg-[#f6f7f8] dark:bg-[#121213] border border-gray-200 dark:border-[#343536] focus-within:border-[#ff4500] rounded-xl p-2 sm:p-2.5 transition-colors shadow-2xs"
        >
          <textarea
            {...register("content")}
            placeholder="What are your thoughts?"
            rows={2}
            className="w-full bg-transparent text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-[#272729] mt-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <EmojiPickerPopover
                onEmojiSelect={handleAddEmoji}
                isOpen={isEmojiOpen}
                setIsOpen={setIsEmojiOpen}
              />

              <label 
                className="p-1.5 cursor-pointer text-gray-400 hover:text-[#ff4500] dark:hover:text-[#ff4500] rounded-lg hover:bg-gray-200 dark:hover:bg-[#272729] transition"
                title="Attach image"
              >
                <input hidden {...register("image")} type="file" />
                <Image className="w-4 h-4" />
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1 bg-[#ff4500] hover:bg-[#e03d00] disabled:opacity-40 text-white rounded-full flex items-center gap-1.5 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <span>{isPending ? "Posting..." : "Comment"}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
