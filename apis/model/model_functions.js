const moment  =require('moment');
var functions = {
    ts_string: function(timestamp) {
        if (timestamp == undefined || timestamp == '') {
            return undefined;
        } else {
            console.log("timestamp ", timestamp)
            var momentObj = moment.unix(timestamp);
            console.log("moment ", momentObj.format())
            return momentObj.format();
        }
    },
    string_ts: function(dateObj) {
        if (dateObj == undefined || dateObj == '') {
            return undefined;
        } else {
            return Math.floor(dateObj.getTime() / 1000);
        }
    },
    next_birthday: function(dateObj) {
        if (dateObj == undefined || dateObj == '') {
            return undefined;
        } else {
            return Math.floor(dateObj.getTime() / 1000);
        }
    }
}

module.exports.functions = functions;
