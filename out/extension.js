"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const main_1 = require("../../context-extractor/dist/main");
const types_1 = require("../../context-extractor/dist/types");
const sidePanelProviders_1 = require("./sidePanelProviders");
function activate(context) {
    let lastCompletionText = null;
    console.log("creating credentials file");
    const configPath = path.join(vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : '', 'credentials.json');
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
    // Instantiate side panel providers
    const holeTypeProvider = new sidePanelProviders_1.HoleTypeProvider();
    const relevantTypesProvider = new sidePanelProviders_1.RelevantTypesProvider();
    const relevantHeadersProvider = new sidePanelProviders_1.RelevantHeadersProvider();
    // Register the providers with VS Code
    vscode.window.registerTreeDataProvider('holeTypeView', holeTypeProvider);
    vscode.window.registerTreeDataProvider('relevantTypesView', relevantTypesProvider);
    vscode.window.registerTreeDataProvider('relevantHeadersView', relevantHeadersProvider);
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
        const workspaceFolder = vscode.workspace.workspaceFolders
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : '';
        const credentialsPath = path.join(workspaceFolder, 'credentials.json');
        const sketchPath = editor.document.uri.fsPath;
        // Determine language based on file extension
        let language;
        const fileExtension = path.extname(sketchPath).toLowerCase();
        if (fileExtension === '.ts' || fileExtension === '.tsx') {
            language = types_1.Language.TypeScript;
        }
        else if (fileExtension === '.ml' || fileExtension === '.mli') {
            language = types_1.Language.OCaml;
        }
        else {
            vscode.window.showErrorMessage("Unsupported file type.");
            return;
        }
        // Show loading indicator
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Fetching Completion",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Loading..." });
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            try {
                // Call extractWithNew only once
                const result = await (0, main_1.extractWithNew)(language, sketchPath, credentialsPath);
                if (result) {
                    // Update the side panel providers with context data
                    if (result.context) {
                        holeTypeProvider.updateData(result.context.hole);
                    }
                    else {
                        throw new Error("Context is null.");
                    }
                    const relevantTypesArray = Array.from(result.context.relevantTypes.entries())
                        .map(([sourceFile, types]) => `${sourceFile}: ${types}`);
                    const relevantHeadersArray = Array.from(result.context.relevantHeaders.entries())
                        .map(([sourceFile, headers]) => `${sourceFile}: ${headers}`);
                    relevantTypesProvider.updateData(relevantTypesArray);
                    relevantHeadersProvider.updateData(relevantHeadersArray);
                    // Set the completion for inline suggestion
                    lastCompletionText = result.completion;
                    // Trigger inline suggestion
                    await vscode.commands.executeCommand('editor.action.inlineSuggest.trigger');
                }
                else {
                    throw new Error("No completion available.");
                }
            }
            catch (error) {
                console.error("Error fetching completion:", error);
                vscode.window.showErrorMessage("Error fetching completion from OpenAI API.");
            }
        });
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
    context.subscriptions.push(updateApiKeyCommand, fetchCompletionCommand, provider);
}
async function getCompletion(text, apiKey, apiBase, deployment, gptModel, apiVersion, temperature) {
    console.log("Calling OpenAI API..."); // Debugging: Check if API call is triggered
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
            const result = await (0, main_1.extractWithNew)(types_1.Language.TypeScript, // for TypeScript
            sketchPath, credentialsPath);
            if (result && result.completion) {
                return result.completion; // return completion text
            }
            else {
                throw new Error("No completion available.");
            }
        }
        catch (error) {
            console.error("Error fetching data from extractWithNew API:", error);
            throw error;
        }
    }
    throw new Error("No active editor found.");
}
function deactivate() { }
//# sourceMappingURL=extension.js.map