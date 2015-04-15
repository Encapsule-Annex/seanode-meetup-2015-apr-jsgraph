// seanode-meetup-2015-apr-jsgraph/examples/00-getting-going/a-construction.js
//

var jsgraph = require('jsgraph');
var DirectedGraph = jsgraph.DirectedGraph;

console.log("Create an empty DirectedGraph container...");
var graph1 = new DirectedGraph();

// Export the contents of the DirectedGraph container to a JSON string.
console.log("The graph contains " + graph1.verticesCount() + " and " + graph1.edgesCount() + " edges.");
console.log("... the empty DirectedGraph container JSON: '" + graph1.toJSON() + "'.");

// Create a graph as a JSON 
var digraphJSON = require('./hello');
console.log("Creating a 2nd graph container from JSON:");
console.log("... source JSON: '" + digraphJSON + "'.");

var graph2 = new DirectedGraph(digraphJSON);

console.log("The digraph contains " + graph2.verticesCount() + " vertices.");
console.log("The digraph contains " + graph2.edgesCount() + " edges.");
console.log("The root vertex set is: '" + JSON.stringify(graph2.getRootVertices()) + "'.");
console.log("The left vertex set is: '" + JSON.stringify(graph2.getLeafVertices()) + "'.");









