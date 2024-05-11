import asyncErrorHandler from "../asyncErrorHandler.js";
import ErrorClass from "../errorClass.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export const sendMessageController = asyncErrorHandler(
  async (req, res, next) => {
    const loggedInUserId = req?.user?.id;
    const senderId = loggedInUserId;
    const receiverId = req.params.id;

    const { message } = req.body;

    let gotConversation = await Conversation.findOne({
      participaints: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participaints: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      gotConversation.messages.push(newMessage?._id);
    }

    await gotConversation.save();

    // socket io

    res.status(201).send({
      success: true,
      message: "Message send successfullyz",
    });
  }
);

export const getMessageController = asyncErrorHandler(
  async (req, res, next) => {
    const receiverId = req.params.id;
    const senderId = req?.user?.id;

    const conversation = await Conversation.findOne({
      participaints: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) return new ErrorClass(404, "chats not found", false);

    res.status(200).send({
      success: true,
      message: "message fetch successfully",
      conversation,
    });
  }
);
