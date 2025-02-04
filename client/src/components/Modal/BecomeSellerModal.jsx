import PropTypes from 'prop-types';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from '@headlessui/react';
import { Fragment } from 'react';

const BecomeSellerModal = ({ closeModal, isOpen, requestHandle }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-lg bg-white p-8 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-2xl font-semibold text-center text-gray-900'
                >
                  Request for a delivery man!
                </DialogTitle>
                <div className='mt-4'>
                  <p className='text-sm text-gray-500 text-center'>
                    Please read all the terms & conditions before becoming a delivery man.
                  </p>
                </div>
                <hr className='my-6 border-gray-200' />
                <div className='flex justify-around space-x-4'>
                  <button
                    type='button'
                    onClick={requestHandle}
                    className='inline-flex justify-center items-center rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-colors'
                  >
                    Request
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center items-center rounded-md bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

BecomeSellerModal.propTypes = {
  closeModal: PropTypes.func,
  requestHandle: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default BecomeSellerModal;
