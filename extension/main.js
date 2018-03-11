//@ts-check
/// <reference path="./index.d.ts" />

let vscode = require('vscode'),
	{ createHintDataManager } = require('./hint-data-manager'),
	{ createAwkParser, InputType } = require('./parser/awk');

const DOCUMENT_SELECTOR = ['awk'];

const HOVER_INFO_FUNCTION = '**AWK Function**';
const HOVER_INFO_VARIABLE = '**AWK Variable**';
const HOVER_INFO_VARIABLE_GAWK = '**AWK Variable** (**GAWK**)';

let manager = createHintDataManager();

function getTextBeforeCursor(document, position) {
    var start = new vscode.Position(position.line, 0);
    var range = new vscode.Range(start, position);
    return document.getText(range);
}

function getTextAroundCursor(document, position) {
	let lineText = document.lineAt(position).text,
		pos = position.character;
	let beforeText = lineText.slice(0, pos),
		afterText = lineText.slice(pos);
	beforeText = (beforeText.match(/\w*$/) || [''] )[0];
	afterText = (afterText.match(/^\w*/) || [''] )[0];
	return beforeText + afterText;
}

function activate(context) {
	let subscriptions = context.subscriptions;
	manager.loadBuiltIn();
	subscriptions.push(
		vscode.languages.registerCompletionItemProvider(DOCUMENT_SELECTOR, {
			provideCompletionItems: (document, position/*, token*/) => {
				let parser = createAwkParser(document.getText());
				let inputType = parser.getInputType(document.offsetAt(position));
				if (inputType != InputType.KeywordOrIdentifier)
					return null;

				let beforeText = getTextBeforeCursor(document, position);
				let keyword = (beforeText.match(/^.*?\b(\w*)$/) || ['', ''])[1];
				if (!keyword)
					return manager.getAllCompletionItems();
				return manager.searchCompletionItemsByPrefix(keyword);
			},
			resolveCompletionItem: (item/*, token*/) => item
		}
	));

	subscriptions.push(
		vscode.languages.registerHoverProvider(DOCUMENT_SELECTOR, {
			provideHover: (document, position/*, token*/) => {
				let parser = createAwkParser(document.getText());
				let inputType = parser.getInputType(document.offsetAt(position));
				if (inputType != InputType.KeywordOrIdentifier)
					return null;

				let textAround = getTextAroundCursor(document, position);
				if (!textAround)
					return null;

				let item = manager.getFunction(textAround) || manager.getVariable(textAround);
				if (!item)
					return null;

				if ('parameters' in item)//Function
					return new vscode.Hover([
						HOVER_INFO_FUNCTION, `*${item.desc}*`, item.desc
					]);
				//Variable
				return new vscode.Hover([
					item.onlyGAwk ? HOVER_INFO_VARIABLE_GAWK : HOVER_INFO_VARIABLE, item.desc
				]);
			}
		}));

	subscriptions.push(
		vscode.languages.registerSignatureHelpProvider(DOCUMENT_SELECTOR, {
			provideSignatureHelp: (document, position/*, token*/) => {
				let parser = createAwkParser(document.getText());
				let inputType = parser.getInputType(document.offsetAt(position));
				if (inputType != InputType.KeywordOrIdentifier)
					return null;

				let beforeText = getTextBeforeCursor(document, position);

				//end of the function
				if (beforeText.match(/[);]$/))
					return null;

				if (beforeText.indexOf('(') == -1)
					return null;

				let matched = beforeText.match(/.*\b(\w+)\((.*?)$/);
				if (!matched)
					return null;

				let item = manager.getFunction(matched[1]);
				if (!item)
					return null;

				let res = new vscode.SignatureHelp();
				res.activeSignature = 0;
				res.signatures = [new vscode.SignatureInformation(`${item.name}(${item.parameters})`, item.desc)];
				return res;
			}
		}, '(,'));

}

function deactivate() {

}

exports.activate = activate;
exports.deactivate = deactivate;
