//@ts-check

let { listFiles, loadFile } = require('../utils/Io');
let { createAwkParser, InputType } = require('../../extension/parser/awk')
let { Assert } = require('../utils/Assert');


listFiles(__dirname, name => !!name.match(/^test-(.+).awk$/))
	.then(files => Promise.all(files.map(loadTestFile)))
	.then(tests => {
		describe('get input type', () => tests.forEach(testFile =>
			describe(`${testFile.file}`, () => {
				let parser = createAwkParser(testFile.awk);
				testFile.test.forEach(({ cursor, expected }) => {
					it(`# "${expected}" is a valid input type`, () =>
						Assert(InputType[expected]).isNumber());

					it(`# cursor: ${cursor} type: "${expected}"`, () =>
						Assert(parser.getInputType(cursor)).equals(InputType[expected]));

				});
			})));
		run();// run mocha async

	}).catch(err => process.nextTick(() => {
		describe('load all test files', () => it('# exception', () => { throw err; }));
		run(); //run mocha async

	}));


/** @param {string} file */
function loadTestFile(file) {
	return loadFile(__dirname, file)
		.then(content => {
			let awk = '';

			/** @type {{ cursor: number, expected: string }[]} */
			let test = [];

			/** @type {RegExpMatchArray} */
			let matched = null;

			while ((matched = content.match(/\{\{\s+(\w+)\s+\}\}/)) != null) {
				awk += content.slice(0, matched.index);
				content = content.slice(matched.index + matched[0].length);
				test.push({ cursor: awk.length, expected: matched[1] });
			}
			awk += content;
			return Promise.resolve({ file, awk, test });
		});
}
