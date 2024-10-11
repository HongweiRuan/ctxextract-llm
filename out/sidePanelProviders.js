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
exports.RelevantTypesProvider = exports.RelevantHeadersProvider = exports.HoleTypeProvider = exports.RelevantTypeItem = exports.RelevantHeaderItem = exports.HoleTypeItem = exports.HoleInfoItem = void 0;
const vscode = __importStar(require("vscode"));
class HoleInfoItem extends vscode.TreeItem {
    constructor(label) {
        super(label);
        this.tooltip = `${this.label}`;
        this.description = '';
    }
}
exports.HoleInfoItem = HoleInfoItem;
class HoleTypeItem extends HoleInfoItem {
    constructor(holeType) {
        super(holeType);
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.iconPath = new vscode.ThemeIcon('symbol-key');
    }
}
exports.HoleTypeItem = HoleTypeItem;
class RelevantHeaderItem extends HoleInfoItem {
    constructor(header) {
        super(header);
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.iconPath = new vscode.ThemeIcon('symbol-namespace');
    }
}
exports.RelevantHeaderItem = RelevantHeaderItem;
class RelevantTypeItem extends HoleInfoItem {
    constructor(type) {
        super(type);
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.iconPath = new vscode.ThemeIcon('symbol-interface');
    }
}
exports.RelevantTypeItem = RelevantTypeItem;
class HoleTypeProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    data = 'No data';
    updateData(newData) {
        this.data = newData;
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve([new HoleTypeItem(this.data)]);
        }
        return Promise.resolve([]);
    }
}
exports.HoleTypeProvider = HoleTypeProvider;
class RelevantHeadersProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    data = ['No data'];
    updateData(newData) {
        this.data = newData;
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.data.map(header => new RelevantHeaderItem(header)));
        }
        return Promise.resolve([]);
    }
}
exports.RelevantHeadersProvider = RelevantHeadersProvider;
class RelevantTypesProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    data = ['No data'];
    updateData(newData) {
        this.data = newData;
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.data.map(type => new RelevantTypeItem(type)));
        }
        return Promise.resolve([]);
    }
}
exports.RelevantTypesProvider = RelevantTypesProvider;
//# sourceMappingURL=sidePanelProviders.js.map