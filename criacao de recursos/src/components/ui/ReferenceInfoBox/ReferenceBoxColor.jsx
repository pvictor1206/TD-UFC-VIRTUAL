export default function ReferenceBoxColor({
  quote,

  // --- Parâmetros de Cor ---
  bgColor = "var(--color-lav-soft)",       // Fundo lavanda claro
  borderColor = "var(--color-lav-bar)",   // Borda lateral lavanda
  textColor = "#1b1b3a",     // Navy

  // --- Parâmetros de Fonte (Responsivos) ---
  fontSizeMobile = "14px",
  fontSizeDesktop = "15px"
}) {
  return (
    <div
      className="my-4"
      style={{
        "--ref-fs-mob": fontSizeMobile,
        "--ref-fs-desk": fontSizeDesktop,
      }}
    >
      <div
        className="relative mx-auto max-w-3xl border-l-[6px] rounded-[6px] p-5 md:p-6"
        style={{ backgroundColor: bgColor, borderColor }}
      >
        <p
          className="
            italic leading-relaxed text-justify
            text-[length:var(--ref-fs-mob)] md:text-[length:var(--ref-fs-desk)]
          "
          style={{ color: textColor }}
          dangerouslySetInnerHTML={{ __html: quote }}
        />
      </div>
    </div>
  );
}
