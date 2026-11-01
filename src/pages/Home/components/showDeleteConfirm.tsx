import toast from 'react-hot-toast';

export function showDeleteConfirm(onConfirm: () => void, message: string = "Are you sure you want to delete this item?") {
  toast(
    (t) => (
      <div className="flex flex-col gap-3 bg-white dark:bg-[#1a1a1b] p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-[#343536] w-72">
        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
          {message}
        </p>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-full bg-gray-100 dark:bg-[#272729] px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#343536] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="rounded-full bg-red-600 hover:bg-red-700 px-3.5 py-1.5 text-xs font-semibold text-white transition cursor-pointer shadow-2xs"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    },
  );
}
