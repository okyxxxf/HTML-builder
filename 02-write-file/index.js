const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;
const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdout.write('Hello, enter your text in console!\n');

stdin.on('data', (chunk) => {
  if(chunk.toString().trim() == 'exit'){
    process.exit();
  }
  else{
    output.write(chunk.toString());
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write('Process is over. Good luck');
});