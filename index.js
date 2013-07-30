var ECT = require('ect'),
    config = require('config'),
    renderer = ECT(config.template_engine),
    httpProxy = require('http-proxy'),  // https://github.com/nodejitsu/node-http-proxy
    http = require('http'),
    file = require('./library/file'),
    multilang = require('./library/multilang'),
    url = require('url'),
    htmlminifier = require('html-minifier'); // https://npmjs.org/package/html-minifier

function generateTemplates(cb) {

    readTemplateDir(config.templates.dir)

    if (typeof cb === 'function') {
        cb();
    }
}

function readTemplateDir(dir_name) {
    file.files(dir_name, function(files){
        files.forEach(function (file_name) {
            if (file.isDirectory(dir_name + file_name)) {
                readTemplateDir(dir_name + file_name + '/');
            } else {
                file.read(dir_name + file_name, config.templates.encoding, function (data) {
                    if (config.templates.minimize.enable) {
                        data = htmlminifier.minify(data, config.minimizer);
                    }
                    if (config.multilanguage.enable) {
                        multilang.generateMultilangTemplates(data, file_name, dir_name);
                    } else {
                        //Если мультиязычность отключена
                    }
                });
            }
        });
    });
}


generateTemplates(function () {
    /**
     * Сервер-шаблонизатор. Проксирует запрос на JSON-сервер, и результат ответа шаблонизирует
     *
     * @example http://localhost:3000/
     * @type {*|http.Server|http.Server}
     */
    var server = httpProxy.createServer(
        function (req, res, next) {
            var request_url = req.url,
                request_params = url.parse(request_url, true).query,
                template_name = request_params[config.templates.query_param],
                lang_code = request_params[config.multilanguage.query_param];

                if(template_name){
                    var _write = res.write,
                        _setHeader = res.setHeader,
                        template_full_path = (lang_code?lang_code:'ru')+'/'+template_name+'_'+(lang_code?lang_code:'ru')+'.'+config.templates.extension;
                    res.write = function (data) {
                        var html = renderer.render(template_full_path, {
                            "data" : JSON.parse(data.toString())
                        }); //Получаем отрендеренный html
                        _write.call(res, html);
                    }
                    res.setHeader = function (header_name, header_value) { //Устанавливаем правильные заголовки
                        _setHeader.call(res, "Content-Type", "text/html");
                    }
                }
            next();
        },
        config.proxy_settings
    ).listen(config.server_settings.listen);

    server.proxy.on('start', function(req, res, next){
        delete req.headers['accept-encoding'];
    });
    server.proxy.on('proxyError', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
    });
    server.proxy.on('end', function (err, req, res) {
    });

});
