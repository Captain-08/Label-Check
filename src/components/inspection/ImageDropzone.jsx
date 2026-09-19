import { useCallback, useRef, useState } from 'react'
import { UploadCloud, ImageOff, RefreshCcw, Camera, Image } from 'lucide-react'
import ScanFrame from '../ui/ScanFrame.jsx'
import { cn } from '../../lib/utils.js'

export default function ImageDropzone({ file, previewUrl, onFileSelected, onClear }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const inputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      const selected = fileList?.[0]
      if (!selected) return

      if (!selected.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG or WEBP).')
        return
      }

      setError('')
      onFileSelected(selected)
    },
    [onFileSelected]
  )

  if (previewUrl) {
    return (
      <div className="rounded-md border border-line bg-panel p-4">
        <ScanFrame
          color="#8A6D3B"
          className="mx-auto block w-full max-w-sm overflow-hidden rounded-sm"
        >
          <img
            src={previewUrl}
            alt="Uploaded product preview"
            className="max-h-96 w-full rounded-sm object-contain"
          />
        </ScanFrame>

        <div className="mt-4 flex items-center justify-between">
          <p className="truncate text-sm text-steel">{file?.name}</p>

          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-steel hover:border-ink-300 hover:text-ink-700"
          >
            <RefreshCcw size={13} />
            Replace image
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        'flex flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-16 text-center transition-colors',
        isDragging
          ? 'border-brass bg-brass-light/40'
          : 'border-line bg-panel'
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-700">
        <UploadCloud size={22} strokeWidth={1.8} />
      </span>

      <p className="mt-4 text-sm font-medium text-ink-700">
        Drag and drop a package image here
      </p>

      <p className="mt-1 text-xs text-steel">or</p>

      {/* Action buttons */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {/* Take Photo */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-md bg-ink-700 px-4 py-2 text-sm font-medium text-white hover:bg-ink-600"
        >
          <Camera size={16} />
          Take Photo
        </button>

        {/* Choose Image */}
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-300"
        >
          <Image size={16} />
          Choose Image
        </button>
      </div>

      {/* Camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* File picker input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <p className="mt-4 text-xs text-steel">
        Supports JPG, PNG or WEBP. For best results, photograph the pack flat
        with all label faces legible.
      </p>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-violation">
          <ImageOff size={13} />
          {error}
        </p>
      )}
    </div>
  )
}