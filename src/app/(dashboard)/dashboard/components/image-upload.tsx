"use client";

import Image from "next/image";
import { createClient } from "@/src/lib/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  defaultUrl?: string;
  onUrlChange: (url: string) => void;
}

async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context failed"));

        ctx.drawImage(img, 0, 0, width, height);

        // AVIF is great, but ensure quality and fallback
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Conversion failed"));
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".avif";
            resolve(new File([blob], newName, { type: "image/avif" }));
          },
          "image/avif",
          0.8
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export function ImageUpload({ defaultUrl, onUrlChange }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultUrl || "");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    setUploading(true);
    const toastId = toast.loading("Otimizando imagem...");

    try {
      const file = await optimizeImage(originalFile);
      const supabase = createClient();

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.avif`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          contentType: "image/avif",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      setPreview(data.publicUrl);
      onUrlChange(data.publicUrl);

      toast.success("Imagem enviada!", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao processar imagem.", { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-500 text-sm font-medium animate-pulse">
              Otimizando e enviando...
            </div>
          </div>
        ) : preview ? (
          <Image
            src={preview}
            alt="Product Preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"

            unoptimized={
              preview.startsWith("http://127.0.0.1") ||
              preview.startsWith("http://localhost")
            }
          />
        ) : (
          <div className="text-gray-400 text-sm text-center px-4">
            <p>Nenhuma imagem selecionada</p>
            <p className="text-xs mt-1 text-gray-300">Max 1200px • Auto AVIF</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label
          className={`cursor-pointer inline-block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          {uploading ? "Processando..." : "Escolher Imagem"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {preview && !uploading && (
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onUrlChange("");
            }}
            className="text-xs text-red-500 underline hover:text-red-700"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
}