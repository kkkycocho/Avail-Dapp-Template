import { useMemo, useState } from 'react';

export default function WalletBar() {
  const [foundExtensions, setFoundExtensions] = useState<{
    [extensionName: string]: { version: string; enable: Function };
  }>({});
  const [account, setAccount] = useState<any>(null);

  const shortenedAddress = useMemo(() => {
    if (!account?.length) return '';
    const { address } = account[0];
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [account]);

  const findExtension = async () => {
    const { web3Enable, web3Accounts } = await import(
      '@polkadot/extension-dapp'
    );
    const extension = await web3Enable('Example with extension');
    if (extension.length) {
      const web3Window = window as any;
      if (web3Window.injectedWeb3 as any) {
        setFoundExtensions(web3Window.injectedWeb3);
      }

      const accounts = await web3Accounts();
      setAccount(accounts);
      console.log(foundExtensions);
    } else {
      (document.getElementById('my_modal_3') as HTMLDialogElement)?.showModal();
    }
  };

  const WalletConnected = () => {
    return (
      <div className="text-sm font-medium">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn-wallet btn">
            {shortenedAddress}
          </div>
        </div>
      </div>
    );
  };

  const ConnectWallet = () => {
    return (
      <div>
        <button
          className="btn-wallet btn text-sm font-medium"
          onClick={() => findExtension()}
        >
          Connect Wallet
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold text-black">Download Wallet</h3>
            <div className="join join-vertical mx-auto mt-7 flex w-2/3">
              <button
                key="subwallet"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    'https://chromewebstore.google.com/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
                    '_blank',
                  );
                }}
                className="btn join-item hover:bg-[#8B5FBF]"
              >
                <img
                  className="mr-2 size-7"
                  src="/assets/images/subwallet.svg"
                  alt="wallet"
                />
                SubWallet
              </button>
            </div>
          </div>
        </dialog>
      </div>
    );
  };

  return account?.length ? <WalletConnected /> : <ConnectWallet />;
}
