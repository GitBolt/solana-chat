import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const fetchMessageHistory = async (
  wallet: anchor.Wallet,
  chatroomId: number,
) => {
  const program = anchorProgram(wallet);

  const [chatroomAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chatroom"), new anchor.BN(chatroomId).toArrayLike(Buffer, "le", 4)],
    program.programId
  );

  try {
    // @ts-ignore
    const chatAccount = await program.account.chatroom.fetch(
        chatroomAccount
      );

    let history = JSON.parse(chatAccount.chats);
    return {error: false, history}
  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}