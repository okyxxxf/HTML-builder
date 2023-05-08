const fs = require('fs');
const path = require('path');
const reader = fs.promises.readFile(path.resolve(__dirname, 'template.html'));

const readComponent = (component) => {
  return fs.promises.readFile(path.resolve(__dirname, 'components', `${component}.html`));
};

const writeStream = () => {
  return fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
};

const createFolder = () => {
  return fs.promises.mkdir(path.resolve(__dirname, 'project-dist'), {recursive : true});
};

const buildHtml = () => {
  let html = '';
  let pattern = /{{[a-zA-Z]*}}/gi;
  reader
    .then((data) => {
      html = data.toString();
    })
    .then(() => {
      for(let i = 0; i < html.match(pattern).length; i++){
        let part = html.match(pattern)[i];
        readComponent(part.slice(2, part.length -2)).then((data) => {
          html = html.replace(part, data.toString());
        }).then(()=> {
          writeStream().write(html);
        });
      }
    });
};

const mergeStyles = () => {
  const styleList = [];
  const writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));
  const reader = fs.promises.readdir(path.resolve(__dirname, 'styles'));

  reader.then((styles) => {
    for(let style of styles){
      if(style.slice(style.length - 4, style.length) === '.css'){
        fs.promises.readFile(path.resolve(__dirname, 'styles', style)).then((data, err) => {
          if (err) throw new Error(err);
          styleList.push(data.toString());
        }).then(() => {
          for(let style of styleList){
            writeStream.write(style);
          }
        });
      }
    }
  });
};

const copyAssetsFolder = () => {
  const reader = fs.promises.readdir(path.resolve(__dirname, 'assets'));

  const readFolder = (src, dest) => {
    fs.promises.mkdir(dest, {recursive: true}).then(() => {
      fs.promises.readdir(src, {withFileTypes: true})
        .then((files) => {
          files.forEach((file) => {
            if(file.isFile()){
              fs.copyFile(path.resolve(src, file.name), path.resolve(dest, file.name), (err) => {
                if (err) throw new Error(err);
              });
            }
            else{
              readFolder(path.resolve(src, file.name), path.resolve(dest, file.name));
            }
          });
        });
    });
  };

  const clearFolder = (folder) => {
    return fs.promises.readdir(folder, {withFileTypes: true}).then((files) => {
      files.forEach((file) => {
        if(file.isDirectory()){
          clearFolder(path.resolve(folder, file.name));
        }
        else{
          fs.unlink(path.resolve(folder, file.name), (err) => {
            if (err) throw new Error(err);
          });
        }
      });
    });
  };

  reader.then(() => {
    fs.promises.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), {recursive: true})
      .then(() => {
        clearFolder(path.resolve(__dirname, 'project-dist', 'assets'))
          .then(() => {
            readFolder(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist', 'assets'));
          });
      });
  });
};

createFolder()
  .then(buildHtml())
  .then(mergeStyles())
  .then(copyAssetsFolder());