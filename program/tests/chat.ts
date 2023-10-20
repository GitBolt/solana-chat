import * as anchor from "@coral-xyz/anchor";
import { Chat } from "../target/types/chat";
import { BN } from "bn.js";
import { Program } from "@coral-xyz/anchor";

describe("Chat", () => {

  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.local();

  const program = anchor.workspace.Etracker as Program<Chat>;

  const wallet = provider.wallet as anchor.Wallet;


  const chatroomId = 3;
  const chatUserId = 3;
  const message = "solana is amazing";
  const chatUserName = "bolt";

  const [chatroomAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chatroom"), new BN(chatroomId).toArrayLike(Buffer, "le", 4)],
    program.programId
  );

  const [chatUserAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chat_user"), new BN(chatUserId).toArrayLike(Buffer, "le", 4)],
    program.programId
  );

  console.log(
    "Chatroom Account: ",
    chatroomAccount.toBase58(),
    "Chat User Account: ",
    chatUserAccount.toBase58()
  );

  it("Created Chatroom Account", async () => {
    const txHash = await program.methods
      .createChatroom(chatroomId)
      .accounts({
        chatroom: chatroomAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Created Chat User", async () => {
    const txHash = await program.methods
      .createUser(chatUserId, chatUserName)
      .accounts({
        chatUser: chatUserAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Joined Chat Room", async () => {
    const txHash = await program.methods
      .joinChatroom(chatroomId, chatUserId)
      .accounts({
        chatroom: chatroomAccount,
        chatUser: chatUserAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Left Chat Room", async () => {
    const txHash = await program.methods
      .leaveChatroom(chatroomId, chatUserId)
      .accounts({
        chatroom: chatroomAccount,
        chatUser: chatUserAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Send Message", async () => {
    const chatAccount = await program.account.chatroom.fetch(
      chatroomAccount
    );

    let history = JSON.parse(chatAccount.chats);
    history.push({ username: chatUserName, date: new Date(), message });

    console.log(history);
    const txHash = await program.methods
      .sendMessage(chatroomId, chatUserId, JSON.stringify(history))
      .accounts({
        chatroom: chatroomAccount,
        chatUser: chatUserAccount,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });
});
