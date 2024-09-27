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
exports.getRelevantHeaders4 = exports.getRelevantHeaders3 = exports.getRelevantHeaders = exports.extractTypesAndLocations = exports.extractRelevantContextWithCodeQL = exports.extractHeadersWithCodeQL = exports.extractRelevantTypesWithCodeQL = exports.extractHoleType = exports.createDatabaseWithCodeQL = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
// import { CODEQL_PATH, ROOT_DIR, QUERY_DIR, BOOKING_DIR } from "./constants";
const createDatabaseWithCodeQL = (pathToCodeQL, targetPath) => {
    const databaseName = path.basename(targetPath).concat("db");
    const pathToDatabase = path.join(targetPath, databaseName);
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} database create ${pathToDatabase} --source-root=${targetPath} --overwrite --language=javascript-typescript 1> ${path.join(constants_1.ROOT_DIR, "codeql-out", `${path.basename(targetPath)}-codeql-out.txt`)} 2> ${path.join(constants_1.ROOT_DIR, "codeql-out", `${path.basename(targetPath)}-codeql-err.txt`)}`);
        return pathToDatabase;
    }
    catch (err) {
        console.error(`error while creating database: ${err}`);
        throw err;
    }
};
exports.createDatabaseWithCodeQL = createDatabaseWithCodeQL;
const extractHoleType = (pathToCodeQL, pathToQuery, pathToDatabase, outDir) => {
    const q = createHoleTypeQuery();
    fs.writeFileSync(pathToQuery, q);
    const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
    // console.log("extractHoleType q res: ", queryRes)
    return queryRes[0];
};
exports.extractHoleType = extractHoleType;
const extractRelevantTypesWithCodeQL = (pathToCodeQL, pathToQuery, pathToDatabase, outDir) => {
    const pathToBqrs = path.join(outDir, "relevant-types.bqrs");
    const pathToDecodedJSON = path.join(outDir, "relevant-types.json");
    // run CodeQL query relevant-types.ql
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} query run ${pathToQuery} --database=${pathToDatabase} --output=${pathToBqrs}`);
    }
    catch (err) {
        console.error(`error while running query ${pathToQuery}: ${err}`);
    }
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} bqrs decode ${pathToBqrs} --format=json --output=${pathToDecodedJSON} --no-titles`);
    }
    catch (err) {
        console.error(`error while trying to decode ${outDir}/relevant-types.bqrs: ${err}`);
    }
    const relevantTypesContent = fs.readFileSync(pathToDecodedJSON);
    const relevantTypes = (0, utils_1.parseCodeQLRelevantTypes)(JSON.parse(relevantTypesContent.toString()));
    // return relevantTypes;
    // return Array.from(relevantTypes, ([_, v]) => { return v.typeAliasDeclaration });
    return relevantTypes;
};
exports.extractRelevantTypesWithCodeQL = extractRelevantTypesWithCodeQL;
const extractHeadersWithCodeQL = (pathToCodeQL, pathToQuery, pathToDatabase, outDir) => {
    const pathToBqrs = path.join(outDir, "vars.bqrs");
    const pathToDecodedJSON = path.join(outDir, "vars.json");
    // run CodeQL query vars.ql
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} query run ${pathToQuery} --database=${pathToDatabase} --output=${pathToBqrs}`);
    }
    catch (err) {
        console.error(`error while running query ${pathToQuery}: ${err}`);
    }
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} bqrs decode ${pathToBqrs} --format=json --output=${pathToDecodedJSON} --no-titles`);
    }
    catch (err) {
        console.error(`error while trying to decode ${outDir}/vars.bqrs: ${err}`);
    }
    const varsContent = fs.readFileSync(pathToDecodedJSON);
    const vars = (0, utils_1.parseCodeQLVars)(JSON.parse(varsContent.toString()));
    return vars;
};
exports.extractHeadersWithCodeQL = extractHeadersWithCodeQL;
const extractTypes = (pathToCodeQL, pathToQuery, pathToDatabase, outDir) => {
    // console.log("==extractTypes==")
    const pathToBqrs = path.join(outDir, "types.bqrs");
    const pathToDecodedJSON = path.join(outDir, "types.json");
    // run CodeQL query types.ql
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} query run ${pathToQuery} --database=${pathToDatabase} --output=${pathToBqrs}`);
    }
    catch (err) {
        console.error(`error while running query ${pathToQuery}: ${err}`);
    }
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} bqrs decode ${pathToBqrs} --format=json --output=${pathToDecodedJSON} --no-titles`);
    }
    catch (err) {
        console.error(`error while trying to decode ${outDir}/types.bqrs: ${err}`);
    }
    const typesContent = fs.readFileSync(pathToDecodedJSON);
    const types = (0, utils_1.parseCodeQLTypes)(JSON.parse(typesContent.toString()));
    // console.log("extractTypes result: ", types, "\n\n")
    return types;
};
const extractTypesAndLocations = (pathToCodeQL, pathToQuery, pathToDatabase, outDir) => {
    const pathToBqrs = path.join(outDir, "imports.bqrs");
    const pathToDecodedJSON = path.join(outDir, "imports.json");
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} query run ${pathToQuery} --database=${pathToDatabase} --output=${pathToBqrs}`);
    }
    catch (err) {
        console.error(`error while running query ${pathToQuery}: ${err}`);
    }
    try {
        (0, child_process_1.execSync)(`${pathToCodeQL} bqrs decode ${pathToBqrs} --format=json --output=${pathToDecodedJSON} --no-titles`);
    }
    catch (err) {
        console.error(`error while trying to decode ${outDir}/imports.bqrs: ${err}`);
    }
    const typesAndLocationsContent = fs.readFileSync(pathToDecodedJSON);
    const locationsAndTypes = (0, utils_1.parseCodeQLLocationsAndTypes)(JSON.parse(typesAndLocationsContent.toString()));
    const typesAndLocations = (0, utils_1.parseCodeQLTypesAndLocations)(JSON.parse(typesAndLocationsContent.toString()));
    return { locationToType: locationsAndTypes, typeToLocation: typesAndLocations };
};
exports.extractTypesAndLocations = extractTypesAndLocations;
const extractRelevantContextWithCodeQL = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, headers, relevantTypes) => {
    // console.log("==entry==")
    // console.log(Date.now())
    // console.log("extractRelevantContextWithCodeQL start: ", Date.now())
    const relevantContext = new Set();
    const knownNormalForms = new Map();
    // for each var in vars, check if its type is equivalent to any of relevantTypes
    headers.forEach((header) => {
        // console.log("\n\nheader: ", header, "\n\n")
        const typeOfHeader = { typeName: header.typeAnnotation, typeQLClass: header.typeQLClass };
        const isEquivalent = extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, typeOfHeader, relevantTypes, knownNormalForms);
        if (isEquivalent) {
            relevantContext.add(header.constDeclaration);
        }
    });
    // console.log("knownNormalForms: ", knownNormalForms)
    // console.log("extractRelevantContextWithCodeQL end: ", Date.now())
    return relevantContext;
};
exports.extractRelevantContextWithCodeQL = extractRelevantContextWithCodeQL;
const extractRelevantContextHelper = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, headerType, relevantTypes, knownNormalForms) => {
    // console.log("\n\n==recurse==")
    // console.log("headerType: ", headerType)
    // NOTE:
    // extract types that are consistent to any of the target types
    // extract functions whose return types are equivalent to any of the target types
    // extract products whose component types are equivalent to any of the target types
    for (const [key, typ] of relevantTypes.entries()) {
        const typObj = { typeName: typ.typeDefinition, typeQLClass: typ.typeQLClass };
        // console.log("typ: ", typ)
        if (isTypeEquivalent(pathToCodeQL, pathToQuery, pathToDatabase, outDir, headerType, typObj, relevantTypes, knownNormalForms)) {
            // console.log("isTypeEquivalent!")
            return true;
        }
    }
    // if (isQLPredefined(headerType.typeQLClass) || isQLLiteral(headerType.typeQLClass) || isQLKeyword(headerType.typeQLClass)) {
    //   return;
    //
    // }
    if ((0, utils_1.isQLFunction)(headerType.typeQLClass)) {
        const q = createReturnTypeQuery(headerType.typeName);
        // console.log("extractor fq: ", q)
        fs.writeFileSync(pathToQuery, q);
        // could use extractVars
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("extractor fq res: ", queryRes)
        return extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], relevantTypes, knownNormalForms);
    }
    else if ((0, utils_1.isQLInterface)(headerType.typeQLClass)) {
        const q = createInterfaceComponentsTypeQuery(headerType.typeName);
        // console.log("extractor iq", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("extractor iq res", queryRes)
        queryRes.forEach(obj => {
            const val = obj.typeName.split(":")[1];
            const typObj = { typeName: val, typeQLClass: obj.typeQLClass };
            return extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, typObj, relevantTypes, knownNormalForms);
        });
    }
    else if ((0, utils_1.isQLTuple)(headerType.typeQLClass)) {
        const q = createTupleComponentsTypeQuery(headerType.typeName);
        // console.log("extractor tq", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("extractor tq res", queryRes)
        let res = true;
        queryRes.forEach(obj => {
            res &&= extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, relevantTypes, knownNormalForms);
        });
        return res;
    }
    else if ((0, utils_1.isQLUnion)(headerType.typeQLClass)) {
        const q = createUnionComponentsTypeQuery(headerType.typeName);
        // console.log("extractor uq", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("extractor uq res", queryRes)
        let res = true;
        queryRes.forEach(obj => {
            res &&= extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, relevantTypes, knownNormalForms);
        });
        return res;
    }
    else if ((0, utils_1.isQLArray)(headerType.typeQLClass)) {
        const q = createArrayTypeQuery(headerType.typeName);
        // console.log("extractor aq", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("extractor aq res", queryRes)
        return extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], relevantTypes, knownNormalForms);
        // if (isTypeEquivalent(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], typObj, relevantTypes)) {
        //   extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], relevantTypes, relevantContext);
        // }
    }
    else if ((0, utils_1.isQLLocalTypeAccess)(headerType.typeQLClass)) {
        const q = createLocalTypeAccessTypeQuery(headerType.typeName);
        // console.log("extractor ltaq", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("extractor ltaq res", queryRes)
        return extractRelevantContextHelper(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], relevantTypes, knownNormalForms);
    }
    else {
        // console.log(`extractRelevantContextHelper: this doesn't exist: ${JSON.stringify(headerType)}`);
        // console.error(`extractRelevantContextHelper: this doesn't exist: ${JSON.stringify(headerType)}`);
        // throw Error(`extractRelevantContextHelper: this doesn't exist: ${JSON.stringify(headerType)}`);
    }
    // console.log("not found for header: ", headerType)
    return false;
};
const isTypeEquivalent = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, t1, t2, relevantTypes, knownNormalForms) => {
    // console.log("\n\n==isTypeEquivalent==")
    // TODO: the headerType.typeName will include all the arg names too, for example (model: Model, user: User) => Booking[]
    if (knownNormalForms.has(t1.typeName) && knownNormalForms.has(t2.typeName)) {
        const normT1 = knownNormalForms.get(t1.typeName);
        const normT2 = knownNormalForms.get(t2.typeName);
        // console.log("\n\nnormal forms:\n", t1, " -> ", normT1, ", ", t2, " -> ", normT2, "\n\n")
        return normT1 === normT2;
    }
    else if (knownNormalForms.has(t1.typeName)) {
        const normT1 = knownNormalForms.get(t1.typeName);
        const normT2 = normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, t2, relevantTypes, knownNormalForms);
        knownNormalForms.set(t2.typeName, normT2);
        // console.log("\n\nnormal forms:\n", t1, " -> ", normT1, ", ", t2, " -> ", normT2, "\n\n")
        return normT1 === normT2;
    }
    else if (knownNormalForms.has(t2.typeName)) {
        const normT1 = normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, t1, relevantTypes, knownNormalForms);
        knownNormalForms.set(t1.typeName, normT1);
        const normT2 = knownNormalForms.get(t2.typeName);
        // console.log("\n\nnormal forms:\n", t1, " -> ", normT1, ", ", t2, " -> ", normT2, "\n\n")
        return normT1 === normT2;
    }
    else {
        const normT1 = normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, t1, relevantTypes, knownNormalForms);
        const normT2 = normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, t2, relevantTypes, knownNormalForms);
        knownNormalForms.set(t1.typeName, normT1);
        knownNormalForms.set(t2.typeName, normT1);
        // console.log("\n\nnormal forms:\n", t1, " -> ", normT1, ", ", t2, " -> ", normT2, "\n\n")
        return normT1 === normT2;
    }
    // TODO: speed this up by saving known normal forms
};
const normalize = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, typeSpan, relevantTypes, knownNormalForms) => {
    // console.log("==normalize==")
    // console.log("typespan: ", typeSpan)
    // if the type is in relevant types, use that instead
    // if (relevantTypes.has(typeSpan.typeName)) {
    // const obj: typesObject = { typeName: relevantTypes.get(typeSpan.typeName)!.typeDefinition, typeQLClass: relevantTypes.get(typeSpan.typeName)!.typeQLClass };
    // return normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, relevantTypes);
    // return typeSpan.typeName;
    // }
    // if not, run a query to find the type definition
    if ((0, utils_1.isQLPredefined)(typeSpan.typeQLClass) || (0, utils_1.isQLLiteral)(typeSpan.typeQLClass) || (0, utils_1.isQLKeyword)(typeSpan.typeQLClass)) {
        knownNormalForms.set(typeSpan.typeName, typeSpan.typeName);
        return typeSpan.typeName;
    }
    else if ((0, utils_1.isQLFunction)(typeSpan.typeQLClass)) {
        // TODO: the headerType.typeName will include all the arg names too, for example (model: Model, user: User) => Booking[]
        // the normal form will only include (Model, User) => Booking[]
        // query for argument types and return types
        // then concat them using "(" + normalize(argType) + ... + ") => " + normalize(returnType)
        // adding a normal form may suffer from this phenomenon, as two functions of same arg types and return type with different arg names will fail to check for existance
        // make a check if it's a function
        const aq = createArgTypeQuery(typeSpan.typeName);
        fs.writeFileSync(pathToQuery, aq);
        const aqQueryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize faq res: ", aqQueryRes)
        const rq = createReturnTypeQuery(typeSpan.typeName);
        fs.writeFileSync(pathToQuery, rq);
        const rqQueryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize frq res: ", rqQueryRes)
        const normalFormBuilder = [];
        normalFormBuilder.push("(");
        aqQueryRes.forEach((obj, i) => {
            normalFormBuilder.push(normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, relevantTypes, knownNormalForms));
            if (i < aqQueryRes.length - 1) {
                normalFormBuilder.push(", ");
            }
        });
        normalFormBuilder.push(") => ");
        normalFormBuilder.push(normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, rqQueryRes[0], relevantTypes, knownNormalForms));
        const normalForm = normalFormBuilder.join("");
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLInterface)(typeSpan.typeQLClass)) {
        const q = createInterfaceComponentsTypeQuery(typeSpan.typeName);
        // console.log("normalize iq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize iq res: ", queryRes)
        const normalFormBuilder = [];
        normalFormBuilder.push("{");
        queryRes.forEach((obj, i) => {
            const key = obj.typeName.split(": ")[0];
            const val = obj.typeName.split(": ")[1];
            normalFormBuilder.push("".concat(key, ": ", normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, { typeName: val, typeQLClass: obj.typeQLClass }, relevantTypes, knownNormalForms)));
            if (i < queryRes.length - 1) {
                normalFormBuilder.push("; ");
            }
            else {
                normalFormBuilder.push(" ");
            }
        });
        normalFormBuilder.push("}");
        const normalForm = normalFormBuilder.join("");
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLTuple)(typeSpan.typeQLClass)) {
        const q = createTupleComponentsTypeQuery(typeSpan.typeName);
        // console.log("normalize tq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize tq res: ", queryRes)
        const normalFormBuilder = [];
        normalFormBuilder.push("[");
        queryRes.forEach((obj, i) => {
            normalFormBuilder.push(normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, relevantTypes, knownNormalForms));
            if (i < queryRes.length - 1) {
                normalFormBuilder.push(", ");
            }
        });
        normalFormBuilder.push("]");
        const normalForm = normalFormBuilder.join("");
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLUnion)(typeSpan.typeQLClass)) {
        const q = createUnionComponentsTypeQuery(typeSpan.typeName);
        // console.log("normalize uq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize uq res: ", queryRes)
        const normalFormBuilder = [];
        queryRes.forEach((obj, i) => {
            normalFormBuilder.push("".concat(normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, relevantTypes, knownNormalForms)));
            if (i < queryRes.length - 1) {
                normalFormBuilder.push(" | ");
            }
        });
        const normalForm = normalFormBuilder.join("");
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLArray)(typeSpan.typeQLClass)) {
        const q = createArrayTypeQuery(typeSpan.typeName);
        // console.log("normalize aq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize aq res: ", queryRes)
        const normalForm = "".concat(normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], relevantTypes, knownNormalForms), "[]");
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLLocalTypeAccess)(typeSpan.typeQLClass)) {
        const q = createLocalTypeAccessTypeQuery(typeSpan.typeName);
        // console.log("normalize ltaq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize ltaq res: ", queryRes)
        const normalForm = normalize(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], relevantTypes, knownNormalForms);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else {
        // console.log(`normalize: this doesn't exist: ${JSON.stringify(typeSpan)}`)
        console.error(`normalize: this doesn't exist: ${JSON.stringify(typeSpan)}`);
        throw Error(`normalize: this doesn't exist: ${JSON.stringify(typeSpan)}`);
    }
};
// TODO:
// make a target type generator.
// the below method works, but it could be very inefficient.
// get the hole function type
// get the argument type
// get the return type
// keep the skeleton (...) => ...
// use codeql to recurse into each argument type and return type
// most normal form: (normalize(arg1), normalize(arg2), ...) => normalize(ret)
// save normalize(arg1), normalize(arg2), ..., normalize(ret), and every recursive layer
// each could be saved in an array, where the array holds all forms arg1 could take.
// type of the hole itself: (norm(a1), ...) => norm(ret)
// type of the return: norm(ret)
// type of the product: (norm(a1), ...)
// type of the components: norm(a1), norm(a2), ...
// TODO:
// given a list of recursively looked up target types, for each header,
// is the header type in the list?
// if header is a function, is the return type in the list?
//   else, is norm(ret) in the list?
// if header is a product, are any of the components in the list?
//   else, are any of the norm(components) in the list?
// TODO:
// could there be a way to keep track of the layers of recursion?
const getRelevantHeaders = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, headers, holeType) => {
    // console.log("getRelevantHeaders start: ", Date.now())
    const obj = generateTargetTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir, holeType);
    const targetTypes = obj.targetTypes;
    const knownNormalForms = obj.knownNormalForms;
    const relevantHeaders = new Set();
    headers.forEach(header => {
        // console.log("header: ", header)
        if (targetTypes.has(header.typeAnnotation)) {
            relevantHeaders.add(header.constDeclaration);
        }
        else if ((0, utils_1.isQLFunction)(header.typeQLClass)) {
            const q = createReturnTypeQuery(header.typeAnnotation);
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("header fq res: ", queryRes)
            // NOTE: would be nice if we could "step" recursion into normalize2
            // maybe make normalize2 a higher order function that returns a function that we can call
            if (targetTypes.has(queryRes[0].typeName)) {
                relevantHeaders.add(header.constDeclaration);
            }
            else if (targetTypes.has(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], targetTypes, knownNormalForms))) {
                relevantHeaders.add(header.constDeclaration);
            }
        }
        else if ((0, utils_1.isQLTuple)(header.typeQLClass)) {
            const q = createTupleComponentsTypeQuery(header.typeAnnotation);
            // console.log("header tq", q)
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("header tq res", queryRes)
            queryRes.forEach(obj => {
                if (targetTypes.has(obj.typeName)) {
                    relevantHeaders.add(header.constDeclaration);
                }
                else if (targetTypes.has(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, targetTypes, knownNormalForms))) {
                    relevantHeaders.add(header.constDeclaration);
                }
            });
        }
    });
    // console.log("getRelevantHeaders end: ", Date.now())
    return relevantHeaders;
};
exports.getRelevantHeaders = getRelevantHeaders;
const generateTargetTypes = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, holeType) => {
    const targetTypes = new Set();
    const knownNormalForms = new Map();
    // console.log("generateTargetTypes start: ", Date.now())
    normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, holeType, targetTypes, knownNormalForms);
    // console.log("generateTargetTypes end: ", Date.now())
    // console.log("targetTypes: ", targetTypes)
    // console.log("knownNormalForms: ", knownNormalForms)
    return { targetTypes: targetTypes, knownNormalForms: knownNormalForms };
};
const normalize2 = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, typeSpan, targetTypes, knownNormalForms) => {
    // console.log("==normalize2==")
    // console.log("typespan: ", typeSpan)
    if (knownNormalForms.has(typeSpan.typeName)) {
        return knownNormalForms.get(typeSpan.typeName);
    }
    targetTypes.add(typeSpan.typeName);
    if ((0, utils_1.isQLPredefined)(typeSpan.typeQLClass) || (0, utils_1.isQLLiteral)(typeSpan.typeQLClass) || (0, utils_1.isQLKeyword)(typeSpan.typeQLClass)) {
        targetTypes.add(typeSpan.typeName);
        return typeSpan.typeName;
    }
    else if ((0, utils_1.isQLFunction)(typeSpan.typeQLClass)) {
        const aq = createArgTypeQuery(typeSpan.typeName);
        fs.writeFileSync(pathToQuery, aq);
        const aqQueryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize faq res: ", aqQueryRes)
        const rq = createReturnTypeQuery(typeSpan.typeName);
        fs.writeFileSync(pathToQuery, rq);
        const rqQueryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize frq res: ", rqQueryRes)
        const normalFormBuilder = [];
        normalFormBuilder.push("(");
        aqQueryRes.forEach((obj, i) => {
            normalFormBuilder.push(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, targetTypes, knownNormalForms));
            if (i < aqQueryRes.length - 1) {
                normalFormBuilder.push(", ");
            }
        });
        normalFormBuilder.push(") => ");
        normalFormBuilder.push(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, rqQueryRes[0], targetTypes, knownNormalForms));
        const normalForm = normalFormBuilder.join("");
        targetTypes.add(normalForm);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLInterface)(typeSpan.typeQLClass)) {
        const q = createInterfaceComponentsTypeQuery(typeSpan.typeName);
        // console.log("normalize iq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize iq res: ", queryRes)
        const normalFormBuilder = [];
        normalFormBuilder.push("{");
        queryRes.forEach((obj, i) => {
            const key = obj.typeName.split(": ")[0];
            const val = obj.typeName.split(": ")[1];
            normalFormBuilder.push("".concat(" ", key, ": ", normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, { typeName: val, typeQLClass: obj.typeQLClass }, targetTypes, knownNormalForms)));
            if (i < queryRes.length - 1) {
                normalFormBuilder.push("; ");
            }
            else {
                normalFormBuilder.push(" ");
            }
        });
        normalFormBuilder.push("}");
        const normalForm = normalFormBuilder.join("");
        targetTypes.add(normalForm);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLTuple)(typeSpan.typeQLClass)) {
        const q = createTupleComponentsTypeQuery(typeSpan.typeName);
        // console.log("normalize tq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize tq res: ", queryRes)
        const normalFormBuilder = [];
        normalFormBuilder.push("[");
        queryRes.forEach((obj, i) => {
            normalFormBuilder.push(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, targetTypes, knownNormalForms));
            if (i < queryRes.length - 1) {
                normalFormBuilder.push(", ");
            }
        });
        normalFormBuilder.push("]");
        const normalForm = normalFormBuilder.join("");
        targetTypes.add(normalForm);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLUnion)(typeSpan.typeQLClass)) {
        const q = createUnionComponentsTypeQuery(typeSpan.typeName);
        // console.log("normalize uq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize uq res: ", queryRes)
        const normalFormBuilder = [];
        queryRes.forEach((obj, i) => {
            normalFormBuilder.push(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, targetTypes, knownNormalForms));
            if (i < queryRes.length - 1) {
                normalFormBuilder.push(" | ");
            }
        });
        const normalForm = normalFormBuilder.join("");
        targetTypes.add(normalForm);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLArray)(typeSpan.typeQLClass)) {
        const q = createArrayTypeQuery(typeSpan.typeName);
        // console.log("normalize aq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize aq res: ", queryRes)
        const normalForm = "".concat(normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], targetTypes, knownNormalForms), "[]");
        targetTypes.add(normalForm);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else if ((0, utils_1.isQLLocalTypeAccess)(typeSpan.typeQLClass)) {
        const q = createLocalTypeAccessTypeQuery(typeSpan.typeName);
        // console.log("normalize ltaq: ", q)
        fs.writeFileSync(pathToQuery, q);
        const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
        // console.log("normalize ltaq res: ", queryRes)
        const normalForm = normalize2(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], targetTypes, knownNormalForms);
        targetTypes.add(normalForm);
        knownNormalForms.set(typeSpan.typeName, normalForm);
        return normalForm;
    }
    else {
        // console.log(`normalize2: this doesn't exist: ${JSON.stringify(typeSpan)}`)
        console.error(`normalize2: this doesn't exist: ${JSON.stringify(typeSpan)}`);
        throw Error(`normalize2: this doesn't exist: ${JSON.stringify(typeSpan)}`);
    }
};
const getRelevantHeaders3 = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, headers, holeType, relevantTypes) => {
    // console.log("getRelevantHeaders3 start: ", Date.now())
    const obj = generateTargetTypes3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, holeType, relevantTypes);
    const targetTypes = obj.targetTypes;
    const knownNormalForms = obj.knownNormalForms;
    const relevantHeaders = new Set();
    headers.forEach(header => {
        if (targetTypes.has(header.typeAnnotation)) {
            relevantHeaders.add(header.constDeclaration);
        }
        else if ((0, utils_1.isQLFunction)(header.typeQLClass)) {
            // const q = createReturnTypeQuery(header.typeAnnotation);
            // fs.writeFileSync(pathToQuery, q);
            // const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("header fq res: ", queryRes)
            const returnType = header.components[0];
            if (targetTypes.has(returnType.typeName)) {
                relevantHeaders.add(header.constDeclaration);
            }
            else if (targetTypes.has(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, { typeName: returnType.typeName, typeQLClass: returnType.typeQLClass }, relevantTypes, targetTypes, knownNormalForms))) {
                relevantHeaders.add(header.constDeclaration);
            }
        }
        else if ((0, utils_1.isQLTuple)(header.typeQLClass)) {
            // const q = createTupleComponentsTypeQuery(header.typeAnnotation);
            // console.log("header tq", q)
            // fs.writeFileSync(pathToQuery, q);
            // const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("header tq res", queryRes)
            const components = header.components;
            components.forEach(obj => {
                if (targetTypes.has(obj.typeName)) {
                    relevantHeaders.add(header.constDeclaration);
                }
                else if (targetTypes.has(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, { typeName: obj.typeName, typeQLClass: obj.typeQLClass }, relevantTypes, targetTypes, knownNormalForms))) {
                    relevantHeaders.add(header.constDeclaration);
                }
            });
        }
    });
    // console.log("getRelevantHeaders3 end: ", Date.now())
    return relevantHeaders;
};
exports.getRelevantHeaders3 = getRelevantHeaders3;
const generateTargetTypes3 = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, holeType, relevantTypes) => {
    const targetTypes = new Set();
    const knownNormalForms = new Map();
    // console.log("generateTargetTypes3 start: ", Date.now())
    normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, holeType, relevantTypes, targetTypes, knownNormalForms);
    // console.log("generateTargetTypes3 end: ", Date.now())
    // console.log("targetTypes: ", targetTypes)
    // console.log("knownNormalForms: ", knownNormalForms)
    return { targetTypes: targetTypes, knownNormalForms: knownNormalForms };
};
const normalize3 = (pathToCodeQL, pathToQuery, pathToDatabase, outDir, typ, knownTypes, targetTypes, knownNormalForms) => {
    // console.log("current: ", typ)
    // check if exists in known types
    // if so, access and check its class
    // depending on the class, build a normal form using recursion
    if ((0, utils_1.isQLPredefined)(typ.typeQLClass) || (0, utils_1.isQLLiteral)(typ.typeQLClass) || (0, utils_1.isQLKeyword)(typ.typeQLClass)) {
        targetTypes.add(typ.typeName);
        return typ.typeName;
    }
    else if ((0, utils_1.isQLFunction)(typ.typeQLClass)) {
        // NOTE: optimize for different arg name but same type
        if (knownTypes.has(typ.typeName)) {
            const definition = knownTypes.get(typ.typeName);
            const components = definition.components;
            const returnType = components[0];
            const argumentTypes = components.slice(1, components.length);
            const normalFormBuilder = [];
            normalFormBuilder.push("(");
            argumentTypes.forEach((argTyp, i) => {
                normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, argTyp, knownTypes, targetTypes, knownNormalForms));
                if (i < argumentTypes.length - 1) {
                    normalFormBuilder.push(", ");
                }
            });
            normalFormBuilder.push(") => ");
            normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, returnType, knownTypes, targetTypes, knownNormalForms));
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else {
            const aq = createArgTypeQuery(typ.typeName);
            fs.writeFileSync(pathToQuery, aq);
            const aqQueryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 faq res: ", aqQueryRes)
            const rq = createReturnTypeQuery(typ.typeName);
            fs.writeFileSync(pathToQuery, rq);
            const rqQueryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 frq res: ", rqQueryRes)
            const normalFormBuilder = [];
            normalFormBuilder.push("(");
            aqQueryRes.forEach((obj, i) => {
                normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, knownTypes, targetTypes, knownNormalForms));
                if (i < aqQueryRes.length - 1) {
                    normalFormBuilder.push(", ");
                }
            });
            normalFormBuilder.push(") => ");
            normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, rqQueryRes[0], knownTypes, targetTypes, knownNormalForms));
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
    }
    else if ((0, utils_1.isQLInterface)(typ.typeQLClass)) {
        if (knownTypes.has(typ.typeName)) {
            const definition = knownTypes.get(typ.typeName);
            const components = definition.components;
            const normalFormBuilder = [];
            normalFormBuilder.push("{");
            components.forEach((obj, i) => {
                if ((0, utils_1.isQLLabel)(obj.typeQLClass)) {
                    normalFormBuilder.push("".concat(" ", obj.typeName, ": "));
                }
                else {
                    normalFormBuilder.push("".concat(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, knownTypes, targetTypes, knownNormalForms)));
                    if (i < components.length - 1) {
                        normalFormBuilder.push("; ");
                    }
                    else {
                        normalFormBuilder.push(" ");
                    }
                }
            });
            normalFormBuilder.push("}");
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else {
            const q = createInterfaceComponentsTypeQuery(typ.typeName);
            // console.log("normalize3 iq: ", q)
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 iq res: ", queryRes)
            const normalFormBuilder = [];
            normalFormBuilder.push("{");
            queryRes.forEach((obj, i) => {
                const key = obj.typeName.split(": ")[0];
                const val = obj.typeName.split(": ")[1];
                normalFormBuilder.push("".concat(" ", key, ": ", normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, { typeName: val, typeQLClass: obj.typeQLClass }, knownTypes, targetTypes, knownNormalForms)));
                if (i < queryRes.length - 1) {
                    normalFormBuilder.push("; ");
                }
                else {
                    normalFormBuilder.push(" ");
                }
            });
            normalFormBuilder.push("}");
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
    }
    else if ((0, utils_1.isQLTuple)(typ.typeQLClass)) {
        // NOTE: some tuples have identifiers
        if (knownTypes.has(typ.typeName)) {
            const definition = knownTypes.get(typ.typeName);
            const components = definition.components;
            const normalFormBuilder = [];
            normalFormBuilder.push("[");
            components.forEach((obj, i) => {
                if (!(0, utils_1.isQLIdentifier)(obj.typeQLClass)) {
                    normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, knownTypes, targetTypes, knownNormalForms));
                    if (i < components.length - 1) {
                        normalFormBuilder.push(", ");
                    }
                }
            });
            normalFormBuilder.push("]");
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else {
            const q = createTupleComponentsTypeQuery(typ.typeName);
            // console.log("normalize3 tq: ", q)
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 tq res: ", queryRes)
            const normalFormBuilder = [];
            normalFormBuilder.push("[");
            queryRes.forEach((obj, i) => {
                if (!(0, utils_1.isQLIdentifier)(obj.typeQLClass)) {
                    normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, knownTypes, targetTypes, knownNormalForms));
                    if (i < queryRes.length - 1) {
                        normalFormBuilder.push(", ");
                    }
                }
            });
            normalFormBuilder.push("]");
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
    }
    else if ((0, utils_1.isQLUnion)(typ.typeQLClass)) {
        if (knownTypes.has(typ.typeName)) {
            const definition = knownTypes.get(typ.typeName);
            const components = definition.components;
            const normalFormBuilder = [];
            components.forEach((obj, i) => {
                normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, knownTypes, targetTypes, knownNormalForms));
                if (i < components.length - 1) {
                    normalFormBuilder.push(" | ");
                }
            });
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else {
            const q = createUnionComponentsTypeQuery(typ.typeName);
            // console.log("normalize3 uq: ", q)
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 uq res: ", queryRes)
            const normalFormBuilder = [];
            queryRes.forEach((obj, i) => {
                normalFormBuilder.push(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, obj, knownTypes, targetTypes, knownNormalForms));
                if (i < queryRes.length - 1) {
                    normalFormBuilder.push(" | ");
                }
            });
            const normalForm = normalFormBuilder.join("");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
    }
    else if ((0, utils_1.isQLArray)(typ.typeQLClass)) {
        if (knownTypes.has(typ.typeName)) {
            const definition = knownTypes.get(typ.typeName);
            const components = definition.components;
            const elementType = components[0];
            const normalForm = "".concat(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, elementType, knownTypes, targetTypes, knownNormalForms), "[]");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else if (knownTypes.has(typ.typeName.replace("[]", ""))) {
            const definition = knownTypes.get(typ.typeName.replace("[]", ""));
            const normalForm = "".concat(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, definition, knownTypes, targetTypes, knownNormalForms), "[]");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else {
            const q = createArrayTypeQuery(typ.typeName);
            // console.log("normalize3 aq: ", q)
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 aq res: ", queryRes)
            const normalForm = "".concat(normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], knownTypes, targetTypes, knownNormalForms), "[]");
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
    }
    else if ((0, utils_1.isQLLocalTypeAccess)(typ.typeQLClass)) {
        if (knownTypes.has(typ.typeName)) {
            const definition = knownTypes.get(typ.typeName);
            const normalForm = normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, { typeName: definition.typeName, typeQLClass: definition.typeQLClass }, knownTypes, targetTypes, knownNormalForms);
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
        else {
            const q = createLocalTypeAccessTypeQuery(typ.typeName);
            // console.log("normalize3 ltaq: ", q)
            fs.writeFileSync(pathToQuery, q);
            const queryRes = extractTypes(pathToCodeQL, pathToQuery, pathToDatabase, outDir);
            // console.log("normalize3 ltaq res: ", queryRes)
            const normalForm = normalize3(pathToCodeQL, pathToQuery, pathToDatabase, outDir, queryRes[0], knownTypes, targetTypes, knownNormalForms);
            targetTypes.add(normalForm);
            knownNormalForms.set(typ.typeName, normalForm);
            return normalForm;
        }
    }
    else {
        console.log(`normalize3: this doesn't exist: ${JSON.stringify(typ)}`);
        console.error(`normalize3: this doesn't exist: ${JSON.stringify(typ)}`);
        throw Error(`normalize3: this doesn't exist: ${JSON.stringify(typ)}`);
    }
};
const getRelevantHeaders4 = (pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, headers, holeType, relevantTypes, knownTypeLocations) => {
    // TODO:
    // take a type and the header it belongs to.
    // check if that type is directly in relevant types. If so, the header with that type is relevant.
    // if not, then try running a consistency check with all the relevant types.
    // if there's a consistent type, then the header with that type is relevant.
    // if not, then we need to split that type.
    // if it's an arrow type, recurse on the return type.
    // if it's a tuple type, recurse on the components.
    const relevantHeaders = new Set();
    const targetTypes = getTargetTypes(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, holeType);
    headers.forEach(header => {
        if (isRelevantHeader(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, header, targetTypes, relevantTypes, knownTypeLocations)) {
            // TODO: need to strip identifiers from functions, interfaces, tuples, ...
            relevantHeaders.add(header.constDeclaration);
        }
    });
    return relevantHeaders;
};
exports.getRelevantHeaders4 = getRelevantHeaders4;
const getTargetTypes = (pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, holeType) => {
    const targetTypes = new Map();
    targetTypes.set(holeType.typeName, holeType);
    getTargetTypesHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, holeType, targetTypes);
    return targetTypes;
};
const getTargetTypesHelper = (pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, currType, targetTypes) => {
    // console.log("===Helper===")
    // console.log("currType: ", currType)
    // console.log("targetTypes: ", targetTypes)
    if ((0, utils_1.isQLFunction)(currType.typeQLClass)) {
        if (relevantTypes.has(currType.typeName)) {
            const definition = relevantTypes.get(currType.typeName);
            const components = definition.components;
            const returnType = components[0];
            targetTypes.set(returnType.typeName, returnType);
            getTargetTypesHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, returnType, targetTypes);
        }
        else {
            const q = createReturnTypeQuery(currType.typeName);
            const qPath = path.join(pathToQueryDir, "types.ql");
            fs.writeFileSync(qPath, q);
            const queryRes = extractTypes(pathToCodeQL, qPath, pathToDatabase, outDir);
            // console.log("fqr: ", queryRes)
            const returnType = queryRes[0];
            targetTypes.set(returnType.typeName, returnType);
            getTargetTypesHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, returnType, targetTypes);
        }
    }
    else if ((0, utils_1.isQLTuple)(currType.typeQLClass)) {
        if (relevantTypes.has(currType.typeName)) {
            const definition = relevantTypes.get(currType.typeName);
            const components = definition.components;
            for (const comp of components) {
                targetTypes.set(comp.typeName, comp);
                getTargetTypesHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, comp, targetTypes);
            }
        }
        else {
            const q = createTupleComponentsTypeQuery(currType.typeName);
            const qPath = path.join(pathToQueryDir, "types.ql");
            fs.writeFileSync(qPath, q);
            const queryRes = extractTypes(pathToCodeQL, qPath, pathToDatabase, outDir);
            // console.log("tqr: ", queryRes)
            for (const comp of queryRes) {
                targetTypes.set(comp.typeName, comp);
                getTargetTypesHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, comp, targetTypes);
            }
        }
    }
    else if ((0, utils_1.isQLLocalTypeAccess)(currType.typeQLClass)) {
        if (relevantTypes.has(currType.typeName)) {
            const definition = relevantTypes.get(currType.typeName);
            const nextType = { typeName: definition.typeName, typeQLClass: definition.typeQLClass };
            getTargetTypesHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, relevantTypes, nextType, targetTypes);
        }
    }
};
const isRelevantHeader = (pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, header, targetTypes, relevantTypes, knownTypeLocations) => {
    // console.log("===isRelevantHeader===")
    const currType = { typeName: header.typeAnnotation, typeQLClass: header.typeQLClass };
    return isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, currType, targetTypes, relevantTypes, knownTypeLocations);
    // console.log("currType: ", currType)
    // if (isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, currType, relevantTypes, knownTypeLocations)) {
    //   return true;
    // } else {
    //   if (isQLFunction(header.typeQLClass)) {
    //     // console.log("isQLFunction")
    //     // if function, recurse on return type
    //     const returnType: typesObject = header.components[0];
    //     return isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, returnType, relevantTypes, knownTypeLocations);
    //
    //   } else if (isQLTuple(header.typeQLClass)) {
    //     // console.log("isQLTuple")
    //     // if tuple, recurse on component types
    //     const components = header.components;
    //     for (const comp of components) {
    //       if (isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, comp, relevantTypes, knownTypeLocations)) return true;
    //     }
    //   }
    //   return false;
    // };
};
const isRelevantHeaderHelper = (pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, typ, targetTypes, relevantTypes, knownTypeLocations) => {
    if (targetTypes.has(typ.typeName)) {
        return true;
    }
    // this can be a big file that compiles once.
    const scrutineeType = typ.typeName;
    const comparisonTypes = Array.from(targetTypes.keys());
    if (isConsistent(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, scrutineeType, comparisonTypes, knownTypeLocations)) {
        return true;
    }
    else if ((0, utils_1.isQLFunction)(typ.typeQLClass)) {
        // if (isQLFunction(typ.typeQLClass)) {
        if (relevantTypes.has(typ.typeName)) {
            const definition = relevantTypes.get(typ.typeName);
            const components = definition.components;
            const returnType = components[0];
            return isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, returnType, targetTypes, relevantTypes, knownTypeLocations);
        }
        else {
            console.log("fquery");
            const q = createReturnTypeQuery(typ.typeName);
            const qPath = path.join(pathToQueryDir, "types.ql");
            fs.writeFileSync(qPath, q);
            const queryRes = extractTypes(pathToCodeQL, qPath, pathToDatabase, outDir);
            return isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, queryRes[0], targetTypes, relevantTypes, knownTypeLocations);
        }
    }
    else if ((0, utils_1.isQLTuple)(typ.typeQLClass)) {
        if (relevantTypes.has(typ.typeName)) {
            const definition = relevantTypes.get(typ.typeName);
            const components = definition.components;
            for (const comp of components) {
                if (isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, comp, targetTypes, relevantTypes, knownTypeLocations))
                    return true;
            }
        }
        else {
            console.log("tquery");
            const q = createTupleComponentsTypeQuery(typ.typeName);
            const qPath = path.join(pathToQueryDir, "types.ql");
            fs.writeFileSync(qPath, q);
            const queryRes = extractTypes(pathToCodeQL, qPath, pathToDatabase, outDir);
            for (const comp of queryRes) {
                if (isRelevantHeaderHelper(pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, comp, targetTypes, relevantTypes, knownTypeLocations))
                    return true;
            }
        }
    }
    return false;
};
// checks if two types are consistent
// take in two types and write a consistency checker function to a file
// run the typescript compiler on it to invoke static errors
// if there are no errors, then the two types are consistent
const isConsistent = (pathToCodeQL, pathtoQueryDir, pathToDatabase, outDir, scrutineeType, comparisonTypes, knownTypeLocations) => {
    // TODO: this is still too slow. let's just import everything and compile everything
    // TODO: abstract this
    const builder = [];
    for (const [file, dependencies] of knownTypeLocations.locationToType.entries()) {
        builder.push(`import {${dependencies.join(", ")}} from "${file}"`);
    }
    for (const comp of comparisonTypes) {
        builder.push(`function check(a: ${scrutineeType}): ${comp} { return a; }`);
    }
    const checkFunction = builder.join("\n");
    const checkPath = path.join(outDir, "checkConsistency.ts");
    fs.writeFileSync(checkPath, checkFunction);
    const numChecks = comparisonTypes.length;
    try {
        (0, child_process_1.execSync)(`tsc ${checkPath}`);
    }
    catch (err) {
        const numErrors = err.stdout.toString().split("\n").length;
        return numErrors < numChecks;
    }
    return false;
    /*
    // extract necessary dependencies by invoking static dependency error
    const dependencyErrorInvoker = createDependencyErrorInvoker([scrutineeType, ...comparisonTypes]);
    const invokerPath = path.join(outDir, "invokeDependencyError.ts");
    fs.writeFileSync(invokerPath, dependencyErrorInvoker);
   
    const dependencies: string[] = [];
   
    try {
      execSync(`tsc ${invokerPath}`);
    } catch (err: any) {
      dependencies.push(...extractDependencies(err.stdout.toString()));
    }
   
    // TODO: this is slow. we should just use a global map to find the locations.
    // use CodeQL to find their locations
    // we could do this for each comparisonType, but lots of individual queries are expensive.
    // const filesAndDependencies = resolveDependencies(pathToCodeQL, pathtoQueryDir, pathToDatabase, outDir, dependencies);
   
    // loop over dependencies. for each dep, check in knownTypes.typeToLocation to see the location.
    // const filesAndDependencies = dependencies.reduce((m, dep) => {
    //   const location = knownTypeLocations.typeToLocation.get(dep);
    //   if (location) {
    //     if (!m.has(location)) {
    //       m.set(location, [dep]);
    //     } else {
    //       const pair = m.get(location)!;
    //       pair.push(dep);
    //       m.set(location, pair);
    //     }
    //   }
    //   return m;
    // }, new Map<string, string[]>);
    const filesAndDependencies = resolveDependencies(pathToCodeQL, pathtoQueryDir, pathToDatabase, outDir, dependencies, knownTypeLocations);
    console.log("filesAndDependencies: ", filesAndDependencies)
   
    // inject those dependencies into the checker
    for (const comparisonType of comparisonTypes) {
      const checkFunction = createConsistencyCheckFunction(scrutineeType, comparisonType, filesAndDependencies);
      const checkPath = path.join(outDir, "checkConsistency.ts");
      fs.writeFileSync(checkPath, checkFunction);
   
      try {
        execSync(`tsc ${checkPath}`);
        return true;
      } catch (err: any) {
        console.log(`types are not consistent: ${err}`);
      }
    }
    return false;
    */
};
// tsc will print an error "Cannot find name <name>" if it encounters a dependency error.
// extract the dependency from that message.
const extractDependencies = (errorMsg) => {
    // TODO: this should be done once at the beginning to establish a global import map
    const dependencies = [];
    const lines = errorMsg.split("\n");
    lines.forEach(line => {
        const matches = line.match(/(.*Cannot find name \')(.*)(\'.)/);
        if (matches) {
            dependencies.push(matches[2]);
        }
    });
    return dependencies;
};
// run a query to get the dependencies and their file locations.
const resolveDependencies = (pathToCodeQL, pathToQueryDir, pathToDatabase, outDir, dependencies, knownTypeLocations) => {
    return dependencies.reduce((m, dep) => {
        const location = knownTypeLocations.typeToLocation.get(dep);
        if (location) {
            if (!m.has(location)) {
                m.set(location, [dep]);
            }
            else {
                const pair = m.get(location);
                pair.push(dep);
                m.set(location, pair);
            }
        }
        return m;
    }, new Map);
    // const q = createImportQuery(dependencies);
    // fs.writeFileSync(path.join(pathToQueryDir, "imports.ql"), q);
    //
    // return extractTypesAndLocations(pathToCodeQL, path.join(pathToQueryDir, "imports.ql"), pathToDatabase, outDir);
};
const createDependencyErrorInvoker = (possibleDependencies) => {
    const builder = [];
    for (const pdep of possibleDependencies) {
        builder.push(`let x: ${pdep};`);
    }
    return builder.join("\n");
};
const createConsistencyCheckFunction = (scrutineeType, comparisonType, filesAndDependencies) => {
    const builder = [];
    for (const [file, dependencies] of filesAndDependencies.entries()) {
        builder.push(`import {${dependencies.join(", ")}} from "${file}"`);
    }
    builder.push(`function check(a: ${scrutineeType}): ${comparisonType} { return a; }`);
    return builder.join("\n");
};
const createImportQuery = (dependencies) => {
    const dependencyDisjunction = dependencies.reduce((acc, curr, i) => {
        if (i < dependencies.length - 1) {
            return acc + `t.getIdentifier().toString() = "${curr}" or `;
        }
        return acc + `t.getIdentifier().toString() = "${curr}"`;
    }, "");
    return [
        "/**",
        " * @id imports",
        " * @name Imports",
        " * @description Resolve dependencies during consistency check.",
        " */",
        "",
        "import javascript",
        "",
        "from File f, TypeAliasDeclaration t",
        `where(${dependencyDisjunction}) and t.getFile() = f`,
        "select t.getIdentifier().toString(), f.toString()"
    ].join("\n");
};
const createHoleTypeQuery = () => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from VariableDeclarator d",
        `where d.getAChild().toString() = "_()"`,
        "select d.getTypeAnnotation().toString(), d.getTypeAnnotation().getAPrimaryQlClass()"
    ].join("\n");
};
const createArgTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from FunctionTypeExpr t, TypeExpr e",
        `where t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and e = t.getAParameter().getTypeAnnotation()`,
        "select e.toString(), e.getAPrimaryQlClass()"
    ].join("\n");
};
const createReturnTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from FunctionTypeExpr t, TypeExpr e",
        `where t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and e = t.getReturnTypeAnnotation()`,
        "select e.toString(), e.getAPrimaryQlClass()"
    ].join("\n");
};
const createInterfaceComponentsTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from InterfaceTypeExpr t, FieldDeclaration e, int i",
        `where t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and i = [0..t.getNumChild()] and e = t.getChild(i)`,
        // "select e.toString(), e.getName(), e.getTypeAnnotation(), e.getTypeAnnotation().getAPrimaryQlClass(), i",
        `select concat(string a, string b | a = e.getName() and b = e.getTypeAnnotation().toString() | a + ": " + b), e.getTypeAnnotation().getAPrimaryQlClass(), i`,
        "order by i"
    ].join("\n");
};
const createTupleComponentsTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from TupleTypeExpr t, TypeExpr e, int i",
        `where t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and i = [0..t.getNumElementType()] and e = t.getElementType(i)`,
        "select e.toString(), e.getAPrimaryQlClass(), i",
        "order by i"
    ].join("\n");
};
const createUnionComponentsTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from UnionTypeExpr t, TypeExpr e, int i",
        `where t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and i = [0..t.getNumElementType()] and e = t.getElementType(i)`,
        "select e.toString(), e.getAPrimaryQlClass(), i",
        "order by i"
    ].join("\n");
};
const createArrayTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from ArrayTypeExpr t, TypeExpr e",
        `where t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and e = t.getElementType()`,
        "select e.toString(), e.getAPrimaryQlClass()"
    ].join("\n");
};
const createLocalTypeAccessTypeQuery = (typeToQuery) => {
    return [
        "/**",
        " * @id types",
        " * @name Types",
        " * @description Find the specified type.",
        " */",
        "",
        "import javascript",
        "",
        "from LocalTypeAccess t, TypeExpr e, TypeAliasDeclaration td",
        `where(t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and e = t.getLocalTypeName().getADeclaration().getEnclosingStmt().(TypeAliasDeclaration).getDefinition()) or`,
        `(t.toString() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and td.getName() = "${(0, utils_1.escapeQuotes)(typeToQuery)}" and td.getFile().toString() = t.getLocalTypeName().getADeclaration().getEnclosingStmt().(Import).resolveImportedPath().getPath() and e = td.getDefinition())`,
        "select e.toString(), e.getAPrimaryQlClass()"
    ].join("\n");
};
//# sourceMappingURL=codeql.js.map