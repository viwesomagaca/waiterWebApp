const mongoose = require('mongoose');
module.exports = function(mongoUrl) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl);

    const availability = mongoose.model('availability', {
        name: String,
        Day:[]
    })

    return {
    availability
    };
}
