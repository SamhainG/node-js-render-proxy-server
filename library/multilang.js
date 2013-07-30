var config = require('config'),
    fs = require('fs'),
    file = require('./file'),
    reg_exp = new RegExp(config.multilanguage.open + config.multilanguage.word_key_symbols + config.multilanguage.close, 'g')
translates = require('./translates');

module.exports.generateMultilangTemplates = function generateMultilangTemplates(content, file_name, dir_name) {
    var matches = content.match(reg_exp),
        compile_dir = dir_name.replace(config.templates.dir, '');

    for (var lang_id in config.multilanguage.lang_codes) {
        var lang_code = config.multilanguage.lang_codes[lang_id],
            localized_content = content,
            localized_dir_name = config.templates.compiled_dir + lang_code + '/' + compile_dir,
            localized_file_name = file_name.replace('.', '_' + lang_code + '.');


        if (matches) {
            var word_keys_arr = [];
            matches.forEach(function (unprocessed_word) {
                var word_key = unprocessed_word
                    .replace(config.multilanguage.open, '')
                    .replace(config.multilanguage.close, '');
                word_keys_arr.push(word_key);
            });

            translates.getWords(word_keys_arr, lang_code, function (translates, lang_code) {
                var localized_dir_name = config.templates.compiled_dir + lang_code + '/' + compile_dir,
                    localized_file_name = file_name.replace('.', '_' + lang_code + '.');

                for (var word_key in translates) {
                    var unprocessed_word = config.multilanguage.open + word_key + config.multilanguage.close,
                        translate = translates[word_key];
                    localized_content = localized_content.replace(unprocessed_word, translate ? translate : word_key);
                }

                file.save(localized_dir_name, localized_file_name, localized_content, config.templates.encoding);
            });

        } else {
            file.save(localized_dir_name, localized_file_name, localized_content, config.templates.encoding);
        }
    }
}
