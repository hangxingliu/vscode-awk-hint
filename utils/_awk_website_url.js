let base = 'https://www.gnu.org/software/gawk/manual/html_node';

module.exports = {
	base,
	builtInFunctionsIndex: ` ${base}/Built_002din.html`,
	builtInFunctions: {
		number: `${base}/Numeric-Functions.html`,
		string: `${base}/String-Functions.html`,
		io: `${base}/I_002fO-Functions.html`,
		time: `${base}/Time-Functions.html`,
		bitwise: `${base}/Bitwise-Functions.html`,
		type: `${base}/Type-Functions.html`,
		i18n: `${base}/I18N-Functions.html`
	},
	builtInVariablesIndex: `${base}/Built_002din-Variables.html`,
	builtInVariables: {
		"user-modified": `${base}/User_002dmodified.html`,
		"auto-set": `${base}/Auto_002dset.html`
	}
};