module.exports = {
    "proxy_settings": {
        "pathnameOnly": true,
        "changeOrigin" : true,
        "enable" : {
            xforward: false
        },
        "timeout": 5000,
        "router": "./config/routes.json"
    },
    "server_settings" : {
        "listen" : 3000
    },
    "template_engine": {
        "root": "templates_c/",
        "open": "{",
        "close": "}"
    },
    "templates": {
        "dir": "templates/",
        "compiled_dir": "templates_c/",
        "extension" : "ect",
        "encoding": "utf8",
        "minimize": {
            "enable" : true
        },
        "query_param" : "t"
    },
    "multilanguage": {
        "enable" : true,
        "open" : "##",
        "close" : "##",
        "word_key_symbols" : '[A-Za-z_]*',
        "translates_dir" : "translates/",
        "translate_file_type" : "json",
        "lang_ids" : [2,4],
        "lang_codes" : {
            "2" : "ru",
            "4" : "ukr"
        },
        "query_param" : "lang_code",
        "getTranslates" : function(lang_code, cb){
            if(typeof cb === 'function')
                cb(null ,{
                    "ru" : {
                        "hello" : "Привет"
                    },
                    "ukr" : {
                        "hello" : "Привiт"
                    }
                }[lang_code]);
        }
    },
    "database" : {
        "host" : "localhost",
        "user" : "test",
        "password" : "password"
    },
    "minimizer": {
        "removeComments": true,
        "removeCommentsFromCDATA": true,
        "collapseWhitespace": true,
        "collapseBooleanAttributes": true,
        "removeAttributeQuotes": true,
        "removeEmptyAttributes": true
    }
}