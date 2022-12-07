import { ConnectButton } from "@rainbow-me/rainbowkit";

function Header() {
  return (
    <header className="">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 sticky "
        aria-label="Top"
      >
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6 lg:border-none">
          <div className="flex items-center">
            <span className="sr-only">Safe Delegator</span>
            <img
              className="h-10 w-auto"
              src="https://raw.githubusercontent.com/safe-global/web-core/dev/public/images/logo.svg"
              alt=""
            />
          </div>
          <div className="ml-10 space-x-4">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header
