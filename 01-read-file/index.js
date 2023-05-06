const fs = require('fs');
const path = require('path');
const { stdout } = process;
const readableStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

readableStream.on('data', (text) => stdout.write(text.toString()));