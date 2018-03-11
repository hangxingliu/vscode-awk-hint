//@ts-check

let fs = require('fs'),
	path = require('path');
module.exports = { listFiles, loadFile };

/**
 * @param {string} dir
 * @param {(fileName: string) => boolean} filter
 * @returns {Promise<string[]>}
 */
function listFiles(dir, filter) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err)
				return reject(err);
			files = files.filter(fileName =>
				fs.statSync(path.join(dir, fileName)).isFile() && filter(fileName));
			return resolve(files);
		});
	});
}

/**
 * @param {string} dir
 * @param {string} fileName
 * @returns {Promise<string>}
 */
function loadFile(dir, fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(dir, fileName), { encoding: 'utf8' }, (err, content) => {
			if (err)
				return reject(err);
			return resolve(content);
		});
	});
}
