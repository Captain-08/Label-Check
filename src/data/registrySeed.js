/**
 * Seeds a couple of demo registered products the first time the app runs
 * in a browser, purely so the Verify Product page has something real to
 * test against out of the box. Safe to call on every load — it only writes
 * once (guarded by a flag key) and never overwrites products a user has
 * since registered or removed.
 */
import { getProducts, registerProduct } from '../lib/productRegistryService.js'
const SEED_FLAG_KEY = 'labelcheck.registry.seeded.v1'

export function seedRegistryIfEmpty() {
  try {
    if (localStorage.getItem(SEED_FLAG_KEY)) return
  } catch {
    return
  }

  if (getProducts().length === 0) {
    registerProduct({
      companyName: 'XYZ Manufacturing Company',
      companyEmail: 'quality@xyzmfg.example',
      productName: 'Creatine Monohydrate',
      category: 'Nutraceutical',
      serialPrefix: 'XYZ-CR',
    })
    registerProduct({
      companyName: 'Sunrise Foods Pvt Ltd',
      companyEmail: 'compliance@sunrisefoods.example',
      productName: 'Sunrise Refined Sunflower Oil 1L',
      category: 'Edible Oil',
      serialPrefix: 'SUN-OIL',
    })
  }

  try {
    localStorage.setItem(SEED_FLAG_KEY, '1')
  } catch {
    // ignore — worst case we try seeding again next load
  }
}
