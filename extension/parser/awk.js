//@ts-check
/// <reference path="../index.d.ts" />

const InputType = {
	Unknown: 0,
	KeywordOrIdentifier: 1,
	Number: 2,
	String: 3,
	Regex: 4,
	Comment: 10,
};

const Keywords = [
	'continue', 'nextfile', 'function', 'getline',
	'delete', 'printf', 'BEGIN', 'while', 'break', 'print',
	'else', 'next', 'exit', 'func', 'END', 'for', 'if', 'do', 'in'
];

const KeywordMap = {};
Keywords.forEach(k => KeywordMap[k] = true);

module.exports = { createAwkParser, InputType, Keywords };

/** @param {string} code */
function createAwkParser(code) {
	let codeLength = code.length;
	return { listAllFunctions, getInputType };

	function listAllFunctions() {
		/** @type {AwkFunction[]} */
		let functions = [];

		for (let i = 0; i < codeLength; i++) {
			let ch = code[i];//, charCode = ch.charCodeAt(0);
			switch (ch) {
				case '\\': i++; break;
				case ' ': case '\t': case '\n': case '\r': case '\f': case '\v': break;
				case '#': i = findEndLine(i + 1); break;
				case '{': i = findCloseBrace(i + 1); break;
				case '"': i = findCloseQuote(i + 1); break;
				case 'f': // 'function'.length => 8
					if (code.slice(i, i + 8) == "function") {
						let end = findNextOpenBrace(i + 8);
						if (end >= codeLength) { // invalid
							i = codeLength;
							break;
						} else {
							let func = extractFunctionFrom(i, end);
							if (func)
								functions.push(func);
							i = end - 1; // -1 for '{'
						}
					}
					break;
			} // end of switch statement
		} // end of for statement

		return functions;
	}

	/** @returns {AwkFunction} */
	function extractFunctionFrom(startLocation, endLocation) {
		let def = code.slice(startLocation, endLocation)
			.replace(/#.+/g, ''); // remove comments
		let matched = def.match(/^function\s+(\w+)\s*\(([\w\s,]*)\)\s*$/);
		if (!matched) return;

		let part = matched[2].split(/(?:,|^)\s{3,}/);
		let parameters = (part[0] || '').split(/\s*,\s*/).filter(v => v),
			localVariables = (part.slice(1).join('') || '').split(/\s*,\s*/).filter(v => v);

		return { name: matched[1], parameters, localVariables, location: startLocation };
	}


	/** @param {number} cursorLocation */
	function getInputType(cursorLocation) {
		let lastNotEmptyCharCode = 0;
		let isLastNotEmptyCharKeyword = false;

		cursorLocation = Math.min(codeLength, cursorLocation);
		for (let i = 0; i < cursorLocation; i++) {
			let ch = code[i], charCode = ch.charCodeAt(0);
			let j = i + 1; // j is a nest loop variable;

			switch (ch) {
				case ' ': case '\t': case '\n': case '\r': case '\f': case '\v':
					break; // blank character

				case '\\': // \ at the end of line means this line included the next line
					if (j >= cursorLocation)
						return InputType.Unknown;
					i++;
					break;

				case '#': // comment
					i = findEndLine(i + 1);
					if (i >= cursorLocation)
						return InputType.Comment;
					break;

				case '/':
					// 1. it is a regex if last word is keyword
					// 2. it is a division operation if last word is a identifier
					if (!isLastNotEmptyCharKeyword && isIdentifierCharCode(lastNotEmptyCharCode))
						break; // just divsion operation

					// regex
					i = findCloseRegexSlash(i + 1);
					if (i >= cursorLocation)
						return InputType.Regex;

					lastNotEmptyCharCode = charCode; // '/'
					isLastNotEmptyCharKeyword = false;
					break;

				case '\"':
					i = findCloseQuote(i + 1);
					if (i >= cursorLocation)
						return InputType.String;

					lastNotEmptyCharCode = charCode; // '"'
					isLastNotEmptyCharKeyword = false;
					break;


				case '.':
				case '0': case '1': case '2': case '3': case '4':
				case '5': case '6': case '7': case '8': case '9':
					// number
					if (j == cursorLocation) // this character is the last one
						return InputType.Number;

					lastNotEmptyCharCode = charCode;
					isLastNotEmptyCharKeyword = false;
					break;

				default:
					lastNotEmptyCharCode = charCode;

					let cursorWord = ch;
					for (; j < cursorLocation; j++) {
						let charCode = code.charCodeAt(j);
						if (isIdentifierCharCode(charCode))
							cursorWord += code.charAt(j);
						else
							break;
					}
					if (j == cursorLocation)
						return InputType.KeywordOrIdentifier;

					i = j - 1;
					isLastNotEmptyCharKeyword = cursorWord in KeywordMap;
					break;
			} // end of switch statement

		} // end of for statement

		return InputType.KeywordOrIdentifier;
	}


	// =======================================
	//     Iterate helper functions
	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	function findCloseBrace(startLocation) {
		let level = 1;
		let j = startLocation;
		for (; j < codeLength; j++) {
			let ch = code[j];
			switch (ch) {
				case '\\': j++; break;
				case '#': j = findEndLine(j + 1); break;
				case '"': j = findCloseQuote(j + 1); break;
				case '{': level++; break;
				case '}':
					if (--level <= 0)
						return j;
					break;
				// case '/':
				// doesn't need this statement in here, because } in regex need write like this: "\}"
			}
		}
		return j;
	}
	function findNextOpenBrace(startLocation) {
		let brace = code.indexOf('{', startLocation);
		return brace < 0 ? codeLength : brace;
	}

	function findEndLine(startLocation) {
		let endl = code.indexOf('\n', startLocation);
		return endl < 0 ? codeLength : endl;
	}
	function findCloseQuote(startLocation) {
		let j = startLocation;
		for (; j < codeLength; j++) {
			if (code[j] == '\\') j++;
			else if (code[j] == '\"') break;
		}
		return j;
	}
	function findCloseRegexSlash(startLocation) {
		let j = startLocation;
		for (; j < codeLength; j++) {
			if (code[j] == '\\') j++;
			else if (code[j] == '/') break;
		}
		return j;
	}

	/** @param {number} charCode */
	function isIdentifierCharCode(charCode) {
		// 0-9 48-57
		// A-Z 65-90
		// _ 96
		// a-z 97-122
		if (charCode < 48 || charCode > 122) return false;
		if (charCode >= 65 && charCode <= 90) return true;
		if (charCode >= 96 && charCode <= 122) return true;
		if (charCode > 57) return false; // it is not a number
		return true;
	}
}
