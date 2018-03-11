//@ts-check
/// <reference path="./index.d.ts" />

let fs = require('fs');
let vscode = require('vscode');

const HINT_FILE = `${__dirname}/../hint-data/string.json`;

module.exports = { createHintStringManager };

function createHintStringManager() {
	let data = { escapeSequenceStyle: {} };

	/** @type {vscode.CompletionItem[]} */
	let completionItems = [];

	return {
		load,
		get: () => completionItems,
	};

	function load() {
		data = loadJSON(HINT_FILE, data);
		completionItems = Object.keys(data.escapeSequenceStyle).map(str => {
			let item = new vscode.CompletionItem(
				'033[' + str + ' (' + data.escapeSequenceStyle[str] + ')',
				vscode.CompletionItemKind.Color);

			item.filterText = '033[' + str;
			item.insertText = '033[' + str;
			item.detail = "Output Style Escape Sequence";
			item.documentation = data.escapeSequenceStyle[str];
			return item;
		});
	}
}

/**
 * @template T
 * @param {string} filePath
 * @param {T} defaultValue
 * @returns {T}
 */
function loadJSON(filePath, defaultValue) {
	try {
		let json = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(json);
	} catch (ex) {
		console.error(ex);
		return defaultValue;
	}
}
