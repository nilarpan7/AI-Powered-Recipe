import { z } from 'zod';

export const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.union([z.number(), z.string()]),
  unit: z.string().optional()
});

export const NutritionSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional()
});

export const RecipeSchema = z.object({
  title: z.string(),
  overview: z.string().optional(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  ingredients: z.array(IngredientSchema),
  steps: z.array(z.string()).min(1),
  nutrition: NutritionSchema.optional()
});

export const GenerateInputSchema = z.object({
  profile: z.any().nullable().optional(),
  input: z.object({
    goal: z.string().optional(),
    available_time: z.number().int().positive().max(60).optional(),
    meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional()
  }),
  user_id: z.string().uuid().nullable().optional()
});

export type Recipe = z.infer<typeof RecipeSchema>;


