import fs from 'node:fs'
for (const file of ['public/models/car/supercar.glb','public/models/bike/superbike.glb']) {
  const buf = fs.readFileSync(file)
  const jsonLen = buf.readUInt32LE(12)
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'))
  console.log('\n=== ' + file + ' ===')
  console.log('generator', json.asset.generator, 'extensions', json.extensionsUsed)
  console.log('materials', json.materials?.map(m => ({ name: m.name, base: m.pbrMetallicRoughness?.baseColorFactor, metal: m.pbrMetallicRoughness?.metallicFactor, rough: m.pbrMetallicRoughness?.roughnessFactor, tex: !!m.pbrMetallicRoughness?.baseColorTexture })))
  console.log('meshes', json.meshes?.length, 'prims', json.meshes?.reduce((a,m)=>a+m.primitives.length,0))
  console.log('nodes', json.nodes?.length, json.nodes?.map(n=>n.name).filter(Boolean).slice(0,120))
  console.log('images', json.images?.length, json.images?.map(i=>i.mimeType))
  console.log('animations', json.animations?.map(a=>a.name))
  console.log('accessor count', json.accessors?.length, 'buffer bytes', json.buffers?.[0]?.byteLength)
}
