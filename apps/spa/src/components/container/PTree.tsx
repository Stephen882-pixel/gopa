import * as React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import type { PObjectProps, PTreeProps, PTreeItem, PFlatTreeItem } from "@src/components/types";


export function findItem(tree: PTreeItem[], key: string): null | PTreeItem {
  for ( const item of tree ) {
    if ( key === item.id ) {
      return item;
    }
    if ( item.children ) {
      const found = findItem(item.children, key);
      if ( null !== found ) {
        return found;
      }
    }
  }
  return null;
}

function traceFind(tree: PTreeItem[], key: string): null | string[] {
  for ( const item of tree ) {
    if ( key === item.id ) {
      return [item.id];
    }
    if ( item.children ) {
      const found = traceFind(item.children, key);
      if ( null !== found ) {
        return [item.id, ...found];
      }
    }
  }
  return null;
}

export function buildTree(list: PFlatTreeItem[], key?: number | string): PTreeItem[] {
  // Build the tree
  const _build = (k: null | number | string) => {
    const tree: PTreeItem[] = [];
    const keys: PObjectProps = {};
    list = list.filter(({parent, id, ...p}: PFlatTreeItem) => {
      if ( parent === k ) {
        tree.push({id: String(id), ...p});
        keys[String(id)] = id;
      }
      return parent !== k
    });
    for ( const node of tree ) {
      if ( 0 === list.length ) {
        return tree;
      }
      node.children = _build(keys[node.id]);
    }
    return tree;
  };
  // Get the tree
  return _build(undefined === key ? null : key);
}

export default function PTree({ id, tree, defaultSelectedItems, multiSelect, checkboxSelection, onSelect }:PTreeProps) {
  const [selected, setSelected] = React.useState<PTreeItem[]>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);

  function showItem(item: PTreeItem, index: number) {
    if ( item.children ) {
      return (
        <TreeItem key={index} itemId={item.id} label={item.label}>
          {renderTree(item.children)}
        </TreeItem>
      );
    }
    else {
      return (
        <TreeItem key={index} itemId={item.id} label={item.label} />
      );
    }
  }

  const renderTree = (items: Array<PTreeItem>) => items.map((item, index) => showItem(item, index));

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean,
  ) => {
    const item = findItem(tree, itemId);
    if ( null === item ) {
      return;
    }
    const { children, ...node } = item;
    const updated = !!multiSelect
      ? (isSelected ? [...selected, node] : selected.filter((s: PTreeItem) => s.id != node.id))
      : (isSelected ? [node] : []);
    setSelected(updated);
    onSelect?.(updated);
  };

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[],
  ) => {
    setExpanded(itemIds);
  };

  React.useEffect(() => {
    let list = [];
    const items = [];
    for ( const v of (defaultSelectedItems || []) ) {
      // Selected
      const item = findItem(tree, v);
      if ( null !== item ) {
        const { children, ...node } = item;
        items.push(node);
      }
      // Expanded
      for ( const t of (traceFind(tree, v) || []) ) {
        if ( t !== v ) {
          list.push(t);
        }
      }
    }
    setSelected(items);
    setExpanded(list);

    // https://mui.com/x/react-tree-view/simple-tree-view/items/#get-an-items-dom-element-by-id
    // https://stackoverflow.com/a/42503964/3003786
    setTimeout(() => {
      const node = document.getElementById(`${id}-${(defaultSelectedItems || [])[0]}`);
      node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 300);

  }, []);

  return (
    <SimpleTreeView
      className="select_sector_list_A"
      id={id}
      multiSelect={!!multiSelect}
      checkboxSelection={!!checkboxSelection}
      selectedItems={selected.map((s: PTreeItem) => s.id)}
      expandedItems={expanded}
      onExpandedItemsChange={handleExpandedItemsChange}
      onItemSelectionToggle={handleItemSelectionToggle}
    >
      {renderTree(tree)}
    </SimpleTreeView>
  );
}
