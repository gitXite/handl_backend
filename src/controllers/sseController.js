const sseClients = [];

const sseHandler = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sseClients.push(sendEvent);

    req.on('close', () => {
        const index = sseClients.indexOf(sendEvent);
        if (index !== -1) sseClients.splice(index, 1); 
    });
};

const broadcastEvent = (event, data) => {
    sseClients.forEach(client => client({ event, data }));
};


module.exports = {
    sseHandler,
    broadcastEvent,
};
