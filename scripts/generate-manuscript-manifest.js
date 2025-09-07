#!/usr/bin/env node

/**
 * Script to generate manifest.json for manuscript directories
 * Usage: node scripts/generate-manuscript-manifest.js <collection-id>
 * Example: node scripts/generate-manuscript-manifest.js atharvashirsha
 */

const fs = require('fs')
const path = require('path')

const collectionId = process.argv[2]

if (!collectionId) {
  console.error('Usage: node generate-manuscript-manifest.js <collection-id>')
  console.error('Example: node generate-manuscript-manifest.js atharvashirsha')
  process.exit(1)
}

const manuscriptDir = path.join(__dirname, '..', 'public', 'manuscripts', collectionId)

if (!fs.existsSync(manuscriptDir)) {
  console.error(`Directory does not exist: ${manuscriptDir}`)
  process.exit(1)
}

// Read all files in the directory
const files = fs.readdirSync(manuscriptDir)

// Filter for image files (jpg, jpeg, png, gif, webp)
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase()
  return imageExtensions.includes(ext) && file !== 'manifest.json'
})

if (imageFiles.length === 0) {
  console.error(`No image files found in ${manuscriptDir}`)
  process.exit(1)
}

// Sort files naturally (handles numbers correctly)
imageFiles.sort((a, b) => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
})

// Generate manifest
const images = imageFiles.map((filename, index) => ({
  id: index + 1,
  filename: filename,
  url: `/manuscripts/${collectionId}/${filename}`,
  title: `Manuscript Page ${index + 1}`,
  description: `Original manuscript page ${index + 1} - ${filename}`
}))

const manifest = {
  collection: collectionId,
  title: `${collectionId.charAt(0).toUpperCase() + collectionId.slice(1)} Manuscript Images`,
  description: `Original manuscript pages for ${collectionId}`,
  images: images,
  generatedAt: new Date().toISOString()
}

// Write manifest.json
const manifestPath = path.join(manuscriptDir, 'manifest.json')
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

console.log(`✅ Generated manifest.json for ${collectionId}`)
console.log(`📁 Directory: ${manuscriptDir}`)
console.log(`🖼️  Found ${imageFiles.length} images:`)
imageFiles.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`)
})
console.log(`📄 Manifest saved to: ${manifestPath}`)
