import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const rommIDX = rooms.find((x) => x.roomId === roomId);
    if (!rommIDX) {
      return res.status(404).json({ ok: false, message: "Invalid room ID" });
    }
    return res.json({ ok: true, messages: rommIDX.messages });

    //find room and return
    //...
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const text = req.body.text;
    //check if roomId exist
    const rommIDX = rooms.findIndex((x) => x.roomId === roomId);
    if (rommIDX === -1) {
      return res.status(404).json({ ok: false, message: "Invalid room ID" });
    }

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0) {
      return res.status(400).json({ ok: false, message: "Invalid text input" });
    }

    //create message
    const newId = uuidv4();
    const newmessage = {
      messageId: newId,
      text: text,
      username: user.username,
    };
    rooms[rommIDX].messages.push(newmessage);

    writeChatRoomsDB(rooms);
    return res.json({ ok: true, newmessage });
  }
}
