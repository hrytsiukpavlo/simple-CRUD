const express = require('express');
const router = express.Router();
const { createFile, getFiles, getFile, deleteFile, putFile } = require('./filesService.js');

router.post('/', createFile);

router.get('/', getFiles);

router.get('/:filename', getFile);

router.delete('/:filename', deleteFile);

router.put('/', putFile);

module.exports = {
  filesRouter: router
};
