import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const fetchChatrooms = async (
  wallet: anchor.Wallet,
) => {
  const program = anchorProgram(wallet);

  try {
    // @ts-ignore
    const chatAccounts = await program.account.chatroom.all()
    console.log(chatAccounts)

    // let history = JSON.parse(chatAccount.chats);
    // return {error: false, history}
  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}