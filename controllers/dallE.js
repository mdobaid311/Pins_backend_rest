const { OpenAIApi, Configuration } = require("openai");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const request = require("request");
var path = require("path");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

var download = function (uri, filename, callback) {
  console.log("download  ");

  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

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

const generateImages = async (req, res) => {
  console.log("generateImages");
  const queryString = req.params.queryString;
  const images = await openai.createImage({
    prompt: queryString,
    n: 2,
    size: "1024x1024",
  });

  download(images.data.data[0].url, "tmp/test.png", async function () {
    console.log("download callback");

    const data = await uploadImage(
      path.join(path.dirname(require.main.filename), "/tmp/test.png")
    );

    res.status(200).json(data);
  });

  // res.status(201).json("url");
};

module.exports = generateImages;
