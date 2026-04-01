export interface Dimensions {
  width: number;
  height: number;
}

export function calcHeightFromWidth(
  width: number,
  original: Dimensions
): number {
  if (original.width === 0) return 0;
  return Math.round((width / original.width) * original.height);
}

export function calcWidthFromHeight(
  height: number,
  original: Dimensions
): number {
  if (original.height === 0) return 0;
  return Math.round((height / original.height) * original.width);
}

export function clampDimension(value: number): number {
  return Math.max(1, Math.min(16384, Math.round(value)));
}

export async function getImageDimensions(file: File): Promise<Dimensions> {
  const bitmap = await createImageBitmap(file);
  const dims = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dims;
}
