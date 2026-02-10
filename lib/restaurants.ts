/**
 * Restaurant discovery: Gemini fetch + mock sensory/comfort data + profile scoring.
 */

import type { ChildProfile } from '@/contexts/profiles-context';
import { generateContent } from '@/lib/gemini';

export type RestaurantFromGemini = {
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: number; // 1=$, 2=$$, 3=$$$
  address?: string;
};

export type MockRestaurantData = {
  culturalComfort: string[];
  currentCrowd: 'low' | 'moderate' | 'busy';
  lighting: 'soft' | 'moderate' | 'bright';
  menuSummary: string;
  allergens: string[];
  usualWaitTime: string;
  backgroundNoise: 'low' | 'moderate' | 'high';
  bestMatchTag: string;
};

export type Restaurant = RestaurantFromGemini &
  MockRestaurantData & { matchScore: number; imageUri?: string | null };

const MOCK_CULTURAL_COMFORT_POOL: string[][] = [
  ['American', 'Italian'],
  ['American', 'Mexican'],
  ['Mediterranean', 'American'],
  ['Asian', 'American'],
  ['Italian'],
  ['American'],
  ['Mexican', 'American'],
  ['Japanese', 'American'],
];

const MOCK_CROWD: MockRestaurantData['currentCrowd'][] = ['low', 'moderate', 'busy'];
const MOCK_LIGHTING: MockRestaurantData['lighting'][] = ['soft', 'moderate', 'bright'];
const MOCK_NOISE: MockRestaurantData['backgroundNoise'][] = ['low', 'moderate', 'high'];

const MOCK_MENU_SUMMARIES = [
  'Simple comfort dishes, kids menu, familiar options.',
  'Varied menu with gluten-free options and plain preparations available.',
  'Limited but clear menu; staff used to modifications.',
  'Family-style portions; can request quieter seating.',
];

const MOCK_ALLERGENS_POOL: string[][] = [
  ['Nuts', 'Dairy'],
  ['Gluten'],
  ['Nuts'],
  ['Dairy', 'Eggs'],
  ['None listed'],
  ['Shellfish', 'Nuts'],
];

const MOCK_WAIT_TIMES = ['5–15 min', '10–20 min', '15–25 min', '5–10 min', '20–35 min'];

const MOCK_BEST_MATCH_TAGS = [
  'Best match for quiet dining',
  'Calm atmosphere, spacious seating',
  'Low stimulation, predictable',
  'Quiet and low lighting',
  'Spacious seating, minimal crowding',
];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

/** Curated free restaurant/dining images (Unsplash, no API key). */
const RESTAURANT_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1424847651672-bf20ade79823?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=400&fit=crop',
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Restaurant-only image URL (curated list). Same name always gets the same image.
 */
export function getFreeRestaurantImageUrl(restaurantName: string): string {
  const n = hashCode((restaurantName || 'restaurant').trim());
  return RESTAURANT_IMAGE_URLS[n % RESTAURANT_IMAGE_URLS.length];
}

/**
 * Build prompt for Gemini to return real restaurants near the user.
 */
