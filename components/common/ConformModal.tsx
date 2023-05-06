import React, { FC } from "react";
import ModalContainer, { ModalProps } from "./ModalContainer";
import { ImSpinner3 } from 'react-icons/im'
import Button from "./Button";
import cn from "classnames";

interface ConformModalProps extends ModalProps {
    title: string;
    subtitle: string;
    isLoading?: boolean;
    error?: string | null
    onCancel?(): void;
    onConfirm?(): void;
}

const ConformModal: FC<ConformModalProps> = ({
    visible,
    title,
    subtitle,
    isLoading,
    error,
    onClose,
    onCancel,
    onConfirm,
}) => {
    const commonBtnClasses = "px-3 py-1 text-white";
    const commonColorClass = "dark:text-primary-dark text-primary"
    return (
        <ModalContainer visible={visible} onClose={onClose}>
            <div className="">
                <h2 className={cn("text-3xl font-bold", commonColorClass)}>
                    {title}
                </h2>
                <p className={commonColorClass}>{subtitle}</p>
                {isLoading && <p className={cn("flex items-center space-x-2 py-2", commonColorClass)}><ImSpinner3 className="animate-spin" /><span>Please wait...</span> </p>}
                {error && <p className={cn("flex items-center space-x-2 py-2 text-red-500")}>{error}</p>}
                <div className="flex items-center space-x-2 mt-3 justify-end">
                    {onConfirm && (
                        <Button<React.HTMLProps<HTMLButtonElement>>
                            className={cn("bg-red-500 opacity-100 hover:bg-red-600", commonBtnClasses)}
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            Confirm
                        </Button>
                    )}
                    {onCancel && (
                        <Button<React.HTMLProps<HTMLButtonElement>>
                            className={cn("bg-blue-400 opacity-100 hover:bg-blue-500", commonBtnClasses)}
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        </ModalContainer>
    );
};

export default ConformModal;
