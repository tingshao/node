'use strict';
require('../common');
const http = require('http');
const net = require('net');
const Countdown = require('../common/countdown');

const big = Buffer.alloc(16 * 1024, 'A');

const COUNT = 1e4;

const countdown = new Countdown(COUNT, () => {
  server.close();
  client.end();
});

let client;
const server = http.createServer(function(req, res) {
  res.end(big, function() {
    countdown.dec();
  });
}).listen(0, function() {
  const req = 'GET / HTTP/1.1\r\n\r\n'.repeat(COUNT);
  client = net.connect(this.address().port, function() {
    client.write(req);
  });
  client.resume();
});
