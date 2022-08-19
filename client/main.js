import { Meteor } from 'meteor/meteor';
import App from '../imports/ui/App.svelte';
// import { io } from "socket.io-client";
import * as Colyseus from "colyseus.js"

Meteor.startup(async () => {
  new App({
    target: document.getElementById('app')
  });

  // const PORT = window.socketPort || 3003;
  // let socket = io(':' + PORT, { transports: ["websocket"] });
  //
  // socket.on('connect', function() {
  //   console.log('Client connected');
  // });
  //
  // socket.on('disconnect', function() {
  //   console.log('Client disconnected');
  // });

  // var client = new Colyseus.Client('ws://localhost:' + PORT);
  //
  // const lobby = await client.joinOrCreate("lobby");
  //
  // lobby.onMessage("rooms", (rooms) => {
  //   console.log(rooms);
  // });
  //
  // const gameRoom = await client.joinOrCreate("game", { name: "glouglou"});
  //
  // gameRoom.onMessage("test", (message) => {
  //   console.log(message);
  // });
});