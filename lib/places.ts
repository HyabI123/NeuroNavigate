/**
 * Google Places API (Legacy) - fetch place photo for a restaurant by name + location.
 * Requires: Places API enabled in Google Cloud, EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in .env
 * Docs: https://developers.google.com/maps/documentation/places/web-service/search-find-place
 */

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';

function getApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY?.trim();
  if (!key && __DEV__) {
    console.warn(
      'Places API: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY not set in .env — restaurant photos will not load. Enable Places API and add the key.'
    );
  }
  return key || null;
}

/**
 * Get a photo URL for a place by name and approximate location.
 * Returns null if no key, no result, or no photo. Uses Places Find Place + first photo.
 */
export async function getPlacePhotoUrl(
  placeName: string,
  latitude: number,
  longitude: number
): Promise<string | null> {
  const key = getApiKey();
  if (!key) return null;

  const input = encodeURIComponent(placeName.trim());
  const locationBias = `circle:5000@${latitude},${longitude}`;
  const fields = 'place_id,photos';
  const findUrl = `${PLACES_BASE}/findplacefromtext/json?input=${input}&inputtype=textquery&fields=${fields}&locationbias=${encodeURIComponent(locationBias)}&key=${encodeURIComponent(key)}`;

  try {
    const findRes = await fetch(findUrl);
    const findData = (await findRes.json()) as {
      candidates?: Array<{ place_id?: string; photos?: Array<{ photo_reference?: string }> }>;
      status?: string;
    };
    if (findData.status !== 'OK' || !findData.candidates?.length) return null;
    const candidate = findData.candidates[0];
    let photoRef = candidate.photos?.[0]?.photo_reference;

    if (!photoRef && candidate.place_id) {
      const detailsUrl = `${PLACES_BASE}/details/json?place_id=${encodeURIComponent(candidate.place_id)}&fields=photos&key=${encodeURIComponent(key)}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = (await detailsRes.json()) as {
        result?: { photos?: Array<{ photo_reference?: string }> };
        status?: string;
      };
      const refFromDetails = detailsData.result?.photos?.[0]?.photo_reference;
      if (refFromDetails) photoRef = refFromDetails;
    }
    if (!photoRef) return null;

    const photoUrl = `${PLACES_BASE}/photo?maxwidth=400&photoreference=${encodeURIComponent(photoRef)}&key=${encodeURIComponent(key)}`;

    // Google returns 302 redirect to the actual image. React Native Image often doesn't
    // follow redirects, so resolve to the final URL first (GET so we get response.url after redirect).
    try {
      const imgRes = await fetch(photoUrl, { redirect: 'follow' });
      const finalUrl = imgRes.url && imgRes.url !== photoUrl ? imgRes.url : photoUrl;
      return finalUrl;
    } catch {
      return photoUrl;
    }
  } catch {
    return null;
  }
}
