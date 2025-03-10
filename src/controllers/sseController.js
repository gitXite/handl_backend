const { getUserBySharedLists } = require('../services/sseService');
const sseClients = {};

const sseHandler = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const userId = req.user?.id;
    if (!userId) {
        res.status(401).end();
        return;
    }

    try {
        const userLists = await getUserBySharedLists(userId);

        res.write(`data: ${JSON.stringify({ event: 'connected', message: 'SSE connected' })}\n\n`);

        const sendEvent = (event, data) => {
            res.write(`data: ${JSON.stringify({ event, data })}\n\n`);
        };

        userLists.forEach(listId => {
            if (!sseClients[listId]) {
                sseClients[listId] = [];
            }
            sseClients[listId].push(sendEvent);
        });

        req.on("close", () => {
            try {
                userLists.forEach(listId => {
                    if (sseClients[listId]) {
                        sseClients[listId] = sseClients[listId].filter(client => client !== sendEvent);
                        // Clean up if no clients are left for the list
                        if (sseClients[listId].length === 0) {
                            delete sseClients[listId];
                        }
                    }
                });
            } catch (error) {
                console.error('Error cleaning up SSE clients:', error);
            }
        });
    } catch (error) {
        console.error('Error retrieving user lists:', error);
        res.status(500).end();
    }
};

const broadcastEvent = (listId, event, data) => {
    if (sseClients[listId]) {
        sseClients[listId].forEach(client => client(event, data));
    }
};


module.exports = {
    sseHandler,
    broadcastEvent,
};
