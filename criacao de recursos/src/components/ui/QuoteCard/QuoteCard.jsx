export default function QuoteCard({ quote, author }) {
  return (
    <div className="rounded-[24px] border border-[#93C5FD] bg-[#EFF6FF] p-6 shadow-sm">
      <p className="text-left text-[16px] md:text-[18px] leading-relaxed font-medium text-[#1e3a8a] mb-5">
        {quote}
      </p>
      <p className="text-left text-sm text-[#1e40af]">{author}</p>
    </div>
  );
}