export function buildRestaurantsPrompt(options: {
  latitude: number;
  longitude: number;
  cityOrRegion?: string;
  cuisines: string[];
}): string {
  const { latitude, longitude, cityOrRegion, cuisines } = options;
  const locationDesc = cityOrRegion
    ? `in or near ${cityOrRegion}`
    : `near coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  const cuisinePart =
    cuisines.length > 0
      ? ` that serve or specialize in: ${cuisines.join(', ')}.`
      : '. Include a variety of cuisines.';

  return `List 12 real, existing restaurants ${locationDesc}${cuisinePart}

Return a JSON array only, no other text. Each object must have:
- "name" (string): restaurant name
- "cuisine" (string): primary cuisine type, e.g. American, Italian, Mediterranean
- "rating" (number): 3.0 to 5.0
- "priceLevel" (number): 1, 2, or 3 (1=$ budget, 2=$$ mid, 3=$$$ upscale)
- "address" (string): full street address of the restaurant in the format "Street, City, State/Region" so a user can find it

Example: [{"name":"The Quiet Corner Café","cuisine":"American","rating":4.5,"priceLevel":2,"address":"123 Main St, San Francisco, CA"},{"name":"Willow Garden Bistro","cuisine":"Mediterranean","rating":4.6,"priceLevel":2,"address":"456 Oak Ave, San Francisco, CA"}]
Return only the JSON array.`;
}

/**
 * Parse Gemini response into RestaurantFromGemini[]. Tolerates markdown code blocks.
 */
export function parseGeminiRestaurantsResponse(text: string): RestaurantFromGemini[] {
  let raw = text.trim();
  const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) raw = codeMatch[1].trim();
  try {
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
      .map((item) => ({
        name: String(item.name ?? 'Restaurant'),
        cuisine: String(item.cuisine ?? 'American'),
        rating: Math.min(5, Math.max(0, Number(item.rating) || 4)),
        priceLevel: Math.min(3, Math.max(1, Math.round(Number(item.priceLevel) || 2))),
        address: item.address != null ? String(item.address) : undefined,
      }));
  } catch {
    return [];
  }
}

/**
 * Add mock sensory/comfort data to a restaurant (deterministic by index).
 */
export function addMockRestaurantData(
  r: RestaurantFromGemini,
  index: number
): Omit<Restaurant, 'matchScore'> {
  return {
    ...r,
    imageUri: getFreeRestaurantImageUrl(r.name),
    culturalComfort: pick(MOCK_CULTURAL_COMFORT_POOL, index),
    currentCrowd: pick(MOCK_CROWD, index),
    lighting: pick(MOCK_LIGHTING, index),
    menuSummary: pick(MOCK_MENU_SUMMARIES, index),
    allergens: pick(MOCK_ALLERGENS_POOL, index),
    usualWaitTime: pick(MOCK_WAIT_TIMES, index),
    backgroundNoise: pick(MOCK_NOISE, index),
    bestMatchTag: pick(MOCK_BEST_MATCH_TAGS, index),
  };
}

/**
 * Active filter labels derived from profile (for chips).
 */
export function getActiveFilterLabels(profile: ChildProfile | null): string[] {
  const labels: string[] = [];
  if (!profile) return labels;
  const sensory = profile.sensory;
  const routine = profile.routine;
  if (sensory?.noiseLevel !== undefined && sensory.noiseLevel >= 1) labels.push('Quiet');
  if (sensory?.lightingLevel !== undefined && sensory.lightingLevel >= 1) labels.push('Low lighting');
  if (routine?.seating?.length) {
    if (routine.seating.some((s) => /spacious|wide|space/i.test(s))) labels.push('Spacious seating');
  }
  labels.push('Cultural comfort');
  return labels;
}

/**
 * Score 0–100: how well the restaurant fits the profile (higher = better).
 */
export function scoreRestaurantForProfile(
  r: Omit<Restaurant, 'matchScore'>,
  profile: ChildProfile | null
): number {
  if (!profile) return 50;
  let score = 50;
  const sensory = profile.sensory;

  // Noise: prefer low background noise if sensitivity is med/high
  if (sensory?.noiseLevel !== undefined && sensory.noiseLevel >= 1) {
    if (r.backgroundNoise === 'low') score += 15;
    else if (r.backgroundNoise === 'moderate') score += 5;
    else score -= 10;
  }

  // Lighting: prefer soft if sensitivity is med/high
  if (sensory?.lightingLevel !== undefined && sensory.lightingLevel >= 1) {
    if (r.lighting === 'soft') score += 12;
    else if (r.lighting === 'moderate') score += 4;
    else score -= 8;
  }

  // Crowds: prefer low/moderate if triggers include Crowds
  const triggers = sensory?.triggerNames ?? [];
  if (triggers.some((t) => /crowd/i.test(t))) {
    if (r.currentCrowd === 'low') score += 10;
    else if (r.currentCrowd === 'moderate') score += 3;
    else score -= 8;
  }

  // Spacious seating from routine
  const seating = profile.routine?.seating ?? [];
  if (seating.some((s) => /spacious|wide|space/i.test(s))) {
    if (r.bestMatchTag.toLowerCase().includes('spacious')) score += 8;
  }

  return Math.max(0, Math.min(100, score));
}

/** Cache results for 15 minutes to avoid burning quota on every screen open. */
const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { key: string; at: number; data: Restaurant[] } | null = null;

function cacheKey(lat: number, lng: number, cuisines: string[], profileId: string | null): string {
  return [lat.toFixed(2), lng.toFixed(2), cuisines.slice().sort().join(','), profileId || ''].join('|');
}

/**
 * Fetch nearby restaurants via Gemini, then add mock data and score by profile.
 * Results are cached for 15 minutes so reopening the screen does not call the API again.
 */
export async function fetchNearbyRestaurants(options: {
  latitude: number;
  longitude: number;
  cityOrRegion?: string;
  cuisines: string[];
  profile: ChildProfile | null;
}): Promise<Restaurant[]> {
  const { latitude, longitude, cityOrRegion, cuisines, profile } = options;
  const key = cacheKey(latitude, longitude, cuisines, profile?.id ?? null);
  const now = Date.now();
  if (cache && cache.key === key && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  const prompt = buildRestaurantsPrompt({
    latitude,
    longitude,
    cityOrRegion,
    cuisines,
  });

  const { text } = await generateContent(prompt, {
    model: 'gemini-2.5-flash',
    maxOutputTokens: 2048,
    temperature: 0.3,
    systemInstruction:
      'You respond only with a valid JSON array. No markdown, no explanation. Only real restaurant names and real places that exist.',
  });

  const list = parseGeminiRestaurantsResponse(text);
  const withMock = list.map((r, i) => addMockRestaurantData(r, i));
  const scored = withMock.map((r) => ({
    ...r,
    matchScore: scoreRestaurantForProfile(r, profile),
  }));
  scored.sort((a, b) => b.matchScore - a.matchScore);
  cache = { key, at: Date.now(), data: scored };
  return scored;
}
