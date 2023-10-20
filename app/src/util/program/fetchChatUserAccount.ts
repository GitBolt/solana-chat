import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const fetchChatUserAccount = async (
  wallet: anchor.Wallet,
) => {
  const program = anchorProgram(wallet);

  try {
    // @ts-ignore
    const chatAccount = await program.account.chatUser.all([
      {
        memcmp: {
          offset: 8 + 4,
          bytes: wallet.publicKey.toBase58()
        }
      }
    ])

    return { error: false, accounts: chatAccount }
  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}