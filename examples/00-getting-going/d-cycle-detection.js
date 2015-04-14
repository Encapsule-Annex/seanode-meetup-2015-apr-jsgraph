// d-cycle-detection

var jsgraph = require('jsgraph');
var json = { "jsgraph":
             { "version": "0.3.0",
               "directed": {
                   "vertices": [
                       { "vid": "A", vprops: "Round" },
                       { "vid": "B", vprops: "and" },
                       { "vid": "C", vprops: "round" },
                       { "vid": "D", vprops: "we" },
                       { "vid": "E", vprops: "go!" }
                   ],
                   "edges": [
                       { uid: "A", vid: "B", eprops: "this is an edge from A to B" },
                       { uid: "B", vid: "C", eprops: "this is an edge from B to C" },
                       { uid: "C", vid: "D", eprops: "this is an edge from C to D" },
                       { uid: "D", vid: "E", eprops: "this is an edge from D to E" },
                       { uid: "E", vid: "C", eprops: "this is an edge from E to C (introduces a cycle)" }
                   ]
               }
             }
           };

var digraph = new jsgraph.DirectedGraph(json);
console.log(digraph.toJSON());

var visitorInterface = {

    discoverVertex: function(vertex, digraph) {
        console.log("Discovered vertex '" + vertex + "' labeled '" + digraph.getVertexProperty(vertex) + "'.");
    },

    backEdge: function(vertexU, vertexV, digraph) {
        console.log("Discovered a cycle from '" + vertexU + "' to vertex '" + vertexV + "' labeled '" + digraph.getEdgeProperty(vertexU, vertexV));
    }

};

var dfsSearchContext = jsgraph.directed.createDepthFirstSearchContext(digraph, visitorInterface);

// EXECUTE A DEPTH-FIRST SEARCH
jsgraph.directed.depthFirstSearch(digraph, visitorInterface, dfsSearchContext);


