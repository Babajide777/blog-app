let express = require("express"),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose')
	methodOverride = require('method-override');

const expressSanitizer = require('express-sanitizer');


let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/blogapp', { useNewUrlParser: true, useUnifiedTopology: true } );


const blogappSchema = new Schema({
	name: {type: String},
    image: {type: String},
    body: {type: String},
    dateCreated: {type: Date, default: Date.now}
});


const blogapp = mongoose.model("blogapp", blogappSchema);

/*
blogapp.create({
    name: "Test dog blogpost",
    image: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=300",
    body: "Hi, this is the first dog blogpost"
});

*/

app.get('/', (req, res) => {
	res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {

    blogapp.find({}, (err, blogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});	
});

app.get('/blogs/new', (req, res) => {
	res.render("new");
});

app.get('/blogs/:id', (req, res) => {

	blogapp.findById(req.params.id, (err, foundblog) =>{
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render("show", {foundblog: foundblog});
		}
	})
    
});


app.get('/blogs/:id/edit', (req, res) => {

	blogapp.findById(req.params.id, (err, foundblog) =>{
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render("edit", {foundblog: foundblog});
		}
	})

});



app.post('/blogs', (req, res) => {

	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	blogapp.create(req.body.blog, function (err, blogs) {
		if (err) {
			res.render("new");
		} else {
			res.redirect('/blogs');
		}
	});
	
});

app.put('/blogs/:id', (req, res) => {
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	

	blogapp.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedblog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/'+ req.params.id);
		}
	}
		
		);
    
});


app.delete('/blogs/:id', (req, res) => {

	blogapp.findByIdAndRemove(req.params.id, function (err, updatedblog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	}
		
		);
    
});


app.listen(3000, () => { 
    console.log('Server listening on port 3000'); 
  });