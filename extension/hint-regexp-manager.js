//@ts-check
/// <reference path="./index.d.ts" />

let fs = require('fs');
let vscode = require('vscode');

const HINT_FILE = `${__dirname}/../hint-data/regexp.json`;

module.exports = { createHintRegexpManager };

function createHintRegexpManager() {
	/** @type {RegexpHintData} */
	let data = {
		escapeSequence: {},
		escapeSequenceGAwk: {},
		bracketExpression: {}
	};

	/** @type {vscode.CompletionItem[]} */
	let escapeCompletionItems = [];

	/** @type {vscode.CompletionItem[]} */
	let bracketExpressionCompletionItems = [];

	return {
		load,
		getEscapeCompletionItems: () => escapeCompletionItems,
		getBracketExpressionCompletionItems: () => bracketExpressionCompletionItems
	};

	function load() {
		data = loadJSON(HINT_FILE, data);
		escapeCompletionItems = Object.keys(data.escapeSequence).map(ch => {
			let item = new vscode.CompletionItem(ch, vscode.CompletionItemKind.Value);
			item.detail = "Escape Sequence";
			item.documentation = data.escapeSequence[ch];
			return item;
		}).concat(Object.keys(data.escapeSequenceGAwk).map(ch => {
			let item = new vscode.CompletionItem(ch, vscode.CompletionItemKind.Value);
			item.detail = "Escape Sequence **GAwk only**";
			item.documentation = data.escapeSequenceGAwk[ch];
			return item;
		}));

		bracketExpressionCompletionItems = Object.keys(data.bracketExpression).map(exp => {
			let item = new vscode.CompletionItem(exp + ':', vscode.CompletionItemKind.Value);
			item.detail = "Bracket Expression";
			item.documentation = data.bracketExpression[exp];
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
