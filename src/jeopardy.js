
var jsgraphd = require('jsgraph').directed;
var murmurhash = require('murmurhash-js');

console.log("... loading Jeopardy dataset from disc.");
var jeopardyDataSet = require('../data/jeopardy');

console.log("There are " + jeopardyDataSet.length + " records in the Jeopardy data set.");

console.log("... encoding data set as an in-memory mathematical graph.");
var jeopardyGraph = new jsgraphd.DirectedGraph();

var makeVertexId = function(string_) {
    var uint32 = murmurhash((new Buffer(string_, 'utf-8')).toString('ascii'));
    var buffer = new Buffer(4);
    buffer[0] = uint32 & 0xFF;
    buffer[1] = (uint32 & 0xFF00) >> 8;
    buffer[2] = (uint32 & 0xFF0000) >> 16;
    buffer[3] = (uint32 & 0xFF000000) >> 24;
    utf8 = buffer.toString('base64');
    tail = utf8.length
    pads = 0
    while (utf8.charAt(tail - 1) == '=') {
        tail--;
    }
    return utf8.slice(0,tail);
};

var dimensions = [ 'record', 'category' , 'air_date', 'question', 'value', 'answer', 'round', 'show_number' ];
var dimensionHash = {}
dimensions.forEach(function(dimension_) {
    dimensionHash[dimension_] = makeVertexId(dimension_);
});
console.log(JSON.stringify(dimensionHash));

dimensions.forEach(function(dimension_) {
    var vertexId = murmurhash(dimension_);
    jeopardyGraph.addVertex(vertexId, { value: dimension_, type: "dimension" });
});

var encodeRecord = function(recordNumber_) {
    
    var vertexIdRecord = makeVertexId(record_);
    jeopardyGraph.addVertex(vertexIdRecord, { value: record_, type: "value", dimension: "record" } );
    jeopardyGraph.addEdge(dimensionHash["record"], vertexIdRecord, { type: "association", semantics: "dimension" } );

};



var encodeValueOnDimension = function(value_, dimension_, record_) {

    var vertexIdValue = makeVertexId(value_);
    jeopardyGraph.addVertex(vertexIdValue, { value: value_, type: "value", dimension: dimension_ });
    jeopardyGraph.addEdge(dimensionHash[dimension_], vertexIdValue, { type: "association", semantics: "dimension" } );
};

recordCount = 0

jeopardyDataSet.forEach(function(record_) {

    recordKey = "352df264-df76-11e4-be1c-080027d17300:" + recordCount.toString();

    dimensions.forEach(function(dimension_) {
        value = record_[dimension_];
        if (!((value != null) && value)) {
            value = "<missing value>";
        };
        encodeValueOnDimension(value, dimension_, recordKey);
    });
});

console.log("While processing the input dataset, we discovered " + jeopardyGraph.inDegree(makeVertexId("<missing value>")) + " record properties with null or undefined values.");

console.log("There have a total of " + jeopardyGraph.outDegree(dimensionHash["category"]) + " different Q&A categories in the dataset.");


var categoryQuestions: {}

var categoryEdges = jeopardyGraph.outEdges(dimensionHash["category"]);

categoryEdges.forEach(function(edge_) {
    var categoryName = jeopardyGraph.vertexPropertyObject(edge_.u).value;
    var categoryValue = jeopardyGraph.vertexPropertyObject(edge_.v).value;

    var categoryValueId = makeVertexId(categoryValue);


    

    console.log(JSON.stringify(jeopardyGraph.vertexPropertyObject(edge_.v)));
});





