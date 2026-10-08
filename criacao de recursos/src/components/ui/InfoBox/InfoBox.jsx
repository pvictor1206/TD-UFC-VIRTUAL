export default function ReferenceInfoBox({ id, quote }) {
  return (
    <div id={id} className="pt-[10px] pb-[20px]">
      <div className="flex bg-white border-l-5 border-[#EFE58D] rounded-md shadow-md p-4 max-w-3xl mx-auto">
        <div className="flex-1">
          <p
            className=" text-[#0C1E33] text-[16px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        </div>
      </div>
    </div>
  );
}