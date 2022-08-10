const express = require('express');
const router = express.Router();
const { createFile, getFiles, getFile, deleteFile, putFile, deleteNothing } = require('./filesService.js');

router.post('/', createFile);

router.get('/', getFiles);

router.get('/:filename', getFile);

router.delete('/:filename', deleteFile);

router.put('/', putFile);

router.delete('/', deleteNothing)

module.exports = {
  filesRouter: router
};
