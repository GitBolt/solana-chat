use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("FH1e8LRWDyqJLVcCaWZkR1EB4roNfvSXzaa79PSG6QoC");

#[program]
pub mod chat {
    use super::*;

    pub fn create_chatroom(ctx: Context<CreateChatroom>, id: u32) -> Result<()> {
        instructions::create_chatroom::handler(ctx, id)
    }

    pub fn create_user(ctx: Context<CreateUser>, id: u32, name: String) -> Result<()> {
        instructions::create_user::handler(ctx, id, name)
    }

    pub fn join_chatroom(ctx: Context<JoinChatroom>, room_id: u32, user_id: u32) -> Result<()> {
        instructions::join_chatroom::handler(ctx, room_id, user_id)
    }

    pub fn leave_chatroom(ctx: Context<LeaveChatroom>, room_id: u32, user_id: u32) -> Result<()> {
        instructions::leave_chatroom::handler(ctx, room_id, user_id)
    }

    pub fn send_message(
        ctx: Context<SendMessage>,
        room_id: u32,
        user_id: u32,
        chats: String,
    ) -> Result<()> {
        instructions::send_message::handler(ctx, room_id, user_id, chats)
    }
}
