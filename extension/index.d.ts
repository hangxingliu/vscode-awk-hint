/// <reference path="./vscode.d.ts/vscode.d.ts" />
/// <reference path="./vscode.d.ts/vscode_namespace.d.ts" />

type AwkFunction = {
	name: string;
	parameters: string[],
	localVariables: string[];
	location: number;
};

type FunctionHintData = {
	name: string;
	parameters: string;
	isBuiltIn: boolean;
	file: string;
	location: number;
	desc: string;
};

type VariableHintData = {
	name: string;
	isBuiltIn: boolean;
	desc: string;
	onlyGAwk: boolean;
};

type RegexpHintData = {
	escapeSequence: { [name: string]: string };
	escapeSequenceGAwk: { [name: string]: string };
	bracketExpression: { [name: string]: string };
};
