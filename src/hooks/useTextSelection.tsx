import { useCallback, useLayoutEffect, useState } from "react";

type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number> & {
  [key: string]: number;
};

function roundValues(rect: ClientRect): ClientRect {
  const roundedRect: ClientRect = { ...rect };
  for (const key of Object.keys(roundedRect)) {
    roundedRect[key] = Math.round(roundedRect[key]);
  }
  return roundedRect;
}

function shallowDiff(prev: ClientRect | undefined, next: ClientRect): boolean {
  if (prev && next) {
    for (const key of Object.keys(next)) {
      if (prev[key] !== next[key]) {
        return true;
      }
    }
  } else if (prev !== next) {
    return true;
  }

  return false;
}

type TextSelectionState = {
  clientRect?: ClientRect;
  isCollapsed?: boolean;
  textContent?: string;
  showSelection?: boolean;
  start?: number;
  end?: number;
};

const defaultState: TextSelectionState = {};

export function useTextSelection(containerRef: HTMLElement, target?: HTMLElement) {
  const [{ clientRect, start, end, isCollapsed, textContent, showSelection }, setState] = useState<TextSelectionState>(defaultState);

  const reset = useCallback((): void => {
    setState(defaultState);
  }, []);

  const handler = useCallback((event: "selectionchange" | "keyup" | "keydown" | "resize" | "scroll") => {
    const selection = window.getSelection();
    const newState: TextSelectionState = {
      showSelection: event === "keyup",
    };

    if (!selection || !selection.rangeCount) {
      setState(newState);
      return;
    }

    const range: Range = selection.getRangeAt(0);

    if (target && !target.contains(range.commonAncestorContainer)) {
      setState(newState);
      return;
    }

    if (!range) {
      setState(newState);
      return;
    }

    const contents: DocumentFragment = range.cloneContents();

    if (contents.textContent != null) {
      newState.textContent = contents.textContent;
      if (range.startContainer && range.endContainer) {
        newState.start = range.startOffset;
        newState.end = range.endOffset;
      }
    }

    const rects: DOMRectList = range.getClientRects();
    let newRect: ClientRect;

    if (rects.length === 0 && range.commonAncestorContainer != null) {
      const el = range.commonAncestorContainer as HTMLElement;
      newRect = roundValues(el.getBoundingClientRect().toJSON());
    } else {
      if (rects.length < 1) {
        return;
      }

      newRect = roundValues(rects[0].toJSON());
    }

    if (shallowDiff(clientRect, newRect)) {
      newState.clientRect = newRect;
    }

    newState.isCollapsed = range.collapsed;
    setState(newState);
  }, [target, clientRect]);

  useLayoutEffect(() => {
    const handleEvent = (event: Event) => handler(event.type as "selectionchange" | "keyup" | "keydown" | "resize" | "scroll");

    document.addEventListener("selectionchange", handleEvent);
    document.addEventListener("keydown", handleEvent);
    document.addEventListener("keyup", handleEvent);
    window.addEventListener("resize", handleEvent);

    if (containerRef) {
      containerRef.addEventListener("scroll", handleEvent);
    }

    return () => {
      document.removeEventListener("selectionchange", handleEvent);
      document.removeEventListener("keydown", handleEvent);
      document.removeEventListener("keyup", handleEvent);
      window.removeEventListener("resize", handleEvent);
      if (containerRef) {
        containerRef.removeEventListener("scroll", handleEvent);
      }
    };
  }, [handler, containerRef]);

  return {
    clientRect,
    isCollapsed,
    textContent,
    showSelection,
    start,
    end,
    reset
  };
}

export default useTextSelection;