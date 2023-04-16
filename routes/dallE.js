const express = require("express");
const { generateImages, generateText } = require("../controllers/dallE");
const router = express.Router();

router.get("/generate/:queryString", generateImages);
router.get("/generate-text", generateText);

module.exports = router;
