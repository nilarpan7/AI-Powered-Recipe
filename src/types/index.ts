export type ActivityLevel = 'low' | 'medium' | 'high';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DietPreferences {
  likes?: string[];
  cuisines?: string[];
  notes?: string;
}

export interface UserProfile {
  id: string;
  display_name?: string;
  diet_preferences?: DietPreferences;
  allergies?: string[];
  deficiencies?: string[];
  activity_level?: ActivityLevel;
  age?: number;
  gender?: Gender;
  created_at?: string;
  updated_at?: string;
}

export interface Ingredient {
  name: string;
  quantity: number | string;
  unit?: string;
}

export interface NutritionSummary {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Recipe {
  id?: string;
  user_id?: string | null;
  title: string;
  overview?: string;
  meal_type?: MealType;
  ingredients: Ingredient[];
  steps: string[];
  nutrition?: NutritionSummary;
  source?: 'ai' | 'manual';
  created_at?: string;
}

export interface Favorite {
  user_id: string;
  recipe_id: string;
  created_at?: string;
}

export interface RecipeFeedback {
  id?: string;
  user_id: string;
  recipe_id: string;
  rating: 1 | 2; // 1 = down, 2 = up
  comment?: string;
  created_at?: string;
}

export type AnalyticsEventType =
  | 'recipe_generated'
  | 'recipe_saved'
  | 'regen_clicked'
  | 'onboarding_start'
  | 'onboarding_complete';

export interface AnalyticsEvent {
  id?: string;
  user_id?: string | null;
  event_type: AnalyticsEventType;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

// Minimal API contracts
export interface GenerateRecipeInput {
  goal?: string;
  available_time?: number; // minutes
  meal_type?: MealType;
}

export interface GenerateRecipeRequest {
  profile?: UserProfile | null;
  input: GenerateRecipeInput;
}

export interface GenerateRecipeResponse {
  recipe: Recipe;
  youtube_query: string; // derived client-side from title + meal type
}


