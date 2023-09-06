export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const timeStamp = (message) => {
  const month = message.createdAt.slice(5, 7);
  var day = message.createdAt.slice(8,10);
  const min = message.createdAt.slice(14,16);
  var hour = message.createdAt.slice(11,13);
  hour = hour - 4
  if(hour < 0) hour = hour + 24;
  
  if(hour == 0) hour  = "00"
  
  if(day < 10) day = day[1]

  var monthName;
  
  switch (month) {
    case "01":
      monthName = "Jan ";
      break;
    case "02":
      monthName = "Feb ";
      break;
    case "03":
      monthName = "March ";
      break;
    case "04":
      monthName = "April ";
      break;
    case "05":
      monthName = "May ";
      break;
    case "06":
      monthName = "June ";
      break;
    case "07":
      monthName = "July ";
      break;
    case "08":
      monthName = "Aug ";
      break;
    case "09":
      monthName = "Sept ";
      break;
    case "10":
      monthName = "Oct ";
      break;
    case "11":
      monthName = "Nov ";
      break;
    case "12":
      monthName = "Dec ";
      break;
    default:
      break;
  }
  return monthName + day + " " + hour.toString() + ":" + min 
};