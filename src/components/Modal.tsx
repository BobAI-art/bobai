import React, { PropsWithChildren } from "react";
import { Dialog } from "@headlessui/react";
import H2 from "./H2";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ModalProps {
  title: string;
  onClose: () => void;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  onClose,
  title,
}) => (
  <div className="fixed  inset-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-[512px] rounded bg-white p-2">
              <Dialog.Title
                className="flex justify-between text-gray-900"
                as={H2}
              >
                {title}
                <XMarkIcon className="w-8 cursor-pointer" onClick={onClose} />
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
);
export default Modal;
