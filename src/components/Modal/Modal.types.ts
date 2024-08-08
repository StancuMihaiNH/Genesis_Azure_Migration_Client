export interface IModalProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
};