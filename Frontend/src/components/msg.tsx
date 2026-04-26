type Props = {
  content: string;
  time: string;
  sentbyme: boolean;
};

export function Messageg({ content, time, sentbyme }: Props) {
  return (
    <div
      className={`flex transition-all duration-200 ${sentbyme ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 pl-5 rounded-3xl ${sentbyme
          ? "bg-linear-150 from-blue-400 via-blue-500 to-blue-600 rounded-br-none"
          : "bg-white/10 ring ring-white/20 rounded-bl-none"
          }`}>
        <div className="text-white/80">{content}</div>
        <div
          className={` text-xs mt-1  pr-2 text-left flex ${sentbyme ? "justify-end text-white/70" : "justify-start text-white/50"}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
