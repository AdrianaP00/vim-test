const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    embedding: { type: [Number], required: true } // Store OpenAI embeddings
});

module.exports = mongoose.model("Document", DocumentSchema);