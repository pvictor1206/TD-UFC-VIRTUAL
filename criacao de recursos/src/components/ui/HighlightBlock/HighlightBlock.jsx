export default function HighlightBlock({ text, children, accentColor = "#2563EB" }) {
  return (
    <div className="rounded-[24px] border border-[#BFDBFE] bg-[#EFF6FF] p-6 md:p-8">
      <div className="flex gap-4">
        <div className="min-h-[56px] w-2 rounded-full" style={{ backgroundColor: accentColor }} />
        <div className="flex-1">
          <p className="text-left text-[18px] md:text-[22px] leading-[1.25] font-semibold text-[#111827]">
            {text || children}
          </p>
        </div>
      </div>
    </div>
  );
}
