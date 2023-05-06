import {
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useId,
} from "react";

export interface ModalProps {
  visible?: boolean;
  onClose?(): void;
}

interface Props extends ModalProps {
  children: ReactNode;
}

const ModalContainer: FC<Props> = ({
  visible,
  children,
  onClose,
}): JSX.Element | null => {
  const containerId = useId();
  const handleClose = useCallback(() => onClose?.(), [onClose]);

  const handleClick = ({ target }: any) => {
    if (target.id === containerId) handleClose();
  };

  useEffect(() => {
    const closeModal = ({ key }: any) => key === "Escape" && handleClose();

    document.addEventListener("keydown", closeModal);
    return () => document.removeEventListener("keydown", closeModal);
  }, [handleClose]);

  if (!visible) return null;
  return (
    <div
      id={containerId}
      onClick={handleClick}
      className="fixed inset-0 bg-primary dark:bg-primary-dark dark:bg-opacity-5 bg-opacity-5 backdrop-blur-[2px] z-50 flex items-center justify-center"
    >
      <dialog open={visible} className="rounded dark:bg-primary bg-primary-dark p-5">
        {children}
      </dialog>
    </div>
  );
};

export default ModalContainer;
