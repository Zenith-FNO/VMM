// TODO 1 - Setup Tezos toolkit
import { TezosToolkit } from "@taquito/taquito";
import { wallet, getAccount} from "./wallet";
import {RPC} from './config'

export const tezos = new TezosToolkit(RPC);

// TODO 3 - Specify wallet provider for Tezos instance
tezos.setWalletProvider(wallet);

export const getBalance = async () => {
    const address = await getAccount();
    const bal = await tezos.tz.getBalance(address).catch((error) => console.log(JSON.stringify(error)));
    return bal.toNumber()/1000000
    
}