// c-depth-first-search.js

var jsgraph = require('jsgraph');
var json = { "jsgraph":
             { "version": "0.3.0",
               "directed": {
                   "vertices": [
                       { "vid": "Node.js" },
                       { "vid": "evening" },
                       { "vid": "Good" },
                       { "vid": "Seattle" },
                       { "vid": "!" }
                   ],
                   "edges": [
                       { "uid": "Node.js", "vid": "!" },
                       { "uid": "evening", "vid": "Seattle" },
                       { "uid": "Good", "vid": "evening" },
                       { "uid": "Seattle", "vid": "Node.js" }
                   ]
               }
             }
           };

var digraph = new jsgraph.DirectedGraph(json);
console.log(digraph.toJSON());

// DEFINE A VISITOR INTERFACE FOR DFS

var visitorInterface = {
    discoverVertex: function(vertexID, digraph) {
        console.log(vertexID);
    }
};

var dfsSearchContext = jsgraph.directed.createDepthFirstSearchContext(digraph, visitorInterface);

// EXECUTE A DEPTH-FIRST SEARCH
jsgraph.directed.depthFirstSearch(digraph, visitorInterface, dfsSearchContext);


