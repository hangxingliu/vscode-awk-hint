/// <reference path="./vscode.d.ts/vscode.d.ts" />
/// <reference path="./vscode.d.ts/vscode_namespace.d.ts" />

type AwkFunction = {
	name: string;
	parameters: string[],
	localVariables: string[];
	location: number;
};
