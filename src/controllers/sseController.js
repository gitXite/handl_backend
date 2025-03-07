const sseClients = {};

const sseHandler = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { listId } = req.query;
    if (!listId) {
        res.status(400).end();
        return;
    }

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    if (!sseClients[listId]) {
        sseClients[listId] = [];
    }

    sseClients[listId].push(sendEvent);

    req.on('close', () => {
        sseClients[listID] = sseClients[listId].filter(client => client !== sendEvent);
        if (sseClients[listId].length === 0) {
            delete sseClients[listId];
        }
    });
};

const broadcastEvent = (listId, event, data) => {
    if (sseClients[listId]) {
        sseClients[listId].forEach(client => client({ event, data }));
    }
};


module.exports = {
    sseHandler,
    broadcastEvent,
};
