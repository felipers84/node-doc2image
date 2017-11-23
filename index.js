var express = require('express');
var multer = require('multer');
var cors = require('cors');
var streamifier = require('streamifier');
var htmlConvert = require('html-convert');

const format = 'jpeg';

var app = express();
var upload = multer({storage: multer.memoryStorage()});
var convert = htmlConvert({
    format: format,
    width: 1024
});

app.use(cors());

app.post('/', upload.single('arquivo'), function (req, res, next) {





    if (req.file.mimetype.indexOf('html') > -1) {
        try {
            console.log('Arquivo HTML detectado.');
            var html = req.file.buffer.toString('utf8');
            html += '<script> if ( document.getElementsByTagName(\'body\')[0].style.backgroundColor == "") { document.getElementsByTagName(\'body\')[0].style.backgroundColor = "white"; }</script>';
            console.log(html);
            console.log(new Date().toUTCString() + ' - Retornando imagem para o client...');
            res.writeHead(200, {
                'Content-Type': 'image/' + format
            });
            streamifier.createReadStream(html)
                .pipe(convert()).pipe(res);
        }
        catch (exception) {
            const msgErro = new Date().toUTCString() + ' - Ocorreu um erro: ' + JSON.stringify(exception);
            console.error(msgErro);
            res.status(500).send({ erro: msgErro});
        }

    }
    else {
        const msgErro = new Date().toUTCString() + ' - Arquivo enviado não suportado!';
        console.log(msgErro);
        res.status(500).send({erro: msgErro});
    }
});

app.listen(3000, function () {
    console.log('Escutando na porta 3000...');
})