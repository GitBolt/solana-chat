use anchor_lang::prelude::*;
use crate::errors::*;
use crate::state::*;

#[instruction(chatroom_id: u32, user_id: u32)]
#[derive(Accounts)]
pub struct JoinChatroom<'info> {
    #[account(
        mut,
        seeds = [b"chatroom", chatroom_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub chatroom: Account<'info, Chatroom>,

    #[account(
        mut,
        seeds = [b"chat_user", user_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub chat_user: Account<'info, ChatUser>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<JoinChatroom>, room_id: u32, user_id: u32) -> Result<()> {
    let chat_user = &mut ctx.accounts.chat_user;
    let chatroom = &mut ctx.accounts.chatroom;

    if (chatroom.guests.contains(&chat_user.owner)) {
        return err!(Errors::AlreadyInRoom);
    } else {
        chatroom.guests.push(chat_user.owner);
    }
    msg!("Joined chatroom!");
    Ok(())
}
