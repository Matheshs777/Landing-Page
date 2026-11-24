import fs from 'node:fs'

const file = 'src/config/vehicles.js'
let source = fs.readFileSync(file, 'utf8')

const swaps = [
  ['heroCamera: { position: [6.4, 2.15, 6.4], target: [0, 0.55, 0] }', 'heroCamera: { position: [6.2, 1.4, 5.4], target: [0, 0.52, 0] }'],
  ['camera: { position: [7.2, 1.45, 0.12], target: [0, 0.55, 0] }', 'camera: { position: [4.6, 1.3, 0.1], target: [0, 0.52, 0] }'],
  ['camera: { position: [-7.0, 1.5, 0.15], target: [0, 0.55, 0] }', 'camera: { position: [-4.6, 1.3, 0.12], target: [0, 0.52, 0] }'],
  ['camera: { position: [5.6, 1.75, 5.4], target: [0, 0.55, 0] }', 'camera: { position: [4.9, 1.6, 4.8], target: [0, 0.52, 0] }'],
  ['camera: { position: [0.5, 2.3, 3.0], target: [0, 0.85, 0] }', 'camera: { position: [1.4, 2.15, 2.5], target: [0.3, 0.92, 0.15] }'],
  ['camera: { position: [0.2, 1.5, 8.0], target: [0, 0.55, 0] }', 'camera: { position: [0.2, 1.4, 7.0], target: [0, 0.52, 0] }'],
  ['heroCamera: { position: [2.8, 1.25, 3.1], target: [0, 0.55, 0] }', 'heroCamera: { position: [2.2, 1.15, 2.4], target: [0, 0.55, 0] }'],
  ['camera: { position: [0, 1.1, 3.5], target: [0, 0.6, 0] }', 'camera: { position: [0, 1.05, 2.3], target: [0, 0.58, 0] }'],
  ['camera: { position: [2.8, 1.25, 3.1], target: [0, 0.55, 0] }', 'camera: { position: [2.2, 1.15, 2.4], target: [0, 0.55, 0] }'],
  ['camera: { position: [3.7, 0.98, 0.05], target: [0, 0.54, 0] }', 'camera: { position: [3.0, 0.95, 0.05], target: [0, 0.54, 0] }'],
  ['camera: { position: [0, 1.1, -3.5], target: [0, 0.55, 0] }', 'camera: { position: [0, 1.05, -2.3], target: [0, 0.55, 0] }'],
  ['camera: { position: [0.9, 1.05, 2.5], target: [0, 0.75, 0.62] }', 'camera: { position: [1.5, 1.05, 2.6], target: [0, 0.62, 0.5] }'],
  ['camera: { position: [0.9, 1.9, 1.4], target: [0, 0.82, 0.15] }', 'camera: { position: [1.1, 1.7, 1.8], target: [0, 0.78, 0.15] }'],
  ['camera: { position: [4.0, 1.0, 0.1], target: [0, 0.54, 0] }', 'camera: { position: [3.2, 0.95, 0.1], target: [0, 0.54, 0] }'],
  ['camera: { position: [2.6, 1.5, 3.2], target: [0, 0.56, 0] }', 'camera: { position: [2.1, 1.25, 2.6], target: [0, 0.56, 0] }'],
]

for (const [from, to] of swaps) {
  if (!source.includes(from)) console.log('MISS', from)
  source = source.split(from).join(to)
}

fs.writeFileSync(file, source)
console.log('patched')
