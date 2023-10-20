import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const createChatroom = async (
  wallet: anchor.Wallet,
  chatroomId: number,
  chatUserId: string,
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

   const sig = await program.methods
      .createChatroom(chatroomId)
      .accounts({
        chatroom: chatroomAccount,
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