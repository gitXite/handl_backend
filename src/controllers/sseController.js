let clients = [];

const sseHandler = (req, res) => {
    res.setheader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
};

const broadcastEvent = (data) => {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};


module.exports = {
    sseHandler, 
    broadcastEvent,
}