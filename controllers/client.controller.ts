import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { items } from "../utils/database";

export const socketClient = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
  socket.on("subscribe", async (channel: any) => {
    if (channel && channel.channel) {
      socket.join(channel.channel);
      const newsItems = await items.find({
        channel: channel.channel,
      });
      io.to(channel.channel).emit("getData", newsItems);
      await items.findAndRemove({ channel: channel.channel });
    }
  });
};
