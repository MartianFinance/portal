'use client';

import { FC, ReactNode, useMemo } from 'react';
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import {
    createDefaultAddressSelector,
    createDefaultAuthorizationResultCache,
    createDefaultWalletNotFoundHandler,
    SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile';
import { clusterApiUrl } from '@solana/web3.js';
import { useIsAndroid } from '@/hooks/use-is-android';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { isAndroid } = useIsAndroid();

    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => {
            const mobileWallet = new SolanaMobileWalletAdapter({
                addressSelector: createDefaultAddressSelector(),
                authorizationResultCache: createDefaultAuthorizationResultCache(),
                walletNotFoundHandler: createDefaultWalletNotFoundHandler(),
            });

            const desktopWallets = [
                new PhantomWalletAdapter(),
                new SolflareWalletAdapter(),
                new BackpackWalletAdapter(),
            ];

            return isAndroid ? [mobileWallet, ...desktopWallets] : desktopWallets;
        },
        [isAndroid]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
