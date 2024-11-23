# llmcompletion

This extension surpasses Copilot by delivering precise, type-aware suggestions
through deep Abstract Syntax Tree (AST) analysis, explicit type extraction, and recursive examination of relevant types and headers.
This ensures contextually accurate and customizable code completions, tailored to your specific project and codebase.

## Installation

Run the following command.

```text
code --install-extension my-extension-0.0.1.vsix
```

Open Visual Studio Code and check that the extension is properly loaded.

## How to Use

### Setting/Resetting the API Key

#### Set API Key (First-Time Users):

Navigate to credentials.json and input your API key.

#### Reset API Key:

Press Cmd + Shift + P (macOS) or Ctrl + Shift + P (Windows/Linux).
Type `reset API key` and select the command to reset your key.

### Setting/Resetting the Key Combination to Invoke Completion

Press Cmd + Shift + P (macOS) or Ctrl + Shift + P (Windows/Linux).
Type Preferences: Open Keyboard Shortcuts and select it.
Search for `extension.fetchCompletion`.
Double-click the command and set your preferred key combination.

### Side Panel Information

1. Hole Information
Definition: A placeholder in the code, typically denoted as _(), _, or ??, marking incomplete parts of the code.
Purpose: Using language servers to analyze the AST, the specific node containing the hole is identified, along with its enclosing statement and type annotation.
Use: Facilitates type inference and ensures accurate code completion.

2. Relevant Types
Definition: All types related to the hole, including its components and subcomponents.
Purpose: Recursively extracts types down to primitive types, storing them in a type map.
Use: Provides a comprehensive type context for code completion.

3. Relevant Headers
Definition: Headers with types consistent with those derived from the hole.
Purpose: Uses type normalization to identify headers that match the hole’s type.
Use: Supplies relevant code snippets to enhance the accuracy and contextual relevance of completions.
