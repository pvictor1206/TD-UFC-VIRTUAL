import { useContext, useId, useRef, useState } from 'react';
import { BuilderContext } from './BuilderContext';

// Campo de imagem: enviar um arquivo (vira link público) ou colar um endereço.
export default function ImageField({ label, help, value, onChange }) {
  const { uploadImage } = useContext(BuilderContext);
  const inputId = useId();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !uploadImage) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err?.message || 'Não foi possível enviar a imagem.');
    } finally {
      setBusy(false);
    }
  };

  const hasPreview = /^(https?:|data:|blob:)/i.test(value || '');

  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}

      <div className="flex flex-wrap items-stretch gap-2">
        {uploadImage && (
          <>
            <input
              ref={fileRef}
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={pick}
              className="hidden"
              aria-label="Escolher imagem do computador"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {busy ? 'Enviando…' : '⬆ Enviar imagem'}
            </button>
          </>
        )}
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={uploadImage ? 'ou cole o endereço (https://…)' : 'https://… ou imagens/foto1.png'}
          aria-label={label || 'Endereço da imagem'}
          className="min-w-[200px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Remover imagem"
            className="rounded-lg border border-gray-300 px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            ✕
          </button>
        )}
      </div>

      {error && <p role="alert" className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
      {hasPreview && (
        <img
          src={value}
          alt="Pré-visualização da imagem"
          className="mt-2 max-h-40 rounded-lg border border-gray-200 bg-white object-contain"
        />
      )}
      {help && <p className="mt-1 text-[11px] text-gray-400">{help}</p>}
    </div>
  );
}
