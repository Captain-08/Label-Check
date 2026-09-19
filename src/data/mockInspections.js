import { buildSeededResult } from './mockAnalysisTemplates.js'

const seeds = [
  { id: 'INS-2026-0136', product: 'Sunrise Refined Sunflower Oil 1L', category: 'Edible Oil', date: '2026-08-27T10:15:00', inspector: 'A. Sharma', profile: 0, score: 94 },
  { id: 'INS-2026-0137', product: 'Golden Crisp Glucose Biscuits 200g', category: 'Packaged Food', date: '2026-08-27T11:40:00', inspector: 'A. Sharma', profile: 1, score: 76 },
  { id: 'INS-2026-0138', product: 'Himalaya Fresh Bottled Water 1L', category: 'Bottled Water', date: '2026-08-26T09:05:00', inspector: 'R. Verma', profile: 0, score: 91 },
  { id: 'INS-2026-0139', product: 'Meadow Care Herbal Toothpaste 100g', category: 'Cosmetics', date: '2026-08-26T14:22:00', inspector: 'R. Verma', profile: 2, score: 52 },
  { id: 'INS-2026-0140', product: 'Farmland Basmati Rice 5kg', category: 'Packaged Food', date: '2026-08-25T16:10:00', inspector: 'P. Nair', profile: 0, score: 89 },
  { id: 'INS-2026-0141', product: 'Spice Route Garam Masala 100g', category: 'Packaged Food', date: '2026-08-25T12:48:00', inspector: 'P. Nair', profile: 1, score: 71 },
  { id: 'INS-2026-0142', product: 'Bright Wash Detergent Powder 1kg', category: 'Household', date: '2026-08-24T15:33:00', inspector: 'A. Sharma', profile: 2, score: 45 },
  { id: 'INS-2026-0143', product: 'Chai Bagaan Assam Tea 250g', category: 'Packaged Food', date: '2026-08-24T09:58:00', inspector: 'R. Verma', profile: 0, score: 96 },
  { id: 'INS-2026-0144', product: 'Namkeen House Aloo Bhujia 150g', category: 'Packaged Food', date: '2026-08-23T13:02:00', inspector: 'P. Nair', profile: 1, score: 68 },
  { id: 'INS-2026-0145', product: 'Pure Glow Bathing Soap 125g', category: 'Cosmetics', date: '2026-08-22T10:47:00', inspector: 'A. Sharma', profile: 0, score: 87 },
]

export const initialInspections = seeds.map((seed) => {
  const analysis = buildSeededResult(seed.id, seed.product, seed.category, seed.score, seed.profile)
  return {
    id: seed.id,
    product: seed.product,
    category: seed.category,
    date: seed.date,
    inspector: seed.inspector,
    score: seed.score,
    status: analysis.status,
    image: null,
    analysis,
  }
})
