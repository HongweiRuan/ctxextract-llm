"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsHole = exports.isQLIdentifier = exports.isQLLabel = exports.isQLKeyword = exports.isQLLiteral = exports.isQLPredefined = exports.isQLLocalTypeAccess = exports.isQLInterface = exports.isQLArray = exports.isQLUnion = exports.isQLTuple = exports.isQLFunction = exports.parseCodeQLTypesAndLocations = exports.parseCodeQLLocationsAndTypes = exports.parseCodeQLTypes = exports.parseCodeQLVars = exports.parseCodeQLRelevantTypes = exports.removeLines = exports.parseTypeArrayString = exports.escapeQuotes = exports.isTypeAlias = exports.isPrimitive = exports.isFunction = exports.isObject = exports.isArray = exports.isUnion = exports.isTuple = exports.extractSnippet = exports.formatTypeSpan = exports.indexOfRegexGroup = void 0;
const types_1 = require("./types");
const indexOfRegexGroup = (match, n) => {
    return match.reduce((acc, curr, i) => {
        if (i < 1 || i >= n)
            return acc;
        return acc + curr.length;
    }, match.index);
};
exports.indexOfRegexGroup = indexOfRegexGroup;
const formatTypeSpan = (typeSpan) => {
    const formatted = typeSpan.split("").reduce((acc, curr) => {
        // if (curr === "\n" || (curr === " " && acc.slice(-1) === " ")) return acc;
        if (curr === "\n")
            return acc;
        if (curr === " " && acc.slice(-1) === " ")
            return acc;
        // if (curr === "{") return acc + "{ ";
        // if (curr === "}") return acc + " }";
        return acc + curr;
    }, "");
    return formatted;
};
exports.formatTypeSpan = formatTypeSpan;
const extractSnippet = (documentContent, start, end) => {
    const lines = documentContent.split('\n');
    const snippet = [];
    for (let lineNumber = start.line; lineNumber <= end.line; lineNumber++) {
        const line = lines[lineNumber];
        // console.log(line, lineNumber)
        if (line == undefined)
            continue;
        if (lineNumber === start.line && lineNumber === end.line) {
            // Single-line range
            snippet.push(line.substring(start.character, end.character));
        }
        else if (lineNumber === start.line) {
            // Starting line of the range
            snippet.push(line.substring(start.character));
        }
        else if (lineNumber === end.line) {
            // Ending line of the range
            snippet.push(line.substring(0, end.character));
        }
        else {
            // Entire line within the range
            snippet.push(line);
        }
    }
    return snippet.join('\n');
};
exports.extractSnippet = extractSnippet;
const isTuple = (typeSpan) => {
    return typeSpan[0] === "[" && typeSpan[typeSpan.length - 1] === "]";
};
exports.isTuple = isTuple;
const isUnion = (typeSpan) => {
    return typeSpan.includes(" | ");
};
exports.isUnion = isUnion;
const isArray = (typeSpan) => {
    return typeSpan.slice(-2) === "[]";
};
exports.isArray = isArray;
const isObject = (typeSpan) => {
    return typeSpan[0] === "{" && typeSpan[typeSpan.length - 1] === "}";
};
exports.isObject = isObject;
// this is a very rudimentary check, so it should be expanded upon
const isFunction = (typeSpan) => {
    return typeSpan.includes("=>");
};
exports.isFunction = isFunction;
const isPrimitive = (typeSpan) => {
    const primitives = ["string", "number", "boolean"];
    return primitives.includes(typeSpan);
};
exports.isPrimitive = isPrimitive;
const isTypeAlias = (typeSpan) => {
    const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return caps.includes(typeSpan[0]);
};
exports.isTypeAlias = isTypeAlias;
const escapeQuotes = (typeSpan) => {
    return typeSpan.replace(/"/g, `\\"`);
};
exports.escapeQuotes = escapeQuotes;
const parseTypeArrayString = (typeStr) => {
    // Remove all spaces
    const cleaned = typeStr.replace(/\s/g, '');
    // Remove the outermost square brackets
    const inner = cleaned.slice(1, -1);
    // const inner = cleaned.slice(-1) === ";" ? cleaned.slice(1, -2) : cleaned.slice(1, -1);
    // Split the string, respecting nested structures
    const result = [];
    let currentItem = '';
    let nestLevel = 0;
    for (const char of inner) {
        if (char === '[')
            nestLevel++;
        if (char === ']')
            nestLevel--;
        if (char === ',' && nestLevel === 0) {
            // check if currentItem is a name: type pair or just type
            if (currentItem.includes(":")) {
                result.push(currentItem.split(":")[1]);
            }
            else {
                result.push(currentItem);
            }
            currentItem = '';
        }
        else {
            currentItem += char;
        }
    }
    if (currentItem.includes(":")) {
        result.push(currentItem.split(":")[1]);
    }
    else {
        result.push(currentItem);
    }
    return result;
};
exports.parseTypeArrayString = parseTypeArrayString;
const removeLines = (fileContent) => {
    const lines = fileContent.split("\n");
    const filtered = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!(line.split(" ").includes("import") || line.split(" ").includes("from") || line.split(" ").includes("export"))) {
            filtered.push(line);
        }
    }
    return filtered;
};
exports.removeLines = removeLines;
const parseCodeQLRelevantTypes = (table) => {
    const m = new Map();
    const rows = table["#select"]["tuples"];
    rows.forEach(row => {
        const typeDeclaration = row[0]["label"];
        const typeName = row[1];
        const typeDefinition = row[2]["label"];
        const typeQLClass = row[3];
        const componentName = row[4]["label"];
        const componentQLClass = row[5];
        if (!m.has(typeName)) {
            m.set(typeName, {
                typeAliasDeclaration: typeDeclaration,
                typeName: typeName,
                typeDefinition: typeDefinition,
                typeQLClass: typeQLClass,
                components: [{ typeName: componentName, typeQLClass: componentQLClass }]
            });
        }
        else {
            const value = m.get(typeName);
            value.components.push({ typeName: componentName, typeQLClass: componentQLClass });
            m.set(typeName, value);
        }
    });
    return m;
};
exports.parseCodeQLRelevantTypes = parseCodeQLRelevantTypes;
const parseCodeQLVars = (table) => {
    const m = new Map();
    const rows = table["#select"]["tuples"];
    rows.forEach(row => {
        const declaration = row[0]["label"];
        const bindingPattern = row[1]["label"];
        const typeAnnotation = row[2]["label"];
        ;
        const init = row[3]["label"];
        const qlClass = row[4];
        const functionReturnType = row[5];
        const functionReturnTypeQLClass = row[6];
        const componentName = row[7]["label"];
        const componentQLClass = row[8];
        if (!m.has(bindingPattern)) {
            m.set(bindingPattern, {
                constDeclaration: declaration,
                bindingPattern: bindingPattern,
                typeAnnotation: typeAnnotation,
                init: init,
                typeQLClass: qlClass,
                functionReturnType: functionReturnType,
                functionReturnTypeQLClass: functionReturnTypeQLClass,
                components: [{ typeName: componentName, typeQLClass: componentQLClass }]
            });
        }
        else {
            const value = m.get(bindingPattern);
            value.components.push({ typeName: componentName, typeQLClass: componentQLClass });
            m.set(bindingPattern, value);
        }
    });
    return m;
};
exports.parseCodeQLVars = parseCodeQLVars;
const parseCodeQLTypes = (table) => {
    const arr = [];
    const rows = table["#select"]["tuples"];
    rows.forEach(row => {
        const typeName = row[0];
        const typeQLClass = row[1];
        arr.push({ typeName: typeName, typeQLClass: typeQLClass });
    });
    return arr;
};
exports.parseCodeQLTypes = parseCodeQLTypes;
const parseCodeQLLocationsAndTypes = (table) => {
    const locationToTypes = new Map();
    const rows = table["#select"]["tuples"];
    rows.forEach(row => {
        const typeName = row[0];
        const locatedFile = row[1];
        if (!locationToTypes.has(locatedFile)) {
            locationToTypes.set(locatedFile, [typeName]);
        }
        else {
            const pair = locationToTypes.get(locatedFile);
            pair.push(typeName);
            locationToTypes.set(locatedFile, pair);
        }
    });
    return locationToTypes;
};
exports.parseCodeQLLocationsAndTypes = parseCodeQLLocationsAndTypes;
const parseCodeQLTypesAndLocations = (table) => {
    const typeToLocation = new Map();
    const rows = table["#select"]["tuples"];
    rows.forEach(row => {
        const typeName = row[0];
        const locatedFile = row[1];
        if (!typeToLocation.has(typeName)) {
            typeToLocation.set(typeName, locatedFile);
        }
        else {
            // NOTE: this should technically be a name collision
            typeToLocation.set(typeName, locatedFile);
        }
    });
    return typeToLocation;
};
exports.parseCodeQLTypesAndLocations = parseCodeQLTypesAndLocations;
const isQLFunction = (typeQLClass) => {
    return typeQLClass === "FunctionTypeExpr";
};
exports.isQLFunction = isQLFunction;
const isQLTuple = (typeQLClass) => {
    return typeQLClass === "TupleTypeExpr";
};
exports.isQLTuple = isQLTuple;
const isQLUnion = (typeQLClass) => {
    return typeQLClass === "UnionTypeExpr";
};
exports.isQLUnion = isQLUnion;
const isQLArray = (typeQLClass) => {
    return typeQLClass === "ArrayTypeExpr";
};
exports.isQLArray = isQLArray;
const isQLInterface = (typeQLClass) => {
    return typeQLClass === "InterfaceTypeExpr";
};
exports.isQLInterface = isQLInterface;
const isQLLocalTypeAccess = (typeQLClass) => {
    return typeQLClass === "LocalTypeAccess";
};
exports.isQLLocalTypeAccess = isQLLocalTypeAccess;
const isQLPredefined = (typeQLClass) => {
    return typeQLClass === "PredefinedTypeExpr";
};
exports.isQLPredefined = isQLPredefined;
const isQLLiteral = (typeQLClass) => {
    return typeQLClass === "LiteralTypeExpr";
};
exports.isQLLiteral = isQLLiteral;
const isQLKeyword = (typeQLClass) => {
    return typeQLClass === "KeywordTypeExpr";
};
exports.isQLKeyword = isQLKeyword;
const isQLLabel = (typeQLClass) => {
    return typeQLClass === "Label";
};
exports.isQLLabel = isQLLabel;
const isQLIdentifier = (typeQLClass) => {
    return typeQLClass === "Identifier";
};
exports.isQLIdentifier = isQLIdentifier;
const supportsHole = (lang) => {
    const supportedLangs = [types_1.Language.OCaml];
    return supportedLangs.includes(lang);
};
exports.supportsHole = supportsHole;
//# sourceMappingURL=utils.js.map