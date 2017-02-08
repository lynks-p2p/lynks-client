const zlib = require('zlib');

//const gzip = zlib.createGzip();
const fs = require('fs');
//const inp = fs.createReadStream('marketing.pdf');
//const out = fs.createWriteStream('marketing.pdf.gz');

//inp.pipe(gzip).pipe(out);

const gunzip = zlib.createGunzip();

const inp2 = fs.createReadStream('marketing.pdf.gz');
const out2 = fs.createWriteStream('marketing2.pdf');

inp2.pipe(gunzip).pipe(out2);
