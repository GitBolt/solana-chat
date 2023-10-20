use anchor_lang::prelude::*;
use crate::state::*;

#[instruction(id: u32)]
#[derive(Accounts)]
pub struct CreateChatroom<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 4 + 32 + (4 + 70) + (4 + 1 * 50) + (4 + 1 * 4) + 8 + 1,
        seeds = [b"chatroom", id.to_le_bytes().as_ref()], 
        bump
    )]
    pub chatroom: Account<'info, Chatroom>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
pub fn handler(ctx: Context<CreateChatroom>, id: u32) -> Result<()> {
    let chatroom = &mut ctx.accounts.chatroom;
    chatroom.creator = *ctx.accounts.signer.key;
    chatroom.guests = [].to_vec();
    chatroom.chats = "[]".to_string();
    msg!("Created a new chatroom! {}", id);
    Ok(())
}
