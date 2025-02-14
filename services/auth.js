const sessionIdToUserMap  = new Map();

function setUser(id, employee){
    sessionIdToUserMap.set(id, employee)
}

function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {setUser,getUser};