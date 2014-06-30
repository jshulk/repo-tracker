exports.index = function(req, res){
	console.log('req.user');
	console.log(req.user);
	console.log(req.isAuthenticated() );
    var model = {
        title : 'vision',
        description : 'a project based dashboard for github',
        author: 'vjunloc',
        user: req.isAuthenticated() ? req.user.displayName : ''
    };
    
    res.render('index.html', model);
};