use anchor_lang::prelude::*;
use crate::state::*;

#[instruction(id: u32)]
#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 4 + 32 + (4 + 12),
        seeds = [b"chat_user", id.to_le_bytes().as_ref()], 
        bump
    )]
    pub chat_user: Account<'info, ChatUser>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
pub fn handler(ctx: Context<CreateUser>, id: u32, name: String) -> Result<()> {
    let chat_user = &mut ctx.accounts.chat_user;
    chat_user.owner = *ctx.accounts.signer.key;
    chat_user.name = name;
    msg!("Created a new chat user! {}", id);
    Ok(())
}
