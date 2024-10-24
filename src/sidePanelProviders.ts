import * as vscode from 'vscode';

export class HoleInfoItem extends vscode.TreeItem {
  constructor(label: string, public readonly children: HoleInfoItem[] = []) {
    super(
      label,
      children.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
    );
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

  private data: Map<string, string[]> = new Map();

  updateData(newData: Map<string, string[]>) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HoleInfoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
    if (!element) {
      // Create parent nodes for each source file
      return Promise.resolve(Array.from(this.data.entries()).map(([sourceFile, headers]) => {
        const children = headers.map(header => new RelevantHeaderItem(header));
        return new HoleInfoItem(sourceFile, children);
      }));
    }

    // Return the children of a specific source file
    return Promise.resolve(element.children);
  }
}



export class RelevantTypesProvider implements vscode.TreeDataProvider<HoleInfoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<HoleInfoItem | undefined | void> = new vscode.EventEmitter<HoleInfoItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<HoleInfoItem | undefined | void> = this._onDidChangeTreeData.event;

  private data: Map<string, string[]> = new Map();

  updateData(newData: Map<string, string[]>) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HoleInfoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HoleInfoItem): Thenable<HoleInfoItem[]> {
    if (!element) {
      // Create parent nodes for each source file
      return Promise.resolve(Array.from(this.data.entries()).map(([sourceFile, types]) => {
        const children = types.map(type => new RelevantTypeItem(type));
        return new HoleInfoItem(sourceFile, children);
      }));
    }

    // Return the children of a specific source file
    return Promise.resolve(element.children);
  }
}
