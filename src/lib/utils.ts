import axios from "axios";
import { Signer } from "ethers";
import { Address } from "wagmi";

const SAFE_SERVICE_URLS = {
  1: "https://safe-transaction.mainnet.gnosis.io",
  5: "https://safe-transaction.goerli.gnosis.io",
  100: "https://safe-transaction-gnosis-chain.safe.global/",
};

export type ChainId = keyof typeof SAFE_SERVICE_URLS;
export type Delegate = {
  label: String;
  address: Address;
};

export async function getAllOwnerSafes(
  chainId: ChainId,
  ownerAddress: Address
): Promise<Array<Address>> {
  const safeServiceBaseUrl = SAFE_SERVICE_URLS[chainId];
  const ownerSafesUrl = `${safeServiceBaseUrl}/api/v1/owners/${ownerAddress}/safes/`;
  const response = await axios.get<{ safes: Array<Address> }>(ownerSafesUrl);
  return response.data.safes;
}

export async function getAllDelegates(
  chainId: ChainId,
  safeAddress: Address,
  delegatorAddress: Address
): Promise<Array<Delegate>> {
  const safeServiceBaseUrl = SAFE_SERVICE_URLS[chainId];
  const delegatesUrl = `${safeServiceBaseUrl}/api/v1/delegates/`;
  const response = await axios.get<{
    results: Array<{ delegate: Address; label: String }>;
  }>(delegatesUrl, {
    params: {
      safe: safeAddress,
      delegator: delegatorAddress,
    },
  });
  return response.data.results.map((result) => ({
    address: result.delegate,
    label: result.label,
  }));
}

export async function addDelegate(
  chainId: ChainId,
  safeAddress: Address,
  delegatorAddress: Address,
  delegateAddress: Address,
  signature: String,
  label: String
): Promise<void> {
  const safeServiceBaseUrl = SAFE_SERVICE_URLS[chainId];
  const delegatesUrl = `${safeServiceBaseUrl}/api/v1/delegates/`;
  await axios.post(delegatesUrl, {
    safe: safeAddress,
    delegator: delegatorAddress,
    delegate: delegateAddress,
    signature,
    label,
  });
}

export async function deleteDelegate(
  chainId: ChainId,
  delegatorAddress: Address,
  delegateAddress: Address,
  signature: String,
): Promise<void> {
  const safeServiceBaseUrl = SAFE_SERVICE_URLS[chainId];
  const delegatesUrl = `${safeServiceBaseUrl}/api/v1/delegates/${delegateAddress}/`;
  await axios.delete(delegatesUrl, {
    data: {
      delegator: delegatorAddress,
      delegate: delegateAddress,
      signature,
    },
  });
}

export function delegateTOTPMessage(delegateAddress: Address): String {
  const TOTP = Math.floor(Date.now() / 1000 / 3600);
  return `${delegateAddress}${TOTP}`;
}

export async function delegateTOTPSignature(
  delegateAddress: Address,
  signer: Signer | undefined | null
): Promise<String | undefined> {
  const msg = delegateTOTPMessage(delegateAddress);
  return await signer?.signMessage(msg as string);
}
