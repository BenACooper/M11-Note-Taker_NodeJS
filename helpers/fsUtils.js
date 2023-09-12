const fs = require("fs");
const util = require("util");

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile); // Encountered issues with .then, need to make writeToFile async.
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
// const writeToFile = (destination, content) =>
//   fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
//     err ? console.error(err) : console.info(`\nData written to ${destination}`)
//   );
const writeToFile = (destination, content) => {
  return writeFileAsync(destination, JSON.stringify(content, null, 4))
    .then(() => {
      console.info(`\nData written to ${destination}`);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const deleteFromFile = (destination, content) => {
  return writeFileAsync(destination, JSON.stringify(content, null, 4))
    .then(() => {
      console.info(`\nData deleted from ${destination}`);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 */
const readAndAppend = (content, file) => {
  return readFromFile(file)
    .then((data) => {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      return writeToFile(file, parsedData);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
/**
 * Function to delete an item by ID from a JSON file.
 * @param {string} file - The path to the file you want to delete from
 * @param {string} itemId - The ID of the object to delete
 * @returns {Promise} A promise that resolves when the operation is complete.
 */
const readAndDelete = (file, itemId) => {
  return readFromFile(file)
    .then((data) => JSON.parse(data))
    .then((items) => {
      const updatedItems = items.filter((item) => item.id !== itemId);
      return deleteFromFile(file, updatedItems).then(() => itemId);
    });
};

module.exports = { readFromFile, writeToFile, readAndAppend, readAndDelete };
