const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));
const reader = fs.promises.readdir(path.resolve(__dirname, 'styles'));

reader.then((styles) => {
  fs.promises.readdir(path.resolve(__dirname, 'project-dist'))
    .then((files) => {
      if(files === 'bundle.css'){
        fs.unlink(path.resolve(__dirname, 'project-dist', 'bundle.css'));
      }
    }).then(() => {
      for(let style of styles){
        if(style.slice(style.length - 4, style.length) === '.css'){
          fs.promises.readFile(path.resolve(__dirname, 'styles', style)).then((data, err) => {
            if (err) throw new Error(err);
            writeStream.write(data.toString());
          });
        }
      }
    });
});
