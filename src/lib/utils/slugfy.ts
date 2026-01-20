export function slugify(text: string) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Substitui espaços por -
    .replace(/[^\w\-]+/g, '') // Remove caracteres não alfanuméricos
    .replace(/\-\-+/g, '-')   // Substitui múltiplos - por um único -
}