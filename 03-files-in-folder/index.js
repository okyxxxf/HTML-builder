const fs = require('fs');
const path = require('path');
const { stdout } = process;

const reader = fs.promises.readdir(path.resolve(__dirname, 'secret-folder'));

reader.then((files)=>{
  for(let file of files){
    fs.stat(path.resolve(__dirname, 'secret-folder', file), (error, stats) =>{
      if (error) throw new Error(error);
      if(stats.isFile() == true){
        let fileNames = file.split('.');
        stdout.write(`${fileNames[0]} - ${fileNames[1]} - ${stats.size * 0.000977}kb\n`);
      }
    });
  }
});