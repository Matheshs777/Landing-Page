const fs = require('fs');
const buf = fs.readFileSync('public/fonts/bodoni-moda-latin-var.woff2');
if (buf.toString('ascii', 0, 4) !== 'wOF2') { console.log('not woff2'); process.exit(1); }
const numTables = buf.readUInt16BE(12);
console.log('numTables', numTables);
const tags = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill'];
let off = 48;
function base128() { let v = 0; for (let i=0;i<5;i++){ const b = buf[off++]; v = (v<<7) | (b & 0x7f); if (!(b & 0x80)) break; } return v; }
const found = [];
for (let i=0;i<numTables;i++){
  const flags = buf[off++];
  const tagIdx = flags & 0x3f;
  const transform = (flags >> 6) & 3;
  base128(); // origLength
  if ((tagIdx === 10 || tagIdx === 11 || tagIdx === 12 || tagIdx === 13) && transform !== 3) base128();
  else if (transform !== 0) base128();
  found.push({tag: tags[tagIdx] || tagIdx, transform});
}
console.log(found.map(f=>f.tag).join(', '));
console.log('fvar present:', found.some(f=>f.tag==='fvar'));
