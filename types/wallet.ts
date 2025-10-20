export interface PhantomWallet {
  isPhantom?: boolean
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>
  disconnect: () => Promise<void>
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

export interface MetaMaskWallet {
  isMetaMask?: boolean
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (accounts: string[]) => void) => void
  removeListener: (event: string, callback: (accounts: string[]) => void) => void
}

export interface WalletState {
  connected: boolean
  address: string | null
  type: "phantom" | "metamask" | null
}
