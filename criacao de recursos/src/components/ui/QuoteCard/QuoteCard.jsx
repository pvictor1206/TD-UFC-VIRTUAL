export default function QuoteCard({ quote, author }) {
  return (
    <div className="rounded-[6px] border-l-[6px] border-lav-bar bg-lav-soft p-5 md:p-6">
      <p className="text-center text-[15px] md:text-[16px] leading-relaxed italic text-[#1b1b3a] mb-3">
        {quote}
      </p>
      {author && <p className="text-right text-sm italic text-[#1b1b3a]/70">{author}</p>}
    </div>
  );
}
