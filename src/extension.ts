import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { extractWithNew } from '../../context-extractor/dist/main';
import { Language } from '../../context-extractor/dist/types';


export function activate(context: vscode.ExtensionContext) {
	let lastCompletionText: string | null = null;

	console.log("creating credentials file");

	const configPath = path.join(
		vscode.workspace.workspaceFolders
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: '',
		'credentials.json'
	);

	console.log("created credentials file");

	if (!fs.existsSync(configPath)) {
		const defaultConfig = {
			apiBase: "https://hazel2.openai.azure.com",
			deployment: "hazel-gpt-4",
			gptModel: "azure-gpt-4",
			apiVersion: "2023-05-15",
			apiKey: '',
			temperature: 0.6
		};
		fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
		vscode.window.showInformationMessage('Created OpenAI config file in the workspace.');
	}

	// register command for updating OpenAIKey
	let updateApiKeyCommand = vscode.commands.registerCommand('extension.updateOpenAIKey', async () => {
		const newApiKey = await vscode.window.showInputBox({ prompt: 'Enter your new OpenAI API key' });

		if (newApiKey) {
			let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			config.apiKey = newApiKey;
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
			vscode.window.showInformationMessage('OpenAI API key updated in config file.');
		}
	});

	// Inline Completion Provider
	// let provider = vscode.languages.registerInlineCompletionItemProvider('*', {
	// 	async provideInlineCompletionItems(document, position, context, token) {
	// 		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	// 		const { apiKey, apiBase, deployment, gptModel, apiVersion, temperature } = config;

	// 		console.log("API Key:", apiKey);  // Debugging: Check if the key is being read

	// 		if (!apiKey) {
	// 			vscode.window.showErrorMessage("Please provide your OpenAI API key in the config file.");
	// 			return;
	// 		}

	// 		try {
	// 			// call extractWithNew API get completion
	// 			const completionText = await getCompletion(document.getText(), apiKey, apiBase, deployment, gptModel, apiVersion, temperature);
	// 			console.log("Completion Text:", completionText);  // Debugging: Check if completion is fetched

	// 			const completionItem = new vscode.InlineCompletionItem(completionText);
	// 			completionItem.range = new vscode.Range(position, position);
	// 			return [completionItem];
	// 		} catch (error) {
	// 			console.error("Error fetching completion:", error);  // Debugging: Check for API errors
	// 			vscode.window.showErrorMessage("Error fetching completion from OpenAI API.");
	// 			return;
	// 		}
	// 	}
	// });

	// context.subscriptions.push(updateApiKeyCommand, provider);




	// context.subscriptions.push(updateApiKeyCommand, fetchCompletionCommand);
	let fetchCompletionCommand = vscode.commands.registerCommand('extension.fetchCompletion', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active editor found.");
			return;
		}

		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		const { apiKey, apiBase, deployment, gptModel, apiVersion, temperature } = config;

		if (!apiKey) {
			vscode.window.showErrorMessage("Please provide your OpenAI API key in the config file.");
			return;
		}

		try {
			// fetch completion text
			const completionText = await getCompletion(editor.document.getText(), apiKey, apiBase, deployment, gptModel, apiVersion, temperature);
			console.log("Completion Text:", completionText);


			lastCompletionText = completionText;

			// execute inline suggestions
			await vscode.commands.executeCommand('editor.action.inlineSuggest.trigger');
		} catch (error) {
			console.error("Error fetching completion:", error);
			vscode.window.showErrorMessage("Error fetching completion from OpenAI API.");
		}
	});

	// InlineCompletionItemProvider to show completion
	let provider = vscode.languages.registerInlineCompletionItemProvider('*', {
		provideInlineCompletionItems(document, position, context, token) {
			if (!lastCompletionText) {
				return [];
			}

			const completionItem = new vscode.InlineCompletionItem(lastCompletionText);
			completionItem.range = new vscode.Range(position, position);

			// clear out the last completion
			lastCompletionText = null;

			return [completionItem];
		}
	});

	context.subscriptions.push(fetchCompletionCommand, provider);
}


async function getCompletion(text: string, apiKey: string, apiBase: string, deployment: string, gptModel: string, apiVersion: string, temperature: number): Promise<string> {
	console.log("Calling OpenAI API...");  // Debugging: Check if API call is triggered

	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const sketchPath = document.uri.fsPath;

		const workspaceFolder = vscode.workspace.workspaceFolders
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: '';
		const credentialsPath = path.join(workspaceFolder, 'credentials.json');

		try {
			// call extractWithNew API to fetch completion and other data
			const result = await extractWithNew(
				Language.TypeScript,  // for TypeScript
				sketchPath,
				credentialsPath
			);


			if (result && result.completion) {
				return result.completion;  // return completion text
			} else {
				throw new Error("No completion available.");
			}
		} catch (error) {
			console.error("Error fetching data from extractWithNew API:", error);
			throw error;
		}
	}
	throw new Error("No active editor found.");
}

export function deactivate() { }
