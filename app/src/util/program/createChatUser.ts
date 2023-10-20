import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const createChatUser = async (
  wallet: anchor.Wallet,
  chatUserId: number,
  name: string,
) => {
  const program = anchorProgram(wallet);

  const [chatUserAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chat_user"), new anchor.BN(chatUserId).toArrayLike(Buffer, "le", 4)],
    program.programId
  );


  try {

    const sig = await program.methods
      .createUser(chatUserId, name)
      .accounts({
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