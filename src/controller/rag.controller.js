const OpenAI = require("openai");
const Document = require("../models/Document");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY

console.log({apiKey})
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create Embeddings
exports.createDocument = async (req, res) => {
    try {
        const { content } = req.body;

        // Generate embeddings using OpenAI
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: content,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Save to MongoDB
        const document = new Document({ content, embedding });
        await document.save();

        res.status(201).json({ message: "Document saved", document });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Query and Retrieval
exports.queryDocuments = async (req, res) => {
    try {
        const { query } = req.body;

        // Generate query embedding
        const queryResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: query,
        });
        const queryEmbedding = queryResponse.data[0].embedding;

        // Fetch stored documents and calculate similarity
        const documents = await Document.find({});
        const results = documents.map((doc) => {
            const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
            return { content: doc.content, similarity };
        });

        // Sort by similarity
        results.sort((a, b) => b.similarity - a.similarity);

        res.json(results.slice(0, 5)); // Return top 5 results
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cosine Similarity Function
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
