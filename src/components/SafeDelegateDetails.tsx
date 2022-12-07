import { useState, useEffect, useCallback } from "react";
import { Address, useSigner } from "wagmi";
import { useForm } from "react-hook-form";

import { UserIcon, XMarkIcon } from "@heroicons/react/20/solid";

import {
  addDelegate,
  ChainId,
  Delegate,
  delegateTOTPSignature,
  deleteDelegate,
  getAllDelegates,
} from "lib/utils";

type PropTypes = {
  chainId: ChainId;
  safeAddress: Address;
  delegatorAddress: Address;
  onClose: () => void;
};

type DelegateFormValues = {
  delegateAddress: Address;
  label: String;
};

function SafeDelegateDetails({
  chainId,
  safeAddress,
  delegatorAddress,
  onClose,
}: PropTypes) {
  const [delegates, setDelegates] = useState<Array<Delegate>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register } = useForm<DelegateFormValues>();
  const { data: signer } = useSigner();

  const retrieveSafeDelegates = useCallback(async () => {
    setIsLoading(true);
    const delegates = await getAllDelegates(
      chainId,
      safeAddress,
      delegatorAddress
    );
    setDelegates(delegates);
    setIsLoading(false);
  }, [chainId, safeAddress, delegatorAddress]);

  useEffect(() => {
    retrieveSafeDelegates();
  }, [retrieveSafeDelegates]);

  const handleDeleteDelegate = async (delegate: Address) => {
    const signature = await delegateTOTPSignature(delegate, signer);
    if (!signature) return;
    await deleteDelegate(chainId, delegatorAddress, delegate, signature);
    await retrieveSafeDelegates();
  };

  const handleAddDelegate = async ({
    delegateAddress,
    label,
  }: DelegateFormValues) => {
    const signature = await delegateTOTPSignature(delegateAddress, signer);
    if (!signature) return;
    await addDelegate(
      chainId,
      safeAddress,
      delegatorAddress,
      delegateAddress,
      signature,
      label
    );
    await retrieveSafeDelegates();
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Gnosis Safe
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {safeAddress}
            </p>
          </div>
          <button className="cursor-pointer" onClick={onClose}>
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Delegator</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {delegatorAddress}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Delegates</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                {isLoading && (
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    Loading
                  </li>
                )}
                {delegates.map((delegate) => (
                  <li
                    key={delegate.address}
                    className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <UserIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                        {delegate.address} ({delegate.label})
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => handleDeleteDelegate(delegate.address)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
                <form onSubmit={handleSubmit(handleAddDelegate)}>
                  <li className="flex justify-between items-end py-3 pl-3 pr-4 text-sm">
                    <div className="flex flex-col gap-2 w-full pr-8">
                      <div>
                        <label
                          htmlFor="label"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Label
                        </label>
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Treasurer"
                          {...register("label")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="delegateAddress"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Delegate Address
                        </label>
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="0xe8c475e7d1783d342FE11B7a35E034980aed0769"
                          {...register("delegateAddress")}
                        />
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex justify-end">
                      <button
                        type="submit"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                </form>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default SafeDelegateDetails;
