export interface ConvertOptions {
  quality: number; // 0–100
  width?: number;
  height?: number;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  convertedSize: number;
}

export async function convertToWebP(
  file: File,
  options: ConvertOptions
): Promise<ConvertResult> {
  const { quality, width, height } = options;

  const bitmap = await createImageBitmap(file);
  const srcW = bitmap.width;
  const srcH = bitmap.height;

  const targetW = width ?? srcW;
  const targetH = height ?? srcH;

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");

  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Failed to convert ${file.name} to WebP`));
          return;
        }
        resolve({
          blob,
          width: targetW,
          height: targetH,
          originalSize: file.size,
          convertedSize: blob.size,
        });
      },
      "image/webp",
      quality / 100
    );
  });
}

export function getOutputFileName(originalName: string): string {
  const base = originalName.replace(/\.[^/.]+$/, "");
  return `${base}.webp`;
}
