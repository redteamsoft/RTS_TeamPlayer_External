module.exports = {
    open: function (filter, success, failure) {
        if (typeof filter === 'function') {
            failure = success;
            success = filter;
            filter = { "mime": "application/pdf" } ;
        }

        cordova.exec(success, failure, "FileChooser", "open", [ filter ]);
    }
};
