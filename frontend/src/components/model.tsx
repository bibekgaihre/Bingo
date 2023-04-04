import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useUserContext } from "../functions/User";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  buttonText?: string;
  type: "username" | "room";
}

export default function Modal({ visible, onClose, type }: ModalProps) {
  let [isOpen, setIsOpen] = useState(true);
  let isCancelButtonDisable = false;
  let [value, setValue] = useState("");
  const { setUsername } = useUserContext();
  let title, buttonText;
  if (!visible) return null;
  if (type === "username") {
    title = "Enter Username";
    buttonText = "Create";
    isCancelButtonDisable = true;
  } else if (type === "room") {
    title = "Enter Room ID to join";
    buttonText = "Join";
  }
  const handleCreateUser = () => {
    setUsername(value);
    onClose();
  };
  const handleJoinRoom = () => {
    console.log("handle joinr oom");
  };
  const onClick = () => {
    type == "username" ? handleCreateUser() : handleJoinRoom();
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full border border-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-gray-500 rounded-md py-3 pl-7 pr-20 bg-white text-lg"
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 justify-center md:grid-cols-2 mt-4">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 py-3 px-8 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={onClick}
                    >
                      {buttonText}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center disabled justify-center rounded-md border border-transparent bg-red-600 py-3 px-8 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                      onClick={onClose}
                      disabled={isCancelButtonDisable}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
