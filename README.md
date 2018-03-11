# AWK hint(auto-completion) for VS Code

[![Build Status](https://travis-ci.org/hangxingliu/vscode-awk-hint.svg?branch=master)](https://travis-ci.org/hangxingliu/vscode-awk-hint)

An **experimental** extension.   
And the hint data generated from [The GNU Awk User’s Guide][gnu-awk-doc] by [scripts][doc-script]    
You can report bug or send a feature suggestion in [Github Issues Page][issues].

## Installation

1. Click `Extension` button in left side of VSCode. (Shortcut: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>)
2. Search `vscode-awk-hint`. Found this extension and click `Install` button.
3. Reload VSCode.

## Hint Support

1. awk function hint
2. awk built-in variable hint
3. awk statement snippets

## Declaration

1. This extension depend extension [`luggage66.AWK` developed by Donald Mull Jr][ext-awk] (**It will be install automaticallly by VS Code**)
2. Open source license of this extension is [GPL-3.0](LICENSE)

## Contributing to the Extension

### 1. Supporting me coffee via Paypal

[Supporting me coffee](paypal) could encourage me to make my vscode extensions better and better!
(and add more and more features).

### 2. Submit issue on Github

Found a bug, feature request or question. You can submit issue on [Github Issue Page][issues];

### 3. Cook by yourself

0. prepare node.js environment
1. fork this repo on Github, then clone it to local
2. execute `npm install --save-dev`
3. modify/fix it
4. please remember `npm test` for unit tets
5. give a [pull request][pr]

Project structure:

- `extension`: extension codes
	- `main.js`: entry file of extension
	- `parser/awk.js`: awk semantic parser
	- `vscode.d.ts` & `index.d.ts`: typing files for auto-completion
- `hint-data`: hint data json file generated automatically(But `snippets.json` is written by me)
- `icon`: png and svg icon images for this extension
- `test`: unit tests
- `utils`: utilities (scripts for fetch awk hint data)

## License

[GPL-3.0](LICENSE)

## Author

[LiuYue(hangxingliu)](https://github.com/hangxingliu)

[gnu-awk-doc]: https://www.gnu.org/software/gawk/manual/gawk.html
[doc-script]: https://github.com/hangxingliu/vscode-awk-hint/tree/master/utils
[ext-awk]: https://marketplace.visualstudio.com/items?itemName=luggage66.awk
[issues]: https://github.com/hangxingliu/vscode-awk-hint/issues
[pr]: https://github.com/hangxingliu/vscode-awk-hint/pulls
[paypal]: https://www.paypal.me/hangxingliu
