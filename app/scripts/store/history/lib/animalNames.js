import adjective from './adjective.js';
import animal from './animal.js';

function groupByFirstLetter(wordCollection) {
  return wordCollection.reduce((result, word) => {
    const firstLetter = word.charAt(0);
    if (!(firstLetter in result)) {
      result[firstLetter] = [];
    }
    result[firstLetter].push(word);
    return result;
  }, {});
}

function capitalizeFirstLetter(string) {
  return string.charAt(0)
    .toUpperCase() + string.slice(1);
}

function pickRandomly(wordCollection) {
  return wordCollection[Math.floor(Math.random() * wordCollection.length)];
}

function findCommonLetters(lettersA, lettersB) {
  return lettersA.reduce((result, letter) => {
    if (lettersB.indexOf(letter) > -1) {
      result.push(letter);
    }
    return result;
  }, []);
}

const animals = groupByFirstLetter(animal);
const adjectives = groupByFirstLetter(adjective);

const possibleLetters = findCommonLetters(
  Object.keys(adjectives),
  Object.keys(animals),
);

function findRandomAdjective(letter) {
  return pickRandomly(adjectives[letter]);
}

function findRandomAnimalName(letter) {
  return pickRandomly(animals[letter])
    .split(' ')
    .join('-');
}

function generateRandomAnimalName() {
  const letter = pickRandomly(possibleLetters);
  const adjective = findRandomAdjective(letter);
  const animal = findRandomAnimalName(letter);
  return `${capitalizeFirstLetter(adjective)} ${animal}`;
}


export {generateRandomAnimalName};
