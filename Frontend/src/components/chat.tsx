import { User } from "lucide-react";

type Props = {
  username: string;
  fullname: string;
  selected?: boolean;
  onClick?: () => void;
};

export function Chats({ username, fullname, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-150 ${
        selected
          ? "bg-white/10 ring-1 ring-white/20"
          : "bg-white/[0.03] hover:bg-white/6 ring-1 ring-white/5"
      }`}>
      <div
        className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ring-1 ${
          selected
            ? "bg-orange-700 ring-white/20"
            : "bg-white/8 ring-white/10"
        }`}>
        <User size={18} className={selected ? "text-white" : "text-white/40"} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="text-white text-[15px] font-medium truncate">
          {fullname}
        </div>
        <div className="text-white/40 text-sm truncate">@{username}</div>
      </div>
    </button>
  );
}
