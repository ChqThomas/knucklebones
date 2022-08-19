import { Meteor } from 'meteor/meteor';

import http from 'http';
import {LocalPresence, Server} from "colyseus";
import { LobbyRoom } from "colyseus";
import {MyRoom} from "/imports/api/rooms/MyRoom";
import { URL } from "url";

const PORT = parseInt(process.env.SOCKET_PORT) || 3003;

// Client-side config
WebAppInternals.addStaticJs(`
  window.socketPort = ${PORT};
`);

Meteor.startup(() => {
  let rootUrl = new URL(process.env.ROOT_URL);
  const protocol = rootUrl.protocol === "https:" ? "wss" : "ws";
  Meteor.settings.public.WS_URL = `${protocol}://${rootUrl.hostname}:${PORT}`;

  const server = http.createServer();
  const gameServer = new Server({ server, presence: new LocalPresence() });

  gameServer.define("lobby", LobbyRoom);

  gameServer.define("game", MyRoom).enableRealtimeListing();

  try {
    gameServer.listen(PORT);
  } catch (e) {
    console.error(e);
  }

});
