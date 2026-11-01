import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// مكون فرعي لجلب بيانات اليوزر بالـ ID وعرضه في المودال
export function FollowItem({ userId, onClick }: { userId: string; onClick: () => void }) {
  const { data: userRes } = useQuery({
    queryKey: ["miniProfile", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const info = userRes?.data?.user;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272729] transition cursor-pointer"
    >
      <img
        src={
          info?.photo ||
          "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
        }
        alt={info?.name || "User"}
        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-[#343536] shrink-0"
      />
      <div className="min-w-0 flex-1 truncate">
        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 hover:underline truncate">
          {info?.name || "Loading..."}
        </h4>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">u/{info?.username || "user"}</p>
      </div>
    </div>
  );
}
