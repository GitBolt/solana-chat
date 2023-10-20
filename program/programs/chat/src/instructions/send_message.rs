use anchor_lang::prelude::*;
use crate::errors::*;
use crate::state::*;

#[instruction(chatroom_id: u32, user_id: u32)]
#[derive(Accounts)]
pub struct SendMessage<'info> {
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

pub fn handler(ctx: Context<SendMessage>, room_id: u32, user_id: u32, chats: String) -> Result<()> {
    let chat_user = &mut ctx.accounts.chat_user;
    let chatroom = &mut ctx.accounts.chatroom;

    chatroom.chats = chats; // Assuming all the chat handling will be done in client side, which is not very secure but need to keep program simple
    msg!("Sent message and updated chat history!");
    Ok(())
}
