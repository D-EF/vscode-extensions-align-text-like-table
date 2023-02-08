
const vscode = require('vscode');
const { create_AlignFnc } = require('./js/create_vsc_act');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	var align__def=create_AlignFnc(),
		align__ex_special_symbols=create_AlignFnc([[/^(?!:[+-\[\{}]])([^+-])/,' $1']]);
	let disposable__def = vscode.commands.registerCommand('align-text-like-table.align', align__def),
		disposable__ex_special_symbols=vscode.commands.registerCommand('align-text-like-table.align_ex_special_symbols', align__ex_special_symbols);
		
	context.subscriptions.push(disposable__def,disposable__ex_special_symbols);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
