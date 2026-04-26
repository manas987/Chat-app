import { User } from "lucide-react";

type Props = {
  username: string;
  fullname: string;
};

export function Chats({ username, fullname }: Props) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-2xl 
    bg-white/4 hover:bg-white/6
    ring-1 ring-white/10
    transition-all duration-200">
      <div className="w-12 h-12 rounded-full bg-white/8 flex items-center justify-center">
        <User size={20} className="text-white/40" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="text-white text-[15px] font-semibold truncate">
          {fullname}
        </div>

        <div className="text-white/40 text-sm truncate">@{username}</div>
      </div>
    </div>
  );
}
