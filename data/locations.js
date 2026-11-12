/**
 * Central Lagos location catalog. Add locations here to make them available to
 * both the public location search and the admin's grouped location selector.
 * `region: null` keeps broad/ambiguous entries selectable while flagging them
 * for review instead of assigning them to Island or Mainland by assumption.
 */
export const lagosLocations = [
  { name: 'Lagos', city: 'Lagos', country: 'Nigeria', region: null, needsReview: true },
  { name: 'Lekki', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Lekki Phase 1', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Ikate', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Ikota', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Chevron', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Osapa London', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Victoria Island', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Oniru', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Ikoyi', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Ajah', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Ologolo', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Banana Island', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Eko Atlantic', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Lekki Phase 2', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Sangotedo', city: 'Lagos', country: 'Nigeria', region: 'Island' },
  { name: 'Ikeja', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Ikeja GRA', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Alausa', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Yaba', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Surulere', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Gbagada', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Maryland', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Magodo', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Apapa', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Agege', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Ogba', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Anthony', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Ojodu', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Festac Town', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
  { name: 'Amuwo-Odofin', city: 'Lagos', country: 'Nigeria', region: 'Mainland' },
]

// Keep the public search API compatible while deriving it from the central catalog.
export const lagosLocationSuggestions = lagosLocations.map(({ name }) => name)
