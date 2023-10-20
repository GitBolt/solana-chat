import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const fetchChatrooms = async (
    wallet: anchor.Wallet,
) => {
    const program = anchorProgram(wallet);

    try {
        // @ts-ignore
        const chatAccounts = await program.account.chatroom.all()

        const parsed = chatAccounts.map((chatAcc: any) => {
            return ({
                publicKey: chatAcc.publicKey.toBase58(),
                chats: chatAcc.account.chats,
                creator: chatAcc.account.creator.toBase58(),
                guests: chatAcc.account.guests,
                id: chatAcc.account.id,
            })
        })
        return { error: false, accounts: parsed }
    } catch (e: any) {
        console.log(e)
        return { error: e.toString(), sig: null }
    }
}