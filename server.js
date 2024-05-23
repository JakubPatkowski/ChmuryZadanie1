
const http = require('http');
const os = require('os');

// Dane autora
const author = {
    name: 'Jakub Patkowski',
    port: 8080,
};

// Logowanie informacji o uruchomieniu serweraa
const logServerStart = () => {
    const startDate = new Date();
    console.log(`Serwer uruchomiony: ${startDate}`);
    console.log(`Autor: ${author.name}`);
    console.log(`Port: ${author.port}`);
};

async function getDate(){
    const response = await fetch(`https://api-bdc.net/data/timezone-by-ip?ip=${clientIp}&key=bdc_b4f261d654fb4c7fb0f47af5a46a4878`)
    const data = await response.json();
    const timeZone = data.ianaTimeId;
    return new Date().toLocaleString("en", {timeZone: timeZone}) + " " + timeZone;

}

const server = http.createServer(async (req, res) => {
    clientIp = req.socket.remoteAddress;

    clientDate = new Date;

    
    if (clientIp == "::1" || clientIp=="::ffff:172.17.0.1") {
        clientDate = new Date;
    } else {
        clientDate = await getDate();
 
    }
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Adres IP klienta: ${clientIp}\n Data i godzina: ${clientDate}\n`);
    res.end();
});

server.listen(8080, () => {
    logServerStart();
    
});