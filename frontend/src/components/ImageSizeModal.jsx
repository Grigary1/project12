import { Dialog } from "@headlessui/react";

export function ImageSizeModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold">Image Too Large</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mt-2">
            Please upload an image smaller than 10MB.
          </Dialog.Description>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
