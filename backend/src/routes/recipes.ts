import { Router } from 'express';
import { GenerateInputSchema, RecipeSchema } from '../schemas.js';
import { generateRecipeJson } from '../services/openai.js';
import { supabaseAdmin } from '../services/supabase.js';

export const recipesRouter = Router();

recipesRouter.post('/generate', async (req, res) => {
  try {
    const parsed = GenerateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    }

    const { profile, input, user_id } = parsed.data;
    const ai = await generateRecipeJson(profile ?? {}, input ?? {});
    const val = RecipeSchema.safeParse(ai);
    if (!val.success) {
      return res.status(502).json({ error: 'AI returned invalid structure', details: val.error.flatten() });
    }

    const recipe = val.data;
    let savedId: string | undefined;
    if (user_id && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .insert({
          user_id,
          title: recipe.title,
          overview: recipe.overview ?? null,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          nutrition: recipe.nutrition ?? null,
          meal_type: recipe.meal_type ?? null,
          source: 'ai'
        })
        .select('id')
        .single();
      if (error) {
        console.error('Supabase insert error', error);
      } else {
        savedId = data?.id as string | undefined;
      }
    }

    const youtube_query = `${recipe.title} ${recipe.meal_type ?? ''} recipe 5-10 minutes`;
    return res.json({ recipe: { ...recipe, id: savedId }, youtube_query });
  } catch (e: any) {
    const status = e?.statusCode && Number.isInteger(e.statusCode) ? e.statusCode : 500;
    const message = e?.expose ? e.message : 'Internal server error';
    if (status >= 500) console.error(e);
    return res.status(status).json({ error: message });
  }
});


