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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptDriver = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const openai_1 = __importDefault(require("openai"));
const child_process_1 = require("child_process");
const types_1 = require("./types");
const typescript_type_checker_1 = require("./typescript-type-checker");
const utils_1 = require("./utils");
class TypeScriptDriver {
    typeChecker = new typescript_type_checker_1.TypeScriptTypeChecker();
    config = {
        model: types_1.Model.GPT4,
        apiBase: "",
        deployment: "",
        gptModel: "",
        apiVersion: "",
        apiKey: "",
        temperature: 0.6
    };
    async init(lspClient, sketchPath, credentialsPath) {
        const capabilities = {
            'textDocument': {
                'codeAction': { 'dynamicRegistration': true },
                'codeLens': { 'dynamicRegistration': true },
                'colorProvider': { 'dynamicRegistration': true },
                'completion': {
                    'completionItem': {
                        'commitCharactersSupport': true,
                        'documentationFormat': ['markdown', 'plaintext'],
                        'snippetSupport': true
                    },
                    'completionItemKind': {
                        'valueSet': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
                    },
                    'contextSupport': true,
                    'dynamicRegistration': true
                },
                'definition': { 'dynamicRegistration': true },
                'documentHighlight': { 'dynamicRegistration': true },
                'documentLink': { 'dynamicRegistration': true },
                'documentSymbol': {
                    'dynamicRegistration': true,
                    'symbolKind': {
                        'valueSet': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
                    }
                },
                'formatting': { 'dynamicRegistration': true },
                'hover': {
                    'contentFormat': ['markdown', 'plaintext'],
                    'dynamicRegistration': true
                },
                'implementation': { 'dynamicRegistration': true },
                // 'inlayhint': { 'dynamicRegistration': true },
                'onTypeFormatting': { 'dynamicRegistration': true },
                'publishDiagnostics': { 'relatedInformation': true },
                'rangeFormatting': { 'dynamicRegistration': true },
                'references': { 'dynamicRegistration': true },
                'rename': { 'dynamicRegistration': true },
                'signatureHelp': {
                    'dynamicRegistration': true,
                    'signatureInformation': { 'documentationFormat': ['markdown', 'plaintext'] }
                },
                'synchronization': {
                    'didSave': true,
                    'dynamicRegistration': true,
                    'willSave': true,
                    'willSaveWaitUntil': true
                },
                'typeDefinition': { 'dynamicRegistration': true, 'linkSupport': true },
                // 'typeHierarchy': { 'dynamicRegistration': true }
            },
            'workspace': {
                'applyEdit': true,
                'configuration': true,
                'didChangeConfiguration': { 'dynamicRegistration': true },
                'didChangeWatchedFiles': { 'dynamicRegistration': true },
                'executeCommand': { 'dynamicRegistration': true },
                'symbol': {
                    'dynamicRegistration': true,
                    'symbolKind': {
                        'valueSet': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
                    }
                }, 'workspaceEdit': { 'documentChanges': true },
                'workspaceFolders': true
            },
            'general': {
                'positionEncodings': ['utf-8']
            },
        };
        const rootPath = path.dirname(sketchPath);
        const rootUri = `file://${rootPath}`;
        const workspaceFolders = [{ 'name': 'context-extractor', 'uri': rootUri }];
        await lspClient.initialize({
            processId: process.pid,
            capabilities: capabilities,
            trace: 'off',
            rootUri: null,
            workspaceFolders: workspaceFolders,
            initializationOptions: {
                preferences: {
                    includeInlayVariableTypeHints: true
                }
            }
        });
        this.readConfig(credentialsPath);
    }
    async getHoleContext(lspClient, sketchFilePath) {
        // For TypeScript programs, we need to inject the hole function before getting its context.
        // NOTE: this can be abstracted to its own method?
        const sketchDir = path.dirname(sketchFilePath);
        const injectedSketchFilePath = path.join(sketchDir, "injected_sketch.ts");
        const sketchFileContent = fs.readFileSync(sketchFilePath, "utf8");
        const injectedSketchFileContent = `declare function _<T>(): T\n${sketchFileContent}`;
        fs.writeFileSync(injectedSketchFilePath, injectedSketchFileContent);
        // Sync client and server by notifying that the client has opened all the files inside the target directory.
        fs.readdirSync(sketchDir).map(fileName => {
            if (fs.lstatSync(path.join(sketchDir, fileName)).isFile()) {
                lspClient.didOpen({
                    textDocument: {
                        uri: `file://${sketchDir}/${fileName}`,
                        languageId: "typescript",
                        text: fs.readFileSync(`${sketchDir}/${fileName}`).toString("ascii"),
                        version: 1
                    }
                });
            }
        });
        // Get hole context.
        const holePattern = /_\(\)/;
        const firstPatternIndex = injectedSketchFileContent.search(holePattern);
        const linePosition = (injectedSketchFileContent.substring(0, firstPatternIndex).match(/\n/g)).length;
        const characterPosition = firstPatternIndex - injectedSketchFileContent.split("\n", linePosition).join("\n").length - 1;
        const holeHoverResult = await lspClient.hover({
            textDocument: {
                uri: injectedSketchFilePath
            },
            position: {
                character: characterPosition,
                line: linePosition
            }
        });
        const formattedHoverResult = holeHoverResult.contents.value.split("\n").reduce((acc, curr) => {
            if (curr != "" && curr != "```typescript" && curr != "```") {
                return acc + curr;
            }
            else {
                return acc;
            }
        }, "");
        // function _<(a: Apple, c: Cherry, b: Banana) => Cherry > (): (a: Apple, c: Cherry, b: Banana) => Cherry
        const holeFunctionPattern = /(function _)(\<.+\>)(\(\): )(.+)/;
        const match = formattedHoverResult.match(holeFunctionPattern);
        const functionName = "_()";
        const functionTypeSpan = match[4];
        // Clean up and inject the true hole function without the generic type signature.
        // NOTE: this can be abstracted to its own method?
        const trueHoleFunction = `declare function _(): ${functionTypeSpan}`;
        const trueInjectedSketchFileContent = `${trueHoleFunction}\n${sketchFileContent}`;
        fs.writeFileSync(injectedSketchFilePath, trueInjectedSketchFileContent);
        lspClient.didChange({
            textDocument: {
                uri: `file://${injectedSketchFilePath}`,
                version: 2
            },
            contentChanges: [{
                    text: trueInjectedSketchFileContent
                }]
        });
        const sketchSymbol = await lspClient.documentSymbol({
            textDocument: {
                uri: `file://${injectedSketchFilePath}`,
            }
        });
        return {
            fullHoverResult: formattedHoverResult,
            functionName: functionName,
            functionTypeSpan: functionTypeSpan,
            linePosition: linePosition,
            characterPosition: characterPosition,
            holeTypeDefLinePos: 0,
            holeTypeDefCharPos: "declare function _(): ".length,
            // range: { start: { line: 0, character: 0 }, end: { line: 0, character: 52 } }
            range: sketchSymbol[0].location.range
        };
    }
    async extractRelevantTypes(lspClient, fullHoverResult, typeName, startLine, endLine, foundSoFar, currentFile, outputFile) {
        if (!foundSoFar.has(typeName)) {
            foundSoFar.set(typeName, fullHoverResult);
            outputFile.write(`${fullHoverResult};\n`);
            const content = fs.readFileSync(currentFile.slice(7), "utf8");
            for (let linePos = startLine; linePos <= endLine; ++linePos) {
                const numOfCharsInLine = parseInt((0, child_process_1.execSync)(`wc -m <<< "${content.split("\n")[linePos]}"`, { shell: "/bin/bash" }).toString());
                for (let charPos = 0; charPos < numOfCharsInLine; ++charPos) {
                    try {
                        const typeDefinitionResult = await lspClient.typeDefinition({
                            textDocument: {
                                uri: currentFile
                            },
                            position: {
                                character: charPos,
                                line: linePos
                            }
                        });
                        if (typeDefinitionResult && typeDefinitionResult instanceof Array && typeDefinitionResult.length != 0) {
                            // Use documentSymbol instead of hover.
                            // This prevents type alias "squashing" done by tsserver.
                            // This also allows for grabbing the entire definition range and not just the symbol range.
                            // PERF: feels like this could be memoized to improve performance.
                            const documentSymbolResult = await lspClient.documentSymbol({
                                textDocument: {
                                    uri: typeDefinitionResult[0].uri
                                }
                            });
                            // grab if the line number of typeDefinitionResult and documentSymbolResult matches
                            const dsMap = documentSymbolResult.reduce((m, obj) => {
                                m.set(obj.location.range.start.line, obj.location.range);
                                return m;
                            }, new Map());
                            const matchingSymbolRange = dsMap.get(typeDefinitionResult[0].range.start.line);
                            if (matchingSymbolRange) {
                                const snippetInRange = (0, utils_1.extractSnippet)(fs.readFileSync(typeDefinitionResult[0].uri.slice(7)).toString("utf8"), matchingSymbolRange.start, matchingSymbolRange.end);
                                // TODO: this can potentially be its own method. the driver would require some way to get type context.
                                // potentially, this type checker can be its own class.
                                const identifier = this.typeChecker.getIdentifierFromDecl(snippetInRange);
                                await this.extractRelevantTypes(lspClient, snippetInRange, identifier, matchingSymbolRange.start.line, matchingSymbolRange.end.line, foundSoFar, typeDefinitionResult[0].uri, outputFile);
                            }
                        }
                    }
                    catch (err) {
                        console.log(`${err}`);
                    }
                }
            }
        }
        return foundSoFar;
    }
    async extractRelevantHeaders(_, preludeFilePath, relevantTypes, holeType) {
        const relevantContext = new Set();
        const targetTypes = this.generateTargetTypes(relevantTypes, holeType);
        // only consider lines that start with let or const
        const preludeContent = fs.readFileSync(preludeFilePath).toString("utf8");
        const filteredLines = preludeContent.split("\n").filter((line) => {
            return line.slice(0, 3) === "let" || line.slice(0, 5) === "const";
        });
        // check for relationship between each line and relevant types
        filteredLines.forEach(line => {
            const splittedLine = line.split(" = ")[0];
            const typeSpanPattern = /(^[^:]*: )(.+)/;
            const returnTypeSpan = splittedLine.match(typeSpanPattern)[2];
            if (!this.typeChecker.isPrimitive(returnTypeSpan.split(" => ")[1])) {
                this.extractRelevantHeadersHelper(returnTypeSpan, targetTypes, relevantTypes, relevantContext, splittedLine);
            }
        });
        return Array.from(relevantContext);
    }
    generateTargetTypes(relevantTypes, holeType) {
        const targetTypes = new Set();
        targetTypes.add(holeType);
        this.generateTargetTypesHelper(relevantTypes, holeType, targetTypes);
        return targetTypes;
    }
    generateTargetTypesHelper(relevantTypes, currType, targetTypes) {
        // console.log("===Helper===")
        // console.log(currType, currType === undefined)
        if (this.typeChecker.isFunction(currType)) {
            const functionPattern = /(\(.+\))( => )(.+)(;*)/;
            const rettype = currType.match(functionPattern)[3];
            targetTypes.add(rettype);
            this.generateTargetTypesHelper(relevantTypes, rettype, targetTypes);
        }
        else if (this.typeChecker.isTuple(currType)) {
            const elements = this.typeChecker.parseTypeArrayString(currType);
            elements.forEach(element => {
                targetTypes.add(element);
                this.generateTargetTypesHelper(relevantTypes, element, targetTypes);
            });
        }
        // else if (isArray(currType)) {
        //   const elementType = currType.split("[]")[0];
        //
        //   targetTypes.add(elementType)
        //   getTargetTypesHelper(relevantTypes, elementType, targetTypes);
        // } 
        else {
            if (relevantTypes.has(currType)) {
                const definition = relevantTypes.get(currType).split(" = ")[1];
                this.generateTargetTypesHelper(relevantTypes, definition, targetTypes);
            }
        }
    }
    // resursive helper for extractRelevantContext
    // checks for nested type equivalence
    extractRelevantHeadersHelper(typeSpan, targetTypes, relevantTypes, relevantContext, line) {
        targetTypes.forEach(typ => {
            if (this.isTypeEquivalent(typeSpan, typ, relevantTypes)) {
                relevantContext.add(line);
            }
            if (this.typeChecker.isFunction(typeSpan)) {
                const functionPattern = /(\(.+\))( => )(.+)/;
                const rettype = typeSpan.match(functionPattern)[3];
                this.extractRelevantHeadersHelper(rettype, targetTypes, relevantTypes, relevantContext, line);
            }
            else if (this.typeChecker.isTuple(typeSpan)) {
                const elements = this.typeChecker.parseTypeArrayString(typeSpan);
                // const elements = typeSpan.slice(1, typeSpan.length - 1).split(", ");
                elements.forEach(element => {
                    this.extractRelevantHeadersHelper(element, targetTypes, relevantTypes, relevantContext, line);
                });
            }
            // else if (isUnion(typeSpan)) {
            //   const elements = typeSpan.split(" | ");
            //
            //   elements.forEach(element => {
            //     extractRelevantContextHelper(element, relevantTypes, relevantContext, line);
            //   });
            //
            // else if (isArray(typeSpan)) {
            //   const elementType = typeSpan.split("[]")[0];
            //
            //   if (isTypeEquivalent(elementType, typ, relevantTypes)) {
            //     extractRelevantContextHelper(elementType, targetTypes, relevantTypes, relevantContext, line);
            //   }
            // }
        });
    }
    // two types are equivalent if they have the same normal forms
    isTypeEquivalent(t1, t2, relevantTypes) {
        const normT1 = this.normalize(t1, relevantTypes);
        const normT2 = this.normalize(t2, relevantTypes);
        return normT1 === normT2;
    }
    // return the normal form given a type span and a set of relevant types
    // TODO: replace type checking with information from the AST?
    normalize(typeSpan, relevantTypes) {
        let normalForm = "";
        // pattern matching for typeSpan
        if (this.typeChecker.isPrimitive(typeSpan)) {
            return typeSpan;
        }
        else if (this.typeChecker.isObject(typeSpan)) {
            const elements = typeSpan.slice(1, typeSpan.length - 2).split(";");
            normalForm += "{";
            elements.forEach(element => {
                if (element !== "") {
                    const kv = element.split(": ");
                    normalForm += kv[0].slice(1, kv[0].length), ": ", this.normalize(kv[1], relevantTypes);
                    normalForm += "; ";
                }
            });
            normalForm += "}";
            return normalForm;
        }
        else if (this.typeChecker.isTuple(typeSpan)) {
            // const elements = typeSpan.slice(1, typeSpan.length - 1).split(", ");
            const elements = this.typeChecker.parseTypeArrayString(typeSpan);
            normalForm += "[";
            elements.forEach((element, i) => {
                normalForm += this.normalize(element, relevantTypes);
                if (i < elements.length - 1) {
                    normalForm += ", ";
                }
            });
            normalForm += "]";
            return normalForm;
        }
        else if (this.typeChecker.isUnion(typeSpan)) {
            const elements = typeSpan.split(" | ");
            elements.forEach((element, i) => {
                normalForm += "(";
                normalForm += this.normalize(element, relevantTypes);
                normalForm += ")";
                if (i < elements.length - 1) {
                    normalForm += " | ";
                }
            });
            return normalForm;
        }
        else if (this.typeChecker.isArray(typeSpan)) {
            const element = typeSpan.split("[]")[0];
            normalForm += this.normalize(element, relevantTypes);
            normalForm += "[]";
            return normalForm;
        }
        else if (this.typeChecker.isTypeAlias(typeSpan)) {
            const typ = relevantTypes.get(typeSpan)?.split(" = ")[1];
            if (typ === undefined) {
                return typeSpan;
            }
            normalForm += this.normalize(typ, relevantTypes);
            return normalForm;
        }
        else {
            return typeSpan;
        }
    }
    readConfig(configPath) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        this.config = config;
        // console.log(this.config);
    }
    generateTypesAndHeadersPrompt(sketchFileContent, holeType, relevantTypes, relevantHeaders) {
        const prompt = [{
                role: "system",
                content: [
                    "CODE COMPLETION INSTRUCTIONS:",
                    "- Reply with a functional, idiomatic replacement for the program hole marked '_()' in the provided TypeScript program sketch",
                    "- Reply only with a single replacement term for the unqiue distinguished hole marked '_()'",
                    "Reply only with code",
                    "- DO NOT include the program sketch in your reply",
                    "- DO NOT include a period at the end of your response and DO NOT use markdown",
                    "- DO NOT include a type signature for the program hole, as this is redundant and is already in the provided program sketch"
                ].join("\n"),
            }];
        let userPrompt = {
            role: "user",
            content: ""
        };
        if (relevantTypes) {
            userPrompt.content +=
                `# The expected type of the goal completion is ${holeType} #

# The following type definitions are likely relevant: #
${relevantTypes}

`;
        }
        if (relevantHeaders) {
            userPrompt.content += `
# Consider using these variables relevant to the expected type: #
${relevantHeaders}

`;
        }
        userPrompt.content += `# Program Sketch to be completed: #\n${(0, utils_1.removeLines)(sketchFileContent).join("\n")}`;
        prompt.push(userPrompt);
        return prompt;
    }
    ;
    async completeWithLLM(targetDirectoryPath, context) {
        // Create a prompt.
        const prompt = this.generateTypesAndHeadersPrompt(fs.readFileSync(path.join(targetDirectoryPath, "sketch.ts"), "utf8"), context.hole, context.relevantTypes.join("\n"), context.relevantHeaders.join("\n"));
        // Call the LLM to get completion results back.
        const apiBase = this.config.apiBase;
        const deployment = this.config.deployment;
        const model = this.config.gptModel;
        const apiVersion = this.config.apiVersion;
        const apiKey = this.config.apiKey;
        const openai = new openai_1.default({
            apiKey,
            baseURL: `${apiBase}/openai/deployments/${deployment}`,
            defaultQuery: { "api-version": apiVersion },
            defaultHeaders: { "api-key": apiKey }
        });
        const llmResult = await openai.chat.completions.create({
            model,
            messages: prompt,
            temperature: this.config.temperature
        });
        return llmResult.choices[0].message.content;
    }
}
exports.TypeScriptDriver = TypeScriptDriver;
//# sourceMappingURL=typescript-driver.js.map