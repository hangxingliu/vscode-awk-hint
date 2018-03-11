//@ts-check

let { listFiles, loadFile } = require('../utils/Io');
let { createAwkParser } = require('../../extension/parser/awk')
let { Assert } = require('../utils/Assert');


listFiles(__dirname, name => !!name.match(/^test-(.+).awk$/))
	.then(files => Promise.all(files.map(loadFileAndExpected)))
	.then(infos => {

		describe('list all functions', () => infos.forEach(info =>
			describe(`${info.file}`, () => {
				let parser = createAwkParser(info.content);
				let functions = Assert(parser.listAllFunctions());//.print();

				it('# isArray', () => functions.isArray());

				info.expected.forEach((expected, i) =>
					it(`# function ${expected.name}`, () =>
						functions.child(String(i)).isObject().fieldsEqual(expected[i])));

				it(`# its length is ${info.expected.length}`, () =>
					functions.length(info.expected.length));
			})));
		run();// run mocha async

	}).catch(err => process.nextTick(() => {
		describe('load all test files', () => it('# exception', () => { throw err; }));
		run(); //run mocha async
	}));

/**
 * @param {string} file
 * @returns {Promise<{file: string; content: string; expected: any[]}>}
 */
function loadFileAndExpected(file) {
	return Promise.all([
		loadFile(__dirname, file),
		loadFile(__dirname, file.replace(/.awk$/, '.json')),
	]).then(contents => Promise.resolve({
		file, content: contents[0],
		expected: JSON.parse(contents[1])
	}));

}
