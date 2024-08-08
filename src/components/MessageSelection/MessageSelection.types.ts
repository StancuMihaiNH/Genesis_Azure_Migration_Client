export interface IMessageSelectionProps {
    parentRef: React.RefObject<HTMLElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    onRewrite: (start: number, end: number) => void;
};