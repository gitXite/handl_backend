const { broadcastEvent } = require('../controllers/sseController');


const updateShoppingList = (listId, updates) => {
    // update database here
    
    const updatedList = { id: listId, ...updates };
    broadcastEvent(listId, 'list-updated', updatedList);
    
    return updatedList;
};


module.exports = { updateShoppingList };
