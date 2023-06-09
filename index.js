let express = require('express');
let mongoose = require('mongoose');
let flash = require('connect-flash');
let methodOverride = require('method-override');
let app = express();
let path = require('path');
let session = require('express-session');
let passport = require('passport');
let localStrategy = require('passport-local');
mongoose
	.connect('mongodb+srv://admin:admin@cluster0.pqmjn5f.mongodb.net/?retryWrites=true&w=majority')
	.then(function() {
		console.log('db working');
	})
	.catch(function(err) {
		console.log(err);
	});

app.use(
	session({
		secret: 'SuperSecretPasswordForHireHub',
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			// secure: true,
			expires: Date.now() + 1000 * 60 * 60 * 24,
			maxAge: 1000 * 60 * 60 * 24
		}
	})
);

let User = require('./models/user-DB');
// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});
// import router
let jobRoutes = require('./routes/jobs.js');
let notifRoutes = require('./routes/notifications.js');
let authRoutes = require('./routes/auth');
let userRoutes = require('./routes/user');
app.use(jobRoutes);
app.use(notifRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.listen(3000, function() {
	console.log('server started on port 3000');
});