import * as anchor from "@coral-xyz/anchor";
import { Linktree } from "../target/types/linktree";
import { BN } from "bn.js";

describe("Linktree", () => {
  const accountId = 1;
  const linkName = "website";
  const profileLink = "bolt";

  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.local();

  const program = anchor.workspace.Linktree as anchor.Program<Linktree>;

  const wallet = provider.wallet as anchor.Wallet;

  const [linktreeAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("linktree_account"),
      new BN(accountId).toArrayLike(Buffer, "le", 4),
    ],
    program.programId
  );

  const [linkAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("link_account"),
      new BN(accountId).toArrayLike(Buffer, "le", 4),
      Buffer.from(linkName),
    ],
    program.programId
  );

  console.log(
    "Linktree Account: ",
    linktreeAccount.toBase58(),
    "Link Account: ",
    linkAccount.toBase58()
  );

  it("Created Linktree Account", async () => {
    const txHash = await program.methods
      .createAccount(accountId, profileLink)
      .accounts({
        linktreeAccount,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Update Linktree account", async () => {
    const txHash = await program.methods
      .updateAccount(accountId, profileLink, "#FFFFFF")
      .accounts({
        linktreeAccount,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Add link", async () => {
    const txHash = await program.methods
      .addLink(accountId, linkName, "aabis.dev")
      .accounts({
        linkAccount,
        authority: wallet.publicKey,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });

  it("Remove Link", async () => {
    const txHash = await program.methods
      .removeLink(accountId, linkName)
      .accounts({
        linkAccount,
        authority: wallet.publicKey,
      })
      .rpc();
    console.log(`Signature: ${txHash}`);
  });
});
