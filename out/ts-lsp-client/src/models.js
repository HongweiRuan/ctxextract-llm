"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentDiagnosticReportKind = exports.DiagnosticSeverity = exports.InlayHintKind = exports.InsertTextFormat = exports.CompletionTriggerKind = exports.SignatureHelpTriggerKind = exports.TextDocumentSyncKind = exports.CodeActionKind = exports.CompletionItemKind = exports.SymbolKind = void 0;
/**
 * A symbol kind.
 */
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 1] = "File";
    SymbolKind[SymbolKind["Module"] = 2] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 3] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 4] = "Package";
    SymbolKind[SymbolKind["Class"] = 5] = "Class";
    SymbolKind[SymbolKind["Method"] = 6] = "Method";
    SymbolKind[SymbolKind["Property"] = 7] = "Property";
    SymbolKind[SymbolKind["Field"] = 8] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 9] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 10] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 11] = "Interface";
    SymbolKind[SymbolKind["Function"] = 12] = "Function";
    SymbolKind[SymbolKind["Variable"] = 13] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 14] = "Constant";
    SymbolKind[SymbolKind["String"] = 15] = "String";
    SymbolKind[SymbolKind["Number"] = 16] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 17] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 18] = "Array";
    SymbolKind[SymbolKind["Object"] = 19] = "Object";
    SymbolKind[SymbolKind["Key"] = 20] = "Key";
    SymbolKind[SymbolKind["Null"] = 21] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 22] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 23] = "Struct";
    SymbolKind[SymbolKind["Event"] = 24] = "Event";
    SymbolKind[SymbolKind["Operator"] = 25] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 26] = "TypeParameter";
})(SymbolKind || (exports.SymbolKind = SymbolKind = {}));
/**
 * The kind of a completion entry.
 */
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 1] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 2] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 3] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 4] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 5] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 6] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 7] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 8] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 9] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 10] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 11] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 12] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 13] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 14] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 15] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 16] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 17] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 18] = "Reference";
    CompletionItemKind[CompletionItemKind["Folder"] = 19] = "Folder";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 20] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Constant"] = 21] = "Constant";
    CompletionItemKind[CompletionItemKind["Struct"] = 22] = "Struct";
    CompletionItemKind[CompletionItemKind["Event"] = 23] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 24] = "Operator";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 25] = "TypeParameter";
})(CompletionItemKind || (exports.CompletionItemKind = CompletionItemKind = {}));
/**
 * A set of predefined code action kinds.
 */
var CodeActionKind;
(function (CodeActionKind) {
    /**
     * Empty kind.
     */
    CodeActionKind["Empty"] = "";
    /**
     * Base kind for quickfix actions: 'quickfix'.
     */
    CodeActionKind["QuickFix"] = "quickfix";
    /**
     * Base kind for refactoring actions: 'refactor'.
     */
    CodeActionKind["Refactor"] = "refactor";
    /**
     * Base kind for refactoring extraction actions: 'refactor.extract'.
     *
     * Example extract actions:
     *
     * - Extract method
     * - Extract function
     * - Extract variable
     * - Extract interface from class
     * - ...
     */
    CodeActionKind["RefactorExtract"] = "refactor.extract";
    /**
     * Base kind for refactoring inline actions: 'refactor.inline'.
     *
     * Example inline actions:
     *
     * - Inline function
     * - Inline variable
     * - Inline constant
     * - ...
     */
    CodeActionKind["RefactorInline"] = "refactor.inline";
    /**
     * Base kind for refactoring rewrite actions: 'refactor.rewrite'.
     *
     * Example rewrite actions:
     *
     * - Convert JavaScript function to class
     * - Add or remove parameter
     * - Encapsulate field
     * - Make method static
     * - Move method to base class
     * - ...
     */
    CodeActionKind["RefactorRewrite"] = "refactor.rewrite";
    /**
     * Base kind for source actions: `source`.
     *
     * Source code actions apply to the entire file.
     */
    CodeActionKind["Source"] = "source";
    /**
     * Base kind for an organize imports source action:
     * `source.organizeImports`.
     */
    CodeActionKind["SourceOrganizeImports"] = "source.organizeImports";
})(CodeActionKind || (exports.CodeActionKind = CodeActionKind = {}));
/**
 * Defines how the host (editor) should sync document changes to the language
 * server.
 */
