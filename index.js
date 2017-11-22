var express = require('express');
var multer = require('multer');
var cors = require('cors');
var streamifier = require('streamifier');
var htmlConvert = require('html-convert');

const format = 'jpeg';

var app = express();
var upload =  multer({storage: multer.memoryStorage()});
var convert = htmlConvert({
    format: format,
    width: 1024
});

app.use(cors());

app.post('/', upload.single('arquivo'), function(req, res, next) {

    res.writeHead(200, {
        'Content-Type' : 'image/' + format
    });

    var html = req.file.buffer.toString('utf8');
    html += '<script> if ( document.getElementsByTagName(\'body\')[0].style.backgroundColor == "") { document.getElementsByTagName(\'body\')[0].style.backgroundColor = "white"; }</script>';

    streamifier.createReadStream(html).pipe(convert()).pipe(res);
});

app.listen(3000, function() {
    console.log('Escutando na porta 3000...');
})