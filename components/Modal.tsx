"use client";
import React, { FormEvent, Fragment, useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import Image from "next/image";
interface props {
  productId: string;
}
import { addUserEmailToProduct } from "@/libs/actions";
import toast from "react-hot-toast";
const Modal = ({ productId }: props) => {
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false);
    toast.success("You will be notified when the price drops");
    setEmail("");
    closeModal();
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-60"
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="dialog-overlay" />
            </TransitionChild>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            />

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="p-6  bg-white inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl rounded-2xl">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className="text-secondary text-lg leading-[24px] font-semibold mt-4">
                    Get instant email alerts when this product's price changes!
                  </h4>

                  <p className="text-sm text-gray-500 mt-2">
                    Stay updated! We'll notify you as soon as the price drops.
                  </p>
                </div>

                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="px-5 py-3 mt-3 flex items-center gap-2 border border-gray-300 rounded-[27px]">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />

                    <input
                      required
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 pl-1 border-none text-gray-500 text-base focus:outline-none border border-gray-300 rounded-[27px] shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 text-white text-base font-semibold border border-secondary bg-secondary rounded-lg mt-8"
                  >
                    {isSubmitting ? "Submitting..." : "Track"}
                  </button>
                </form>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
