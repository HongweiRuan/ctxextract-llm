import * as vscode from 'vscode';

export class HoleInfoItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label);
    this.tooltip = `${this.label}`;
    this.description = '';
  }
}


export class HoleTypeItem extends HoleInfoItem {
  constructor(holeType: string) {
    super(holeType);
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.iconPath = new vscode.ThemeIcon('symbol-key');
  }
}

export class RelevantHeaderItem extends HoleInfoItem {
  constructor(header: string) {
    super(header);
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.iconPath = new vscode.ThemeIcon('symbol-namespace');
  }
}

export class RelevantTypeItem extends HoleInfoItem {
  constructor(type: string) {
    super(type);
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.iconPath = new vscode.ThemeIcon('symbol-interface');
  }
}


export class HoleTypeProvider implements vscode.TreeDataProvider<HoleInfoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

  private data: string = 'No data';

  updateData(newData: string) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HoleInfoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
    if (!element) {
      return Promise.resolve([new HoleTypeItem(this.data)]);
    }
    return Promise.resolve([]);
  }
}


export class RelevantHeadersProvider implements vscode.TreeDataProvider<HoleInfoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

  private data: string[] = ['No data'];

  updateData(newData: string[]) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HoleInfoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
    if (!element) {
      return Promise.resolve(this.data.map(header => new RelevantHeaderItem(header)));
    }
    return Promise.resolve([]);
  }
}


export class RelevantTypesProvider implements vscode.TreeDataProvider<HoleInfoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

  private data: string[] = ['No data'];

  updateData(newData: string[]) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HoleInfoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
    if (!element) {
      return Promise.resolve(this.data.map(type => new RelevantTypeItem(type)));
    }
    return Promise.resolve([]);
  }
}