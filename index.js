const csvToJson = require('csvtojson');
const fs = require('fs');
const websocket = require('websocket-stream')
const http = require('http');

const slowStream = require('slow-stream');

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.write('--Listening--');
    res.end();
})

const ws = websocket.createServer({
    server:server,
    perMessageDeflate: false,
    objectMode:true
}, (stream,request)=>{
    fs.createReadStream('./data/DEOK_hourly.csv',{ bufferSize: 64 })
    .pipe(csvToJson())
    .pipe(new slowStream ({ maxWriteInterval: 5 })) // replicate real time processing
    .pipe(stream);
})

server.listen(process.env.PORT||8902);
