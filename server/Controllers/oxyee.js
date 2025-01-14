const router = require("express").Router();
const bodyparser = require("body-parser");
const multer = require("multer");
const path = require("path");
const oxyy = require("../Models/oxyy");
const user = require("../Models/user");
// const user = require("../Models/user");
// const user = require("../Models/user");
var ObjectId = require("mongodb").ObjectId;
const storage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/create", upload.single("profile"), async function (req, res) {
  console.log("Respoonse: ", req.body);
  try {
    var data = new oxyy({
      RecipeName: req.body.RecipeName,
      Ingredients: req.body.Ingredients,
      Image:  `http://localhost:4000/profile/${req.file.filename}`,
      steps: req.body.steps,
      userId: req.body.id,
      Details: req.body.Details,
    });
    ////////////////////////// Insert data Into data base/////////////////////
    data.save(function (error, result) {
      //check error
      if (error) {
        return res.json({
          status: false,
          message: "database insert data fail...",
          error: error,
        });
      }
      console.log("result", result);
      return res.json({
        status: true,
        message: "Add new user in Database successfully",
        result: result,
      });
    });
  } catch (error) {
    res.json({
      message: "Something wents wrong",
      Error_Mesaage: error,
    });
  }
});
///////////////////////////////////////////////////////////////////////
router.get("/getall/:id", async function (req, res) {
  try {
    // console.log("hjkhjkhjkhjkhk");

    const { id } = req.params;
    // console.log(req.params.id);
    // console.log("=========", id);
    let data = await oxyy.find({ userId: id }).populate("userId");
    // console.log("DATA: ", data);
    // return res.status(200).send("OK");
    console.log("data", data);
    if (data) {
      res.json({
        message: "Your data is",
        data,
      });
      console.log("data", data);
    }
  } catch (error) {
    console.log("error", error);
    res.json({
      message: "Something wents wrong",
      Error_Mesaage: error,
    });
  }
});

router.get("/getall", async function (req, res) {
  try {
    let data = await oxyy.find().populate("userId");
    if (data) {
      res.json({
        message: "Your data ",
        data,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.json({
      message: "Something wents wrong",
      Error_Mesaage: error,
    });
  }
});

module.exports = router;
