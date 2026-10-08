// Converte marcações simples em HTML:
// **negrito**, *itálico* e linhas iniciadas por "•" viram itens de lista.
// Mesmo padrão usado manualmente em todas as aulas (Módulos 01-16) — agora centralizado.
const toHtml = (line) =>
  line
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

export default function FormattedText({ text, className = '', style = {} }) {
  if (!text) return null;
  const lines = String(text).split('\n');
  const hasBullets = lines.some((line) => line.trim().startsWith('•'));

  if (!hasBullets) {
    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: toHtml(text) }}
      />
    );
  }

  return (
    <div className={className} style={style}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•')) {
          return (
            <div key={index} className="flex items-start gap-3 ml-4 mb-3">
              <span className="text-blue-800 font-bold mt-1.5 text-[8px]">●</span>
              <span
                className="flex-1 text-left"
                dangerouslySetInnerHTML={{ __html: toHtml(trimmed.substring(1).trim()) }}
              />
            </div>
          );
        }
        return (
          <p
            key={index}
            className={`${trimmed === '' ? 'h-4' : 'mb-4'} text-left leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: toHtml(line) }}
          />
        );
      })}
    </div>
  );
}
