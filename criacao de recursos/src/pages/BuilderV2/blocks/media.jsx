import { AddButton, ImageSlot, InlineText, MoveButtons, RemoveX } from '../fields';
import { listApi, parseVideoId } from '../listOps';

// Imagem, vídeo e carrossel: o arquivo/endereço é escolhido no próprio componente.

export function ImageEditor({ block, onChange }) {
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  return (
    <figure className="mb-16 mt-8 flex flex-col items-center">
      <ImageSlot value={block.src} onChange={set('src')} alt={block.alt} className="w-full max-w-full lg:max-w-3xl" />
      <figcaption className="mt-3 text-center italic text-ink/70" style={{ fontSize: '1em' }}>
        <InlineText value={block.caption} onChange={set('caption')} placeholder="Legenda (opcional)" className="inline-block min-w-[8rem]" />
      </figcaption>
    </figure>
  );
}

export function VideoEditor({ block, selected, onChange }) {
  const isDrive = block.source === 'drive';
  const id = isDrive ? block.driveId : block.videoId;
  const set = (key) => (value) => onChange({ ...block, [key]: value });
  const src = isDrive ? `https://drive.google.com/file/d/${id}/preview` : `https://www.youtube.com/embed/${id}`;
  return (
    <section className="my-4 overflow-hidden rounded-[10px]">
      <p className="bg-lav px-4 py-2 text-left text-xs font-bold uppercase tracking-wide text-ink">
        <InlineText value={block.title} onChange={set('title')} placeholder="Título do vídeo (opcional)" className="block" />
      </p>
      <div className="w-full" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        {id ? (
          <>
            <iframe
              src={src}
              title={block.title || 'Vídeo complementar'}
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
            {/* só deixa interagir com o player depois de selecionar o componente */}
            {!selected && <div className="absolute inset-0" />}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gray-100 text-sm font-semibold text-ink/60">
            <span className="text-2xl" aria-hidden>🎬</span>
            Cole o link do vídeo na caixa abaixo
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 bg-lav-soft px-3 py-2 text-xs text-ink">
        <select
          value={block.source || 'youtube'}
          onChange={(e) => onChange({ ...block, source: e.target.value })}
          aria-label="Origem do vídeo"
          className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 font-semibold outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="youtube">YouTube</option>
          <option value="drive">Google Drive</option>
        </select>
        <input
          type="text"
          data-field=""
          value={id ?? ''}
          onChange={(e) => set(isDrive ? 'driveId' : 'videoId')(parseVideoId(e.target.value, block.source))}
          placeholder={isDrive ? 'Link ou ID do arquivo no Google Drive' : 'Cole o link do YouTube (ou só o ID do vídeo)'}
          aria-label={isDrive ? 'ID do arquivo no Google Drive' : 'ID do vídeo no YouTube'}
          className="min-w-[14rem] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </section>
  );
}

export function CarouselEditor({ block, onChange }) {
  const list = listApi(block, onChange, 'images', () => ({ src: '', alt: '', caption: '' }));
  return (
    <section className="my-8">
      <p className="mb-2 text-xs font-semibold text-ink/60">🎠 Carrossel — o aluno vê uma imagem de cada vez e navega entre elas.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.items.map((img, i) => (
          <div key={i} className="group/item relative rounded-lg bg-lav-soft p-2">
            <ImageSlot compact value={img.src} alt={img.alt} onChange={(v) => list.patchItem(i, { src: v })} />
            <p className="mt-2 text-center text-sm italic text-ink/70">
              <InlineText value={img.caption} onChange={(v) => list.patchItem(i, { caption: v })} placeholder="Legenda (opcional)" className="block" />
            </p>
            <p className="text-center text-xs text-ink/50">
              <InlineText value={img.alt} onChange={(v) => list.patchItem(i, { alt: v })} placeholder="Texto alternativo (acessibilidade)" className="block" />
            </p>
            <MoveButtons index={i} total={list.items.length} onMove={list.move} />
            <RemoveX onClick={() => list.remove(i)} title="Remover imagem" />
          </div>
        ))}
      </div>
      <AddButton onClick={list.add} className="mt-3">Adicionar imagem</AddButton>
    </section>
  );
}
