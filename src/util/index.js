// eslint-disable-next-line
const _ = require('ramda');
// eslint-disable-next-line
const util = require('util');

const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
const number = '0123456789'.split('');

const generateLetters = (length = 12) => {
  const first = alpha[Math.floor(Math.random() * alpha.length)];
  const all = [...alpha, ...number];
  const result = [first];
  let i = 1;
  while (i++ < length) {
    result.push(all[Math.floor(Math.random() * all.length)]);
  }
  return result.join('');
};

module.exports = {
  generateLetters
};
