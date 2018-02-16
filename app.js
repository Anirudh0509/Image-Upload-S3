var express = require('express');
var app = express();
var multer = require('multer'); // extract the image from the POST request body
var AWS = require('aws-sdk'); // The AWS-SDK includes the API of the AWS components
var fs = require('fs'); // read files from the disk
var bodyParser= require('body-parser');

AWS.config.update({
  region: "us-east-2",
   accessKeyID: 'AKIAJUZAYCBIAOY65SIQ',
   secretAccessKey: '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',
});

app.use(bodyParser.text());

var photoBucket = new AWS.S3({params: {Bucket: 'elasticbeanstalk-us-east-2-205654503547'}});
var upload = multer().single('file');

app.get('/upload/image', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/upload/image',upload, function(req,res){

  var key = 'uploads/' + req.file.originalname.toString();
  //Upload to the S3 bucket via AWS-SDK.
  photoBucket.upload({
        ACL: 'public-read',    //File has public read access.
        Body: req.file.buffer, //The image itself.
        Key: key, //File path
        ContentType: 'application/octet-stream'
     }).send(function(err,data) {
           if(err) {
              return res.end(err);
           }
           res.end("Fileuploaded to S3!");
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
