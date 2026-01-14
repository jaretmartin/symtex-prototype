/**
 * useTreeExpansion Hook
 *
 * Manages expansion state for tree views with localStorage persistence.
 * Handles expand/collapse operations and auto-expansion to selected items.
 */

import { useState, useCallback, useEffect } from 'react';

interface UseTreeExpansionOptions {
  /** Key for localStorage persistence */
  storageKey?: string;
  /** Default expanded node IDs */
  defaultExpanded?: Set<string>;
}

interface UseTreeExpansionReturn {
  /** Set of currently expanded node IDs */
  expandedNodes: Set<string>;
  /** Check if a node is expanded */
  isExpanded: (nodeId: string) => boolean;
  /** Toggle a node's expansion state */
  toggleExpanded: (nodeId: string) => void;
  /** Expand a specific node */
  expand: (nodeId: string) => void;
  /** Collapse a specific node */
  collapse: (nodeId: string) => void;
  /** Expand multiple nodes at once */
  expandMany: (nodeIds: string[]) => void;
  /** Collapse all nodes */
  collapseAll: () => void;
  /** Expand all nodes */
  expandAll: (allNodeIds: string[]) => void;
  /** Expand the path to a specific node (requires parent mapping) */
  expandToNode: (nodeId: string, getParentPath: (id: string) => string[]) => void;
}

export function useTreeExpansion(
  options: UseTreeExpansionOptions = {}
): UseTreeExpansionReturn {
  const { storageKey = 'tree-expansion', defaultExpanded = new Set() } = options;

  // Initialize state from localStorage or defaults
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return defaultExpanded;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(parsed);
      }
    } catch {
      // Ignore parse errors
    }
    return defaultExpanded;
  });

  // Persist to localStorage when expanded nodes change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...expandedNodes]));
    } catch {
      // Ignore storage errors
    }
  }, [expandedNodes, storageKey]);

  const isExpanded = useCallback(
    (nodeId: string): boolean => {
      return expandedNodes.has(nodeId);
    },
    [expandedNodes]
  );

  const toggleExpanded = useCallback((nodeId: string): void => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const expand = useCallback((nodeId: string): void => {
    setExpandedNodes((prev) => {
      if (prev.has(nodeId)) return prev;
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
  }, []);

  const collapse = useCallback((nodeId: string): void => {
    setExpandedNodes((prev) => {
      if (!prev.has(nodeId)) return prev;
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  }, []);

  const expandMany = useCallback((nodeIds: string[]): void => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      nodeIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const collapseAll = useCallback((): void => {
    setExpandedNodes(new Set());
  }, []);

  const expandAll = useCallback((allNodeIds: string[]): void => {
    setExpandedNodes(new Set(allNodeIds));
  }, []);

  const expandToNode = useCallback(
    (nodeId: string, getParentPath: (id: string) => string[]): void => {
      const pathToNode = getParentPath(nodeId);
      if (pathToNode.length > 0) {
        expandMany(pathToNode);
      }
    },
    [expandMany]
  );

  return {
    expandedNodes,
    isExpanded,
    toggleExpanded,
    expand,
    collapse,
    expandMany,
    collapseAll,
    expandAll,
    expandToNode,
  };
}
