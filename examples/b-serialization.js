// b-serialization.js

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

console.log("INITIAL GRAPH DATA DUMP");
console.log(digraph.toJSON(undefined,4));

var moreGraphData = { jsgraph: { version: "0.3.0", directed: {
    vertices: [
        { vid: "another" },
        { vid: "something else" }
    ],
    edges: [
        { uid: "evening", vid: "another" }
    ]
}}};

console.log("POST JSON DATA IMPORT DUMP");
digraph.importJSON(moreGraphData);
console.log(digraph.toJSON(undefined,4));
