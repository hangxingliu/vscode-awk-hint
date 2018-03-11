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

File description:

- `utils/*.js` scripts for getting hint data from gnu awk document web page
- `extension/main.js` extension main script files
- `icon/icon.svg` extension icon image source svg file
- `hint_data/*.json` hint data json file generated automatically(But `snippets.json` written by me)

[Pull Request](pr)

## Author

[LiuYue(hangxingliu)](https://github.com/hangxingliu)

[gnu-awk-doc]: https://www.gnu.org/software/gawk/manual/gawk.html
[doc-script]: https://github.com/hangxingliu/vscode-awk-hint/tree/master/utils
[ext-awk]: https://marketplace.visualstudio.com/items?itemName=luggage66.awk
[issues]: https://github.com/hangxingliu/vscode-awk-hint/issues
[pr]: https://github.com/hangxingliu/vscode-awk-hint/pulls
