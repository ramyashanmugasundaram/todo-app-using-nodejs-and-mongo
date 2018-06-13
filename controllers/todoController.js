var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect(`mongodb://test:${encodeURIComponent('cts@2012')}@ds161574.mlab.com:61574/todo-app`);
//Create a schema
var todoSchema = new mongoose.Schema({
    item: String
});

//Create a model based on schema
var Todo = mongoose.model('Todo', todoSchema);

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function (app) {

    //handle routes and requests
    app.get('/todo', function (req, res) {
        //get data from mongodb and pass it to view
        Todo.find({}, function(err, data) {
            if(err) throw err;
            res.render('todo', { todos: data }); 
        });       
    });

    app.post('/todo', urlencodedParser, function (req, res) {
        //get data from view and pass it to mongodb
        var newTodo = Todo(req.body).save(function(err, data){
            if(err) throw err;
            res.json(data);
        });
    });

    app.delete('/todo/:item', function (req, res) {
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, ' ')}).remove(function(err, data){
            if(err) throw err;
            res.json(data);
        });
    });
    
}