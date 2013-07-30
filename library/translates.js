var query = require('./query'),
    config = require('config'),
    file = require('./file'),
    translates = {};

module.exports.getWord = function getWord(word_id, lang_code, callback) {
    if(!translates[lang_code]){
        _getTranslates(lang_code, function () {
            if(typeof callback === 'function'){
                callback(translates[lang_code][word_id], lang_code);
            }
        });
    }else{
        if(typeof callback === 'function'){
            callback(translates[lang_code][word_id], lang_code);
        }
    }
}

module.exports.getWords = function getWords(word_ids, lang_code, callback){
    var word_translates = {};
    if(!translates[lang_code]){
        _getTranslates(lang_code, function () {
            word_ids.forEach(function(word_id){
                word_translates[word_id] = translates[lang_code][word_id];
            });
            if(typeof callback === 'function'){
                callback(word_translates, lang_code);
            }
        });
    }else{
        word_ids.forEach(function(word_id){
            word_translates[word_id] = translates[lang_code][word_id];
        });
        if(typeof callback === 'function'){
            callback(word_translates, lang_code);
        }
    }

}


function _getTranslates(lang_code, cb) {
    var current_hour = (new Date()).getHours(),
        translates_file_name = lang_code + '_' + current_hour + '.' + config.multilanguage.translate_file_type,
        translates_file_dir = config.multilanguage.translates_dir;
    translates[lang_code] = {};
    if (file.exist(translates_file_dir, translates_file_name)) {
        translates[lang_code] = require(translates_file_dir + translates_file_name);
        cb();
    } else {
        var qs = config.multilanguage.database_query(lang_code);;
        query(qs, function (err, rows, fields) {
            if (err) throw err;
            if (typeof cb === 'function') {
                if (rows) {
                    rows.forEach(function (row, index, array) {
                        translates[lang_code][row['word']] = row['text'];
                    });
                    file.files(translates_file_dir, function(files){
                        files.forEach(function(file_name){
                            if(file_name.indexOf(current_hour) < 0){
                                file.removeFile(translates_file_dir+file_name);
                            }
                        });
                        file.save(translates_file_dir, translates_file_name, JSON.stringify(translates[lang_code]));
                        cb();
                    });
                } else {
                    throw new Error('No words found by lang_code \'' + lang_code + '\'');
                }
            }
        });

    }
}