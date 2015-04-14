
var jsgraphd = require('jsgraph').directed;
var hashUTF8 = require('./hashutf8');
var loadJeopardy = require('./jeopardy-data');

var jeopardyGraph = null;
var dimensions = [ 'record', 'category' , 'air_date', 'question', 'value', 'answer', 'round', 'show_number' ];
var dimensionHash = {}

var encodeRecord = function(recordNumber_) {
    var vertexIdRecord = hashUTF8("352df264-df76-11e4-be1c-080027d17300:" + recordNumber_.toString());
    jeopardyGraph.addVertex(vertexIdRecord, { value: recordNumber_, type: "value", dimension: "record" } );
    jeopardyGraph.addEdge(dimensionHash.record, vertexIdRecord, { type: "association", semantics: "dimension" } );
    return vertexIdRecord;
};

var encodeValueOnDimension = function(value_, dimension_) {
    var vertexIdValue = hashUTF8(value_);
    jeopardyGraph.addVertex(vertexIdValue, { value: value_, type: "value", dimension: dimension_ });
    jeopardyGraph.addEdge(dimensionHash[dimension_], vertexIdValue, { type: "association", semantics: "dimension" } );
    return vertexIdValue;
};

module.exports = function() {

    if ((jeopardyGraph != null) && jeopardyGraph) {
        return jeopardyGraph;
    };

    jeopardyGraph = new jsgraphd.DirectedGraph();

    dimensions.forEach(function(dimension_) {
        var hash = dimensionHash[dimension_] = hashUTF8(dimension_);
        jeopardyGraph.addVertex(hash, { value: dimension_, type: "dimension" });
    });

    console.log("Data dimensions: " + JSON.stringify(dimensionHash));
    console.log("Base graph: " + JSON.stringify(jeopardyGraph, undefined, 4));

    jeopardyData = loadJeopardy();
    console.log("Load complete. There are " + jeopardyData.length + " records in the Jeopardy data set.");

    console.log("Building in-memory directed graph representation of the Jeopardy Q&A database. Please wait, big.");
    console.log("Data dimensions: " + JSON.stringify(dimensionHash));

    var recordCount = 0;

    jeopardyData.forEach(function(record_) {
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

    console.log("While processing the input dataset, we discovered " + jeopardyGraph.inDegree(hashUTF8("<missing value>")) + " record properties with null or undefined values.");
    console.log("There have a total of " + jeopardyGraph.outDegree(dimensionHash["category"]) + " different Q&A categories in the dataset.");

    console.log("The generated directed graph container contains " + jeopardyGraph.verticesCount() + " vertices and " + jeopardyGraph.edgesCount() + " edges.");

    return {
        dimensions: dimensions,
        dimensionHashes: dimensionHash,
        digraph: jeopardyGraph
    };
};


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
