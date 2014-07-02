exports.index = function(req, res){
	console.log('csrf token');
    console.log(req.session._csrf);
    var model = {
        title : 'vision',
        description : 'a project based dashboard for github',
        author: 'vjunloc',
        user: req.isAuthenticated() ? req.user.displayName : '',
        csrftoken: req.csrfToken()
    };
    
    res.render('index.html', model);
};