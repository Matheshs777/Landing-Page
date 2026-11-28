const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('public/fonts/bodoni-moda-latin-var.woff2');
const numTables = buf.readUInt16BE(12);
const totalCompressedSize = buf.readUInt32BE(20);
const tags = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill'];
let off = 48;
function base128() { let v = 0; for (let i=0;i<5;i++){ const b = buf[off++]; v = (v<<7) | (b & 0x7f); if (!(b & 0x80)) break; } return v; }
const entries = [];
for (let i=0;i<numTables;i++){
  const flags = buf[off++];
  let tagIdx = flags & 0x3f;
  const transform = (flags >> 6) & 3;
  let tag;
  if (tagIdx === 63) { tag = buf.toString('ascii', off, off+4); off += 4; }
  else tag = tags[tagIdx];
  const origLength = base128();
  let transformLength = origLength;
  if ((tag === 'glyf' || tag === 'loca') && transform !== 3) transformLength = base128();
  entries.push({tag, origLength, transformLength, transform});
}
console.log(entries.map(e=>`${e.tag}:${e.transformLength}`).join(', '));
const compressed = buf.subarray(off, off + totalCompressedSize);
const raw = zlib.brotliDecompressSync(compressed);
let pos = 0;
for (const e of entries) {
  const size = e.transformLength;
  if (e.tag === 'fvar') {
    const t = raw.subarray(pos, pos + size);
    const axisCount = t.readUInt16BE(8);
    const axisSize = t.readUInt16BE(10);
    console.log('fvar axisCount', axisCount, 'axisSize', axisSize);
    for (let i=0;i<axisCount;i++){
      const o = 16 + i*axisSize;
      const tag = t.toString('ascii', o, o+4);
      const min = t.readInt32BE(o+4)/65536, def = t.readInt32BE(o+8)/65536, max = t.readInt32BE(o+12)/65536;
      console.log(tag, min, def, max);
    }
  }
  pos += size;
}
console.log('decompressed', raw.length, 'consumed', pos, 'compressed', compressed.length);
