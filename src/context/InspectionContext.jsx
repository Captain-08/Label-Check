import { createContext, useContext, useMemo, useState } from 'react'
import { initialInspections } from '../data/mockInspections.js'
import { generateInspectionId } from '../lib/utils.js'

const InspectionContext = createContext(null)

export function InspectionProvider({ children }) {
  const [inspections, setInspections] = useState(initialInspections)

  const value = useMemo(
    () => ({
      inspections,
      getById: (id) => inspections.find((i) => i.id === id),
      addInspection: ({ product, category, imageUrl, inspector, analysis }) => {
        const id = generateInspectionId(inspections.length)
        const record = {
          id,
          product,
          category,
          date: new Date().toISOString(),
          inspector,
          score: analysis.score,
          status: analysis.status,
          image: imageUrl,
          analysis,
        }
        setInspections((prev) => [record, ...prev])
        return record
      },
    }),
    [inspections]
  )

  return <InspectionContext.Provider value={value}>{children}</InspectionContext.Provider>
}

export function useInspections() {
  const ctx = useContext(InspectionContext)
  if (!ctx) throw new Error('useInspections must be used within InspectionProvider')
  return ctx
}
