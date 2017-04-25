var cleanRoom = function() {
    return new Promise(function(resolve, reject) {
        resolve('Cleaned The Room');
    });
};

var removeGarbage = function(message) {
    return new Promise(function(resolve, reject) {
        resolve(message + ' remove Garbage');
    });
};

var winIcecream = function(message) {
    return new Promise(function(resolve, reject) {
        resolve(message + ' won Icecream');
    });
};

cleanRoom().then(function(result) {
    return removeGarbage(result);
}).then(function(result) {
    return winIcecream(result);
}).then(function(result) {
    console.log('finished ' + result);
})
