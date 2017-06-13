var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://dynamodb.eu-west-2.amazonaws.com"
});

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }

});
var docClient = new AWS.DynamoDB.DocumentClient();




function displayForm(res) {
    fs.readFile('sample_form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
                            });
        res.write(data);
        res.end();
                                                        });
                            }
function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();


    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
var table = "Acme";
var params = {
    TableName:table,
    Item:{
        "Sur_Name": fields.name,
        "Email": fields.email
        }
             }
    docClient.put(params, function(err, data) 
    {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
             } 
    else {
        console.log("Added item:", JSON.stringify(data, null, 2));
            } 
                                                    });


    });
    res.end();
}
server.listen(1185);
console.log("server listening on 1185");
