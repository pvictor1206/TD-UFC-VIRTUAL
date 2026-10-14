// Preparação de imagens antes do envio: reduz fotos grandes (lado maior 1600 px) e converte para WebP,
// para o site da aula carregar rápido. GIFs (podem ser animados) seguem como estão.

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_INPUT_BYTES = 10 * 1024 * 1024; // arquivo escolhido
export const MAX_OUTPUT_BYTES = 5 * 1024 * 1024; // o que realmente sobe
const MAX_SIDE = 1600;
const KEEP_AS_IS_BYTES = 1.5 * 1024 * 1024;

export async function shrinkImage(file: Blob): Promise<Blob> {
  if (file.type === 'image/gif') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= KEEP_AS_IS_BYTES) {
    bitmap.close();
    return file;
  }

  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string, quality?: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  // WebP mantém transparência; navegadores sem suporte devolvem PNG, e então usamos JPEG/PNG.
  let out = await encode('image/webp', 0.86);
  if (!out || out.type !== 'image/webp') {
    out = file.type === 'image/png' ? await encode('image/png') : await encode('image/jpeg', 0.88);
  }
  if (!out) return file;
  // sem redução de tamanho em pixels: só vale trocar se ficou menor
  if (scale === 1 && out.size >= file.size) return file;
  return out;
}

export const extensionFor = (type: string) =>
  ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' } as Record<string, string>)[type] || 'img';
