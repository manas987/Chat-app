type Props = {
  content: string;
  time: string;
  sentbyme: boolean;
};

export function Messageg({ content, time, sentbyme }: Props) {
  return (
    <div
      className={`flex animate-rise-in ${sentbyme ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-3xl ${
          sentbyme
            ? "bg-orange-700 rounded-br-md text-white"
            : "bg-white/8 ring-1 ring-white/10 rounded-bl-md text-white/90"
        }`}>
        <div className="break-words">{content}</div>
        <div
          className={`text-[11px] mt-1 ${sentbyme ? "text-white/70" : "text-white/40"}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
