//@ts-check

let { loadFile } = require('../utils/Io');
let { Assert } = require('../utils/Assert');

describe('hint data', () => {
	it('# functions.json', () =>
		loadFile(__dirname, `../../hint-data/functions.json`)
			.then(json => Assert(json).parseJSON().isArray()
				.each(it => Assert(it).containsKeys('set', 'name', 'usage', 'desc'))));

	it('# variables.json', () =>
		loadFile(__dirname, `../../hint-data/variables.json`)
			.then(json => Assert(json).parseJSON().isArray()
				.each(it => Assert(it).containsKeys('set', 'name', 'onlyGAWK', 'desc'))));

	it('# snippets.json', () =>
		loadFile(__dirname, `../../hint-data/snippets.json`)
			.then(json => Assert(json).parseJSON().isObject()
				.each(it => Assert(it).containsKeys('prefix', 'body'))));

});
