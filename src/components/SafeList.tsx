import { useEffect, useState } from "react";
import { Address } from "wagmi";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { ChainId, getAllOwnerSafes } from "lib/utils";

type PropTypes = {
  chainId: ChainId;
  ownerAddress: Address;
  handleSafeClick: (safeAddress: Address) => void;
};

function SafeList({ chainId, ownerAddress, handleSafeClick }: PropTypes) {
  const [safeAddresses, setSafeAddresses] = useState<Array<Address>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const retrieveSafeAddresses = async () => {
      setIsLoading(true);
      const safes = await getAllOwnerSafes(chainId, ownerAddress);
      setSafeAddresses(safes);
      setIsLoading(false);
    };
    retrieveSafeAddresses();
  }, [chainId, ownerAddress]);

  return (
    <>
      {isLoading && "Loading"}
      {!isLoading && (
        <>
          <div className="py-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Your Safes
            </h3>
          </div>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {safeAddresses.map((safeAddress) => (
                <li key={safeAddress}>
                  <div
                    className="block cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSafeClick(safeAddress)}
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <p className="truncate font-medium text-indigo-600">
                          {safeAddress}
                        </p>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default SafeList;
