export default function ReferenceInfoBox({ id, quote }) {
  return (
    <div id={id} className="pt-[10px] pb-[20px]">
      <div className="flex border-l-[6px] border-lav-bar bg-lav-soft rounded-[6px] p-4 max-w-3xl mx-auto">
        <div className="flex-1">
          <p
            className=" text-[#1b1b3a] text-[16px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        </div>
      </div>
    </div>
  );
}