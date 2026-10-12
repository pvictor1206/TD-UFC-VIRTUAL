export default function HighlightBlock({ text, children, accentColor = "#c8c0ee" }) {
  return (
    <div className="rounded-[6px] bg-[#f4f1fd] p-5 md:p-6">
      <div className="flex gap-4">
        <div className="min-h-[40px] w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
        <div className="flex-1">
          <p className="text-left text-[16px] md:text-[18px] leading-[1.5] font-semibold text-[#1b1b3a]">
            {text || children}
          </p>
        </div>
      </div>
    </div>
  );
}
