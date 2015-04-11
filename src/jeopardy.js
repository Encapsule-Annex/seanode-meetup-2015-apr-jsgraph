
var jsgraphd = require('jsgraph').directed;
var murmurhash = require('murmurhash-js');

var jeopardyDataSet = null;
var jeopardyGraph = jeopardyGraph = new jsgraphd.DirectedGraph();

var dimensions = [ 'record', 'category' , 'air_date', 'question', 'value', 'answer', 'round', 'show_number' ];
var dimensionHash = {}

var makeVertexId = function(string_) {
    var uint32 = murmurhash((new Buffer(string_, 'utf-8')).toString('ascii'));
    var buffer = new Buffer(4);
    buffer[0] = uint32 & 0xFF;
    buffer[1] = (uint32 & 0xFF00) >> 8;
    buffer[2] = (uint32 & 0xFF0000) >> 16;
    buffer[3] = (uint32 & 0xFF000000) >> 24;
    var utf8 = buffer.toString('base64');
    var tail = utf8.length
    while (utf8.charAt(tail - 1) == '=') {
        tail--;
    }
    return utf8.slice(0,tail);
};

var encodeRecord = function(recordNumber_) {
    var vertexIdRecord = makeVertexId("352df264-df76-11e4-be1c-080027d17300:" + recordNumber_.toString());
    jeopardyGraph.addVertex(vertexIdRecord, { value: recordNumber_, type: "value", dimension: "record" } );
    jeopardyGraph.addEdge(dimensionHash["record"], vertexIdRecord, { type: "association", semantics: "dimension" } );
    return vertexIdRecord;
};

var encodeValueOnDimension = function(value_, dimension_) {
    var vertexIdValue = makeVertexId(value_);
    jeopardyGraph.addVertex(vertexIdValue, { value: value_, type: "value", dimension: dimension_ });
    jeopardyGraph.addEdge(dimensionHash[dimension_], vertexIdValue, { type: "association", semantics: "dimension" } );
    return vertexIdValue;
};

var getDataSet = function() {
    if (!((jeopardyDataSet != null) && jeopardyDataSet)) {
        console.log("Loading the Jeopardy quiz show data set. Please wait. It's big...");
        jeopardyDataSet = require('../data/jeopardy');
        console.log("Load complete. There are " + jeopardyDataSet.length + " records in the Jeopardy data set.");
        console.log("Building in-memory hyperdimensional database. Please wait. It's big...");

        dimensions.forEach(function(dimension_) {
            dimensionHash[dimension_] = makeVertexId(dimension_);
        });
        console.log(JSON.stringify(dimensionHash));


        dimensions.forEach(function(dimension_) {
            var vertexId = murmurhash(dimension_);
            jeopardyGraph.addVertex(vertexId, { value: dimension_, type: "dimension" });
        });

        var recordCount = 0;

        jeopardyDataSet.forEach(function(record_) {
            var vertexIdRecord = encodeRecord(recordCount++);
            dimensions.forEach(function(dimension_) {
                var value = record_[dimension_];
                if (!((value != null) && value)) {
                    value = "<missing value>";
                };
                var vertexIdValue = encodeValueOnDimension(value, dimension_);
                jeopardyGraph.addEdge(vertexIdRecord, vertexIdValue, { type: "association", semantics: "record" } );
            });
        });

        console.log("While processing the input dataset, we discovered " + jeopardyGraph.inDegree(makeVertexId("<missing value>")) + " record properties with null or undefined values.");
        console.log("There have a total of " + jeopardyGraph.outDegree(dimensionHash["category"]) + " different Q&A categories in the dataset.");

        console.log("The generated directed graph container contains " + jeopardyGraph.verticesCount() + " vertices and " + jeopardyGraph.edgesCount() + " edges.");

    }
    return {
        data: jeopardyDataSet,
        graph: jeopardyGraph
    };
};


module.exports = getDataSet;

/*
var categoryEdges = jeopardyGraph.outEdges(dimensionHash["category"]);

categoryEdges.forEach(function(edge_) {
    console.log(JSON.stringify(edge_));

    uProp = jeopardyGraph.vertexPropertyObject(edge_.u);
    vProp = jeopardyGraph.vertexPropertyObject(edge_.v);

    console.log("v property: " + JSON.stringify(uProp));
    console.log("u property: " + JSON.stringify(vProp));


    var categoryName = jeopardyGraph.vertexPropertyObject(edge_.u).value;
    var categoryValue = jeopardyGraph.vertexPropertyObject(edge_.v).value;

    var categoryValueId = makeVertexId(categoryValue);

    console.log(JSON.stringify(jeopardyGraph.vertexPropertyObject(edge_.v)));
});

*/
