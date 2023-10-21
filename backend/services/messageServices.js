const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    }).populate("latestMessage");

    res.json(message);
  } catch (error) {
    res.status(400);
    console.log(error.message);
    throw new Error(error.message);
  }
});

const updateNotifications = expressAsyncHandler(async (req, res) => {
  //NOTIFICATIONS ADD
  try {
    //console.log(req.body.chatId);
    const message = await Message.findById(req.body.messageId);
    //console.log(message);
    const chat = await Chat.findById(req.body.chatId);

    const chatUsers = await User.populate(chat, {
      path: "users",
    });
    const users = chatUsers.users;
    const result = users.filter((user) => user.email !== req.user.email);
    //console.log(result);

    result.forEach(async (user) => {
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: { notification: message },
        },
        { new: true }
      );
    });
    res.json(users)
  } catch (error) {
    console.log(error.message);
  }
});


const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    // NOTIFICATIONS REMOVE
    // const user = await User.findById(req.user._id).populate("notification");
    // const notifications = user.notification;

    // const chatNotif = notifications.filter(
    //   (notif) => notif.chat.toString() === req.params.chatId
    // );
    // //console.log(chatNotif);

    // await User.findByIdAndUpdate(req.user._id, {
    //   $pull: { notification: { $in: chatNotif } },
    // });

    res.json(messages);
  } catch (error) {
    console.log(error.message);
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, updateNotifications};
