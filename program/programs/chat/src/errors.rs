use crate::*;

#[error_code]
pub enum Errors {
    #[msg("You have already joined this chat room!")]
    AlreadyInRoom,
    #[msg("You can't leave a chatroom which you have not joined.")]
    NotInChatRoom,
    #[msg("You must join the room in order to send messages there")]
    JoiningRoomRequired,
}
