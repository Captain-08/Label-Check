/**
 * A generic schematic label drawing, standing in for a real product photo
 * in seeded demo records. Deliberately diagrammatic rather than a stock
 * photo, so it reads as "reference layout" rather than a real product.
 */
export default function PlaceholderLabel({ productName = 'Packaged Product', className }) {
  return (
    <svg viewBox="0 0 320 400" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Schematic label for ${productName}`}>
      <rect x="0" y="0" width="320" height="400" fill="#F8F8F6" />
      <rect x="10" y="10" width="300" height="380" fill="none" stroke="#DBDFE1" strokeWidth="1.5" />
      <rect x="28" y="34" width="264" height="46" fill="#EEF0F5" />
      <text x="160" y="62" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fill="#5B6472" letterSpacing="1">
        PRODUCT NAME
      </text>
      <line x1="28" y1="104" x2="292" y2="104" stroke="#DBDFE1" strokeWidth="1" />
      <line x1="28" y1="122" x2="240" y2="122" stroke="#DBDFE1" strokeWidth="1" />
      <line x1="28" y1="138" x2="200" y2="138" stroke="#DBDFE1" strokeWidth="1" />
      <rect x="28" y="168" width="264" height="60" fill="none" stroke="#DBDFE1" strokeDasharray="4 3" />
      <text x="160" y="202" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#8590AC">
        CONSUMER CARE / DECLARATIONS
      </text>
      <rect x="28" y="248" width="130" height="52" fill="none" stroke="#DBDFE1" strokeDasharray="4 3" />
      <text x="93" y="278" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8590AC">
        NET QTY
      </text>
      <rect x="166" y="248" width="126" height="52" fill="none" stroke="#DBDFE1" strokeDasharray="4 3" />
      <text x="229" y="278" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8590AC">
        MRP
      </text>
      <rect x="28" y="316" width="264" height="54" fill="none" stroke="#DBDFE1" strokeDasharray="4 3" />
      <text x="160" y="347" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8590AC">
        MANUFACTURER / PACKER DETAILS
      </text>
    </svg>
  )
}
