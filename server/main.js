import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import http from 'http';
import {LocalPresence, Server} from "colyseus";
import { LobbyRoom } from "colyseus";
import {MyRoom} from "/imports/api/rooms/MyRoom";
import { URL } from "url";

const PORT = parseInt(process.env.WS_PORT) || 3000;

Meteor.startup(() => {
  let rootUrl = new URL(process.env.ROOT_URL);
  Meteor.settings.public.WS_URL = `${rootUrl.protocol.replace("http", "ws")}//${rootUrl.hostname}:${PORT}`;

  const gameServer = new Server({ server: WebApp.httpServer, presence: new LocalPresence() });

  gameServer.define("lobby", LobbyRoom);

  gameServer.define("game", MyRoom).enableRealtimeListing();
});
