import { Meteor } from 'meteor/meteor';

import http from 'http';
// import { Server } from 'socket.io';
import {LocalPresence, Server} from "colyseus";
import { LobbyRoom } from "colyseus";
import {MyRoom} from "/imports/api/rooms/MyRoom";

const PORT = parseInt(process.env.SOCKET_PORT) || 3003;

// Client-side config
WebAppInternals.addStaticJs(`
  window.socketPort = ${PORT};
`);

Meteor.startup(() => {
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
