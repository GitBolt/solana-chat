use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Chatroom {
    pub id: u32,
    pub creator: Pubkey,
    pub chats: String, // Stored as long JSON, will limit message length to keep it short
    pub guests: Vec<Pubkey>, // Can just get lenght of this array to find number of people in chatroom. Pubkey of users, not their chat user account
}

#[account]
#[derive(Default)]
pub struct ChatUser {
    pub id: u32,
    pub owner: Pubkey,
    pub name: String,
}
