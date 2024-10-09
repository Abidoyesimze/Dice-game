import { useEffect, useState } from "react";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

type TAmountProps = {
  amount?: number;
  className?: string;
  isLoading?: boolean;
  showUsdPrice?: boolean;
  disableToggle?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const Amount = ({
  isLoading,
  showUsdPrice = false,
  amount = 0,
  className = "",
  disableToggle = false,
}: TAmountProps) => {
  const { targetNetwork: configuredNetwork } = useTargetNetwork();
  const price = useGlobalState(state => state.nativeCurrencyPrice);
  const [isEthBalance, setEthBalance] = useState<boolean>(!showUsdPrice);

  useEffect(() => {
    setEthBalance(!showUsdPrice);
  }, [showUsdPrice]);

  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  const onToggleBalance = () => {
    if (!disableToggle) {
      setEthBalance(!isEthBalance);
    }
  };

  return (
    <button
      className={`btn btn-sm px-0 btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={onToggleBalance}
    >
      <div className="w-full flex items-center justify-center">
        {isEthBalance ? (
          <>
            <span>{amount?.toFixed(4)}</span>
            <span className="font-bold ml-1">{configuredNetwork.nativeCurrency.symbol}</span>
          </>
        ) : (
          <>
            <span className="font-bold mr-1">$</span>
            <span>{(amount * price).toFixed(2)}</span>
          </>
        )}
      </div>
    </button>
  );
};
