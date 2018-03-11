//@ts-check
/// <reference path="./index.d.ts" />

let fs = require('fs');
let vscode = require('vscode');

const HINT_FILE_FUNC = `${__dirname}/../hint-data/functions.json`;
const HINT_FILE_VAR = `${__dirname}/../hint-data/variables.json`;

module.exports = { createHintDataManager };

function createHintDataManager() {
	/** @type {FunctionHintData[]} */
	let builtInFunctions = [];

	/** @type {VariableHintData[]} */
	let builtInVariables = [];

	return {
		loadBuiltIn,
		getAllCompletionItems,
		searchCompletionItemsByPrefix,
		getFunction, getVariable
	};

	function loadBuiltIn() {
		builtInFunctions = loadJSON(HINT_FILE_FUNC, []).map(it => {
			let matched = String(it.usage).match(/\((.*)\)/);;
			let parameters = matched ? matched[1] : '';
			return {
				name: it.name, parameters, isBuiltIn: true, location: 0,
				file: it.set, desc: it.usage + '\n\n' + it.desc
			};
		});

		builtInVariables = loadJSON(HINT_FILE_VAR, []).map(it => ({
			name: it.name, isBuiltIn: true, desc: it.desc,
			onlyGAwk: it.onlyGAWK
		}));
	}

	function getAllCompletionItems() {
		return generateCompletionItems(builtInFunctions, builtInVariables);
	}

	/** @param {string} prefix */
	function searchCompletionItemsByPrefix(prefix) {
		return generateCompletionItems(
			builtInFunctions.filter(it => it.name.startsWith(prefix)),
			builtInVariables.filter(it => it.name.startsWith(prefix)));
	}

	/** @param {string} funcName */
	function getFunction(funcName) {
		for (let func of builtInFunctions)
			if (func.name == funcName)
				return func;
		return null;
	}

	/** @param {string} varName */
	function getVariable(varName) {
		for (let vari of builtInVariables)
			if (vari.name == varName)
				return vari;
		return null;
	}

	/**
	 *
	 * @param {FunctionHintData[]} functions
	 * @param {VariableHintData[]} variables
	 * @returns {vscode.CompletionItem[]}
	 */
	function generateCompletionItems(functions, variables) {
		return functions.map(func => {
			let item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
			item.documentation = func.desc;
			item.detail = func.file;
			return item;
		}).concat(variables.map(vari => {
			let item = new vscode.CompletionItem(vari.name, vscode.CompletionItemKind.Variable);
			item.documentation = vari.desc;
			item.detail = vari.onlyGAwk ? '(GAwk) ' : '';
			return item;
		}));
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
