import PlaceholderLabel from '../ui/PlaceholderLabel.jsx'

const TONE_COLOR = {
  detected: '#1F7A5C',
  review: '#A97319',
  missing: '#A8342A',
}

/**
 * Renders the product image (or a schematic placeholder) with simulated
 * bounding boxes for each detected declaration overlaid at fixed
 * percentage coordinates. Coordinates are illustrative — a real
 * implementation would come from the OCR/detection stage.
 */
export default function BoundingBoxOverlay({ imageUrl, productName, boxes }) {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-sm border border-line bg-white">
      {imageUrl ? (
        <img src={imageUrl} alt={productName} className="block w-full object-contain" />
      ) : (
        <PlaceholderLabel productName={productName} className="block w-full" />
      )}
      {boxes.map((box) => (
        <div
          key={box.id}
          className="absolute rounded-[2px] border-2"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.w}%`,
            height: `${box.h}%`,
            borderColor: TONE_COLOR[box.status],
          }}
        >
          <span
            className="absolute -top-5 left-0 whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-medium text-white"
            style={{ background: TONE_COLOR[box.status] }}
          >
            {box.label}
          </span>
        </div>
      ))}
    </div>
  )
}
