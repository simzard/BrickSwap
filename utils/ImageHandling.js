/**
 * Created by martins on 6/4/16.
 */
var fs = require('fs');
var path = require('path');

function _uploadFiles(reqImage, postID) {

    var imgServerDir = path.join(__dirname, "../public/postImages/");

    var dir = imgServerDir + postID;
    // var dir = '../public/postImages/' + postID; //remember to change testDir to theID!!!

    //creates dir with name of post _id if dosn't already exist.
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var image = reqImage.replace(/^data:image\/(png|gif|jpeg);base64,/, '');

    //converts image in base64 format to buffer.
    var buff = new Buffer(image, 'base64');

    var endNumber = fs.readdirSync(dir).length;

    if (endNumber > 1) {
        endNumber = 1;
    }
    else {
        endNumber++;
    }

    var endPath = "/postImg_" + endNumber;

    /*  fs.writeFile(path.join(__dirname, savePath), buff, function (err) {
     if (err) {
     return err;
     }
     else {
     return savePath;
     }
     });*/
    console.log("slut i imgHandling");
    console.log(dir + endPath);

    fs.writeFileSync(dir + endPath, buff);
    return postID + endPath;
}

module.exports = {
    uploadFiles: _uploadFiles
}

