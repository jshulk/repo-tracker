exports.index = function(req, res){
    var model = {
        title : 'vision',
        description : 'a project based dashboard for github',
        author: 'vjunloc',
        user: 'vjunloc'
    };
    
    res.render('index.html', model);
};