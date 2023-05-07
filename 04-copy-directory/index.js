const fs = require('fs');
const path = require('path');

fs.promises.mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true});

const readerCopy = fs.promises.readdir(path.resolve(__dirname, 'files-copy'));
const readerFiles = fs.promises.readdir(path.resolve(__dirname, 'files'));

readerCopy.then((files) => {
  for(let file of files){
    fs.unlink(path.resolve(__dirname, 'files-copy', file), (err) => {
      if (err) throw new Error(err);
    });
  }
});

readerFiles.then((files) => {
  for(let file of files){
    fs.copyFile(path.resolve(__dirname, 'files', file), path.resolve(__dirname, 'files-copy', file), (err) => {
      if (err) throw new Error(err);
    });
  }
});