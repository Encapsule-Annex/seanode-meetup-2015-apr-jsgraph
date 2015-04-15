// load-jeopardy.js
//

module.exports = function() {
    console.log("Loading Jeopardy Q&A database from JSON file. Please wait...");
    jeopardyDataSet = require('./jeopardy');
    console.log("... Loaded " + jeopardyDataSet.length + " records.");
    return jeopardyDataSet;
};
