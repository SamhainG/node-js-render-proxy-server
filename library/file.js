var fs = require('fs');

module.exports.save = function save(dir_name, file_name, file_content, encoding){
    dir_name.split('/').forEach(function(dir, dir_index, splitted_dirs){
        var sliced_dirs = splitted_dirs.slice(0, dir_index),
            current_dir = (sliced_dirs.length>0)?sliced_dirs.join('/'):dir;
        if(!fs.existsSync(current_dir)){
            fs.mkdirSync(current_dir);
        }
    });
    fs.writeFile(dir_name+file_name, file_content, encoding, function (err) {
        if (err) throw err;
    });
}
module.exports.read = function read(file_name, encoding, callback){
    fs.readFile(file_name, encoding, function (err, data) {
        if(err) throw err;
        if(typeof callback === 'function'){
            callback(data);
        }
    });
}
module.exports.exist = function exist(dir_name, file_name){
    return fs.existsSync(dir_name+file_name);
}
module.exports.removeFile = function removeFile(file_name){
    return fs.unlinkSync(file_name);
}
module.exports.files = function files(dir_name, callback){
    fs.readdir(dir_name, function (err, files) {
        if(err) throw err;
        if(typeof callback === 'function'){
            callback(files);
        }
    });
}
module.exports.isDirectory = function isDirectory(file){
    return fs.lstatSync(file).isDirectory();
}