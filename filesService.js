const fs = require('fs');
const path = require('path');


function createFile(req, res, next) {
  if (!req.body.content || !req.body.filename) {
    res.status(400).send({ "message": "Please specify 'content' or 'filename' parameter" })
  } else {
    const checkPath = `files/${req.body.filename}`;
    if (fs.existsSync(checkPath)) {
      console.log('File already exists');
      res.status(200).send({
        "message": "File already exists"
      })
    } else {
      let name = req.body.filename;
      let re = /(?:\.([^.]+))?$/;
      let ext = re.exec(name)[1];

      if (ext === 'txt' || ext === 'log' || ext === 'json' || ext === 'yaml' || ext === 'xml' || ext === 'js') {
        const filePath = path.join(__dirname, 'files', req.body.filename);
        fs.writeFile(filePath, req.body.content, (err) => {
          if (err) {
            throw err;
          }
          console.log('File created')
        })
        res.status(200).send({ "message": "File created successfully" });
      } else {
        res.status(400).send({ "message": "File should be one of the following extensions: .log, .txt, .json, .yaml, .xml, .js" })
      }
    }

  }

}

function getFiles(req, res, next) {
  const directoryPath = path.join(__dirname, 'files');
  let files = [];
  fs.readdir(directoryPath, function (err, data) {
    if (err) {
      res.status(400).send({
        "message": "Client error"
      })
      return console.log('Unable to scan directory: ' + err);
    }
    data.map(el => files.push(el))
    res.status(200).send({
      "message": "Success",
      files: files
    });
  });

}

const getFile = (req, res, next) => {
  let cont = '';
  try {
    const data = fs.readFileSync(`files/${req.params.filename}`, 'utf8');
    cont = data;
  } catch (err) {
    console.error(err);
    res.status(400).send({
      "message": `No file with '${req.params.filename}' filename found`
    });
  }
  const extension = path.extname(req.params.filename).substr(1);
  const birthTime = fs.statSync(`files/${req.params.filename}`)
  res.status(200).send({
    "message": "Success",
    "filename": req.params.filename,
    "content": cont,
    "extension": extension,
    "uploadedDate": birthTime.birthtime
  });
}

function deleteFile(req, res, next) {
  if (fs.existsSync(`files/${req.params.filename}`)) {
    fs.unlink(`files/${req.params.filename}`, function (err) {
      if (err) {
        throw err;
      }
    });
    console.log('File deleted!');
    res.status(200).send({
      "message": `File ${req.params.filename} successfully deleted`
    })
  } else {
    res.status(400).send({
      "message": `No such file`
    })
  }

}

function putFile(req, res, next) {
  const checkPath = `files/${req.body.filename}`;
  if (!fs.existsSync(checkPath)) {
    console.log('File does not exist');
    res.status(400).send({
      "message": "File does not exist"
    })
  } else {
    const filePath = path.join(__dirname, 'files', req.body.filename);
    fs.writeFile(filePath, req.body.content, (err) => {
      if (err) {
        throw err;
      }
      console.log('File updated')
    })
    res.status(200).send({
      "message": "File successfully modified"
    })
  }
}

function deleteNothing(req, res, next) {
  res.status(400).send({
    "message": "You should specify a filename in the request if you want to delete a file"
  })
}

module.exports = {
  createFile,
  getFiles,
  getFile,
  deleteFile,
  putFile,
  deleteNothing
}
