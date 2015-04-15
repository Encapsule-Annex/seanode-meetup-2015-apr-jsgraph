// e-breadth-first-shortest-path.js

var jsgraph = require('jsgraph');

var data = {
    jsgraph: {
        version: "0.3.0",
        directed: {
            vertices: [
                { vid: "root" },
                { vid: "item1" },
                { vid: "item2" },
                { vid: "item3" },
                { vid: "item4" },
                { vid: "item5" },
                { vid: "item6" }
            ],
            edges: [
                { uid: "root", vid: "item1" },
                { uid: "root", vid: "item2" },
                { uid: "item1", vid: "item3" },
                { uid: "item3", vid: "item4" },
                { uid: "item2", vid: "item5" },
                { uid: "item3", vid: "item6" }
            ]
        }
    }
};

var digraph = new jsgraph.DirectedGraph(data);

var verticesByExaminationOrder = [];

var visitorInterface = {
    initializeVertex: function(vertex, digraph) {
        console.log("initializeVertex on '" + vertex + "'.");
    },
    discoverVertex: function(vertex, digraph) {
        console.log("discoverVertex on '" + vertex + "'.");
    },
    startVertex: function(vertex, digraph) {
        console.log("startVertex on '" + vertex + "'.");
    },
    examineVertex: function(vertex, digraph) {
        console.log("examineVertex on '" + vertex + "'.");
        verticesByExaminationOrder.push(vertex);
    },
    treeEdge: function(vertexU, vertexV, digraph) {
        console.log("treeEdge on edge ['" + vertexU + "', '" + vertexV + "'].");
    },
    nonTreeEdge: function(vertexU, vertexV, disgraph) {
        console.log("nonTreeEdge on edge ['" + vertexU + "', '" + vertexV + "'].");
    },
    grayTarget: function(vertexU, vertexV, digraph) {
        console.log("grayTarget on edge ['" + vertexU + "', '" + vertexV + "'].");
    },
    blackTarget: function(vertexU, vertexV, digraph) {
        console.log("blackTarget on edge ['" + vertexU + "', '" + vertexV + "'].");
    },
    finishVertex: function(vertex, digraph) {
        console.log("finishVertex on '" + vertex + "'.");
    }
};


var bfsContext = jsgraph.directed.createBreadthFirstSearchContext(digraph, visitorInterface);

jsgraph.directed.breadthFirstSearch(digraph, bfsContext, "root", visitorInterface);

console.log("Vertices by examination order: [" + verticesByExaminationOrder.join(",") + "].");