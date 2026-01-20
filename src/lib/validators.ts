import { z } from 'zod'

// --- Product Schemas ---
export const ProductSchema = z.object({
    // ID can be a UUID or an empty string (when creating new)
    id: z.uuid().optional().or(z.literal('')),

    name: z.string().min(1, "Nome do produto é obrigatório"),

    description: z.string().optional(),

    // Slug: allow empty (auto-generate logic handles it) or valid slug format
    slug: z.string()
        .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens")
        .optional()
        .or(z.literal('')),

    image_url: z.string().url("URL da imagem inválida").optional().or(z.literal('')),

    // Enums match the database type
    status: z.enum(['active', 'inactive', 'draft']).optional().default('active'),
})

// --- Attribute/Option Schemas ---
export const AttributeSchema = z.object({
    id: z.uuid().optional().or(z.literal('')),
    name: z.string().min(1, "Nome do atributo é obrigatório"),
})

export const OptionSchema = z.object({
    id: z.uuid().optional().or(z.literal('')),
    attribute_id: z.uuid(),
    name: z.string().min(1, "Valor do atributo é obrigatório"),
    description: z.string().optional(),
})

// --- Checkout/Quote Schemas ---

// Helper for Cart Item
const CartItemSchema = z.object({
    productId: z.string().optional(),
    productName: z.string(),
    quantity: z.coerce.number().min(1, "Quantidade mínima é 1"),
    options: z.array(z.object({
        name: z.string(),
        value: z.string()
    })).optional()
})

export const QuoteRequestSchema = z.object({
    name: z.string().min(3, "Informe seu nome completo"),

    email: z.email("Email inválido"),

    whatsapp: z.string()
        .min(10, "WhatsApp deve ter pelo menos 10 dígitos (DDD + Número)")
        .transform(val => val.replace(/\D/g, '')), // Removes non-digits

    // Validates the JSON string coming from the hidden input
    cart_items: z.string().transform((str, ctx) => {
        try {
            const parsed = JSON.parse(str);

            // Validate that the parsed JSON is actually an array of items
            const result = z.array(CartItemSchema).safeParse(parsed);

            if (!result.success) {
                ctx.addIssue({
                    code: "custom",
                    message: "Estrutura dos itens do carrinho inválida"
                });
                return z.NEVER;
            }

            return parsed; // Returns the actual object, not the string
        } catch {
            ctx.addIssue({
                code: "custom",
                message: "Erro ao processar itens do carrinho"
            });
            return z.NEVER;
        }
    })
})