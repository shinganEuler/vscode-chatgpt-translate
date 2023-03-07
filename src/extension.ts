import * as vscode from 'vscode';
import * as https from 'https';

function get_select_text() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return "";
	}

	let selection = editor.selection;
	return editor.document.getText(selection);
}

interface OpenAIResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: OpenAIResponseChoice[];
	usage: OpenAIResponseUsage;
}

interface OpenAIResponseChoice {
	index: number;
	finish_reason: string;
	message: OpenAIResponseMessage;
}

interface OpenAIResponseMessage {
	role: string;
	content: string;
}

interface OpenAIResponseUsage {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
}

async function getOpenAIResponse2(
	OPENAI_API_KEY: string,
	message: string,
	model: string
): Promise<string> {
	const data = {
		model: model,
		messages: [{ role: 'user', content: message }]
	};

	const options: https.RequestOptions = {
		hostname: 'api.openai.com',
		path: '/v1/chat/completions',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		}
	};

	const response: OpenAIResponse = await new Promise((resolve, reject) => {
		const req = https.request(options, (res:any) => {
			let body = '';
			res.on('data', (chunk: any) => {
				body += chunk;
			});
			res.on('end', () => {
				const response = JSON.parse(body) as OpenAIResponse;
				resolve(response);
			});
		});
		req.on('error', (error: any) => {
			reject(error);
		});
		req.write(JSON.stringify(data));
		req.end();
	});

	return response.choices[0].message.content;
}

async function getOpenAIResponse(
	OPENAI_API_KEY: string,
	message: string,
	model: string
): Promise<string> {
	const data = {
		model: model,
		messages: [{ role: 'user', content: message }]
	};

	const options: https.RequestOptions = {
		hostname: 'api.openai.com',
		path: '/v1/chat/completions',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		}
	};

	try {
		const response: OpenAIResponse = await new Promise((resolve, reject) => {
			const req = https.request(options, (res: any) => {
				let body = '';
				res.on('data', (chunk: any) => {
					body += chunk;
				});
				res.on('end', () => {
					try {
						const response = JSON.parse(body) as OpenAIResponse;
						resolve(response);
					} catch (error:any) {
						vscode.window.showErrorMessage(`ChatGPT translate Error: ${error.message}`);
						reject(new Error(`Failed to parse response: ${error.message}`));
					}
				});
			});
			req.on('error', (error: any) => {
				vscode.window.showErrorMessage(`ChatGPT translate Error: ${error.message}`);
				reject(new Error(`Request failed: ${error.message}`));
			});
			req.write(JSON.stringify(data));
			req.end();
		});

		if (response.choices.length === 0) {
			vscode.window.showErrorMessage(`ChatGPT translate Error: No response choices found`);
			throw new Error('No response choices found');
		}

		const content = response.choices[0].message.content;

		if (content.trim() === '') {
			vscode.window.showErrorMessage(`ChatGPT translate Error: Response content is empty`);
			throw new Error('Response content is empty');
		}

		return content;
	} catch (error:any) {
		vscode.window.showErrorMessage(`ChatGPT translate Error: ${error.message}`);
		throw new Error(`Failed to get OpenAI response: ${error.message}`);
	}
}

async function translate_select(replace: boolean) {
	const apikey = vscode.workspace.getConfiguration().get("chatgpt-translate.chatgpt-api-key");

	const text = get_select_text();

	const target = vscode.workspace.getConfiguration().get("chatgpt-translate.target-language");

	console.log("translate: " + text);

	const prompt = "translate " + target + ". " + text;

	const translation = await (await getOpenAIResponse(apikey as string, prompt, "gpt-3.5-turbo")).trim();

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

