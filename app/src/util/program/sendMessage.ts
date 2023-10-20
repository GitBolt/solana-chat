import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const sendMessage = async (
  wallet: anchor.Wallet,
  chatroomId: number,
  chatUserId: number,
  message: string,
  name: string,
) => {
  const program = anchorProgram(wallet);

  const [chatroomAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chatroom"), new anchor.BN(chatroomId).toArrayLike(Buffer, "le", 4)],
    program.programId
  );

  const [chatUserAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chat_user"), new anchor.BN(chatUserId).toArrayLike(Buffer, "le", 4)],
    program.programId
  );


  try {
    // @ts-ignore
    const chatAccount = await program.account.chatroom.fetch(
      chatroomAccount
    );

    let history = JSON.parse(chatAccount.chats);
    history.push({ username: name, date: new Date(), message });

    const sig = await program.methods
      .sendMessage(chatroomId, chatUserId, JSON.stringify(history))
      .accounts({
        chatroom: chatroomAccount,
        chatUser: chatUserAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return { error: false, sig }

  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}