const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Guns and Roses'));
bands.addBand(new Band('Red Hot Chilli Peppers'));
bands.addBand(new Band('Oasis'));

// Mensajes de sockets
io.on('connection', client => {
  console.log('Cliente conectado');

  client.emit('active_bands', bands.getBands());

  client.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  client.on('mensaje', (payload) => {
    // console.log('Mensaje!!!', payload.nombre);
    // para todo el servidor
    io.emit('mensaje', { admin: 'Admin mensaje' });
  });

  client.on('emitir_mensaje', (payload) => {
    // io.emit('nuevo_mensaje', payload); // Emite a todos
    // console.log('nuevo_mensaje', payload); // Emite a todos
    client.broadcast.emit('nuevo_mensaje', payload); // Emite a todos menos al que lo emitio
  });

  client.on('vote_band', (payload) => {
    // console.log('votacion para banda id:', payload);
    bands.voteBand(payload.id);
    io.emit('active_bands', bands.getBands());
  });

  client.on('new_band', (payload) => {
    // console.log('nueva banda: ', payload.nombre);
    bands.addBand(new Band(payload.nombre));
    io.emit('active_bands', bands.getBands());
  });

  client.on('delete_band', (payload) => {
    // console.log('borrar banda id: ', payload.id);
    bands.deleteBand(payload.id);
    io.emit('active_bands', bands.getBands());
  });
});