const { OpenAIApi, Configuration } = require("openai");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const request = require("request");
var path = require("path");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadImage = async (url) => {
  console.log("uploadImage");

  const result = await cloudinary.uploader.upload(url, {
    use_filename: true,
    folder: "skai",
  });
  // console.log(result);
  fs.unlinkSync(url);
  return {
    image: {
      src: result.secure_url,
    },
  };
};

var download = function (uri, filename, callback) {
  console.log("download  ");

  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

const generateImages = async (req, res) => {
  const queryString = req.params.queryString;
  const images = await openai.createImage({
    prompt: queryString,
    n: 1,
    size: "512x512",
  });
  console.log(queryString);

  const imageUri = images.data.data[0].url;

  // Upload the image directly to Cloudinary
  cloudinary.uploader.upload(
    imageUri,
    { folder: "skai", use_filename: true },
    async (error, result) => {
      if (error) {
        console.error("Error uploading image to Cloudinary:", error);
        res.status(500).json({ error: "Error uploading image" });
      } else {
        console.log("Image uploaded successfully");
        res.status(200).json(result);
      }
    }
  );
};

const generateText = async (req, res) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "can you tell me a text to generate a realistic image using dall e 2",
    max_tokens: 100,
  });
  console.log(response);
  res.status(201).json(response.data.choices[0].text.trim());
};

module.exports = { generateImages, generateText };