var TextDocumentSyncKind;
(function (TextDocumentSyncKind) {
    /**
     * Documents should not be synced at all.
     */
    TextDocumentSyncKind[TextDocumentSyncKind["None"] = 0] = "None";
    /**
     * Documents are synced by always sending the full content
     * of the document.
     */
    TextDocumentSyncKind[TextDocumentSyncKind["Full"] = 1] = "Full";
    /**
     * Documents are synced by sending the full content on open.
     * After that only incremental updates to the document are
     * send.
     */
    TextDocumentSyncKind[TextDocumentSyncKind["Incremental"] = 2] = "Incremental";
})(TextDocumentSyncKind || (exports.TextDocumentSyncKind = TextDocumentSyncKind = {}));
/**
 * How a signature help was triggered.
 *
 * @since 3.15.0
 */
var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    /**
     * Signature help was invoked manually by the user or by a command.
     */
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoked"] = 1] = "Invoked";
    /**
     * Signature help was triggered by a trigger character.
     */
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    /**
     * Signature help was triggered by the cursor moving or by the document
     * content changing.
     */
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = SignatureHelpTriggerKind = {}));
/**
 * How a completion was triggered
 */
var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    /**
     * Completion was triggered by typing an identifier (24x7 code
     * complete), manual invocation (e.g Ctrl+Space) or via API.
     */
    CompletionTriggerKind[CompletionTriggerKind["Invoked"] = 1] = "Invoked";
    /**
     * Completion was triggered by a trigger character specified by
     * the `triggerCharacters` properties of the
     * `CompletionRegistrationOptions`.
     */
    CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    /**
     * Completion was re-triggered as the current completion list is incomplete.
     */
    CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 3] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind || (exports.CompletionTriggerKind = CompletionTriggerKind = {}));
/**
 * Defines whether the insert text in a completion item should be interpreted as
 * plain text or a snippet.
 */
var InsertTextFormat;
(function (InsertTextFormat) {
    /**
     * The primary text to be inserted is treated as a plain string.
     */
    InsertTextFormat[InsertTextFormat["PlainText"] = 1] = "PlainText";
    /**
     * The primary text to be inserted is treated as a snippet.
     *
     * A snippet can define tab stops and placeholders with `$1`, `$2`
     * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
     * the end of the snippet. Placeholders with equal identifiers are linked,
     * that is typing in one will update others too.
     */
    InsertTextFormat[InsertTextFormat["Snippet"] = 2] = "Snippet";
})(InsertTextFormat || (exports.InsertTextFormat = InsertTextFormat = {}));
/**
 * Inlay hint kinds.
 *
 * @since 3.17.0
 */
var InlayHintKind;
(function (InlayHintKind) {
    /**
     * An inlay hint that for a type annotation.
     */
    InlayHintKind[InlayHintKind["Type"] = 1] = "Type";
    /**
     * An inlay hint that is for a parameter.
     */
    InlayHintKind[InlayHintKind["Parameter"] = 2] = "Parameter";
})(InlayHintKind || (exports.InlayHintKind = InlayHintKind = {}));
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    /**
     * Reports an error.
     */
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 1] = "Error";
    /**
     * Reports a warning.
     */
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 2] = "Warning";
    /**
     * Reports an information.
     */
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 3] = "Information";
    /**
     * Reports a hint.
     */
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 4] = "Hint";
})(DiagnosticSeverity || (exports.DiagnosticSeverity = DiagnosticSeverity = {}));
var DocumentDiagnosticReportKind;
(function (DocumentDiagnosticReportKind) {
    DocumentDiagnosticReportKind["Full"] = "full";
    DocumentDiagnosticReportKind["Unchanged"] = "unchanged";
})(DocumentDiagnosticReportKind || (exports.DocumentDiagnosticReportKind = DocumentDiagnosticReportKind = {}));
//# sourceMappingURL=models.js.map