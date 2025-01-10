// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("Node-Api");

// // Find a document in a collection.
// db.getCollection("events").findOne({

// });
db.events.dropIndex("username_1")