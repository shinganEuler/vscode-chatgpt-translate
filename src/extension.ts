import * as vscode from 'vscode';
const OpenAITranslate = require("openai-translate");

function get_select_text() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return "";
	}

	let selection = editor.selection;
	return editor.document.getText(selection);
}

async function getOpenAIResponse(
	OPENAI_API_KEY: string,
	message: string,
	openai_url: string,
	model: string,
	target_langualge: string
): Promise<string> {
	try {
		return await OpenAITranslate.translateWithOpenAI(OPENAI_API_KEY, message, openai_url, model, target_langualge);
	} catch (error: any) {
		vscode.window.showErrorMessage(`ChatGPT translate Error: ${error.message}`);
		throw new Error(`ChatGPT translate Error: ${error.message}`);
	}
}

async function getAzureOpenAIResponse(
	AZURE_KEY: string,
	message: string,
	azure_openai_url: string,
	target_langualge: string
): Promise<string> {
	try {
		return await OpenAITranslate.translateWithAzureOpenAI(AZURE_KEY, message, azure_openai_url, target_langualge);
	} catch (error: any) {
		vscode.window.showErrorMessage(`ChatGPT translate Error: ${error.message}`);
		throw new Error(`ChatGPT translate Error: ${error.message}`);
	}
}

async function translate_select(replace: boolean) {
	const apikey = vscode.workspace.getConfiguration().get("chatgpt-translate.chatgpt-api-key");
	const model = vscode.workspace.getConfiguration().get("chatgpt-translate.openai-model");
	const openai_url = vscode.workspace.getConfiguration().get("chatgpt-translate.openai-full-url");

	const azure_apikey = vscode.workspace.getConfiguration().get("chatgpt-translate.azure-key");
	const azure_url = vscode.workspace.getConfiguration().get("chatgpt-translate.azure-openai-full-url");

	const api_platform = vscode.workspace.getConfiguration().get("chatgpt-translate.api-platform");
	const target_langualge = vscode.workspace.getConfiguration().get("chatgpt-translate.target-language");
	const text = get_select_text();

	console.log("translate: " + text);

	let translation = "";
	
	switch (api_platform) {
		case "openai":
			translation = await (await getOpenAIResponse(apikey as string, text, openai_url as string, model as string, target_langualge as string)).trim();
			break;
		case "azure-openai":
			translation = await (await getAzureOpenAIResponse(azure_apikey as string, text, azure_url as string, target_langualge as string)).trim();
			break;
		default:
			vscode.window.showErrorMessage(`ChatGPT translate Error: Unknown API platform: ${api_platform}`);
			throw new Error(`Unknown API platform: ${api_platform}`);
			break;
	}

	if (replace) {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let selection = editor.selection;
		editor.edit(editBuilder => {
			editBuilder.replace(selection, translation);
		});
	} else {
		// insert translation to the end of selection text, and keep the selection as original text
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		var insertTranslation = "\n\n" + translation;
		let selection = editor.selection;
		editor.edit(editBuilder => {
			editBuilder.insert(selection.end, insertTranslation);
		});

		editor.selection = new vscode.Selection(selection.start, selection.end);
	}
}

export function activate(context: vscode.ExtensionContext) {
	let translateToNewlineDisposable = vscode.commands.registerCommand('chatgpt-translate.translate-to-newline', () => {
		translate_select(false);
	});

	let translateAndReplaceDisposable = vscode.commands.registerCommand('chatgpt-translate.translate-and-replace', () => {
		translate_select(true);
	});

	context.subscriptions.push(translateToNewlineDisposable);	
	context.subscriptions.push(translateAndReplaceDisposable);
}

export function deactivate() { }
function fetch(url: string, arg1: { method: string; headers: { "Content-Type": string; Authorization: string; }; body: string; }) {
	throw new Error('Function not implemented.');
}

