const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// function which prompts the user for what action they should take
function ask() {
    inquirer
        .prompt({
            name: "whichproduct",
            type: "input",
            message: "Which item would you like to purchase?",

        })
        .then(function (answer, err) {
            var itemID = parseInt(answer.whichproduct);
            // console.log(itemID);
            inquirer
                .prompt({
                    name: "howmany",
                    type: "input",
                    message: "How many would you like to purchase?",

                })
                .then(function (answer, err) {
                    var amount = parseInt(answer.howmany);

                    connection.query("SELECT * FROM bamazon.products WHERE item_id = ?", [itemID], function (error, results, fields) {


                        // console.log(results);
                        var stock = results[0].stock_quantity;
                        var product = results[0].product_name;
                        var difference = stock - amount;
                        var total = amount * results[0].price;


                        if (amount <= stock) {

                            connection.query("UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?", [difference, itemID], function (error, results, fields) {


                                console.log("Your total is $" + total + " Thank you for your business!");


                                connection.end();
                            });


                        }

                        else {

                            console.log("Sorry there is an insufficient quantity! Please try again.");

                            connection.end();

                        }





                    });






                });

        });

};

connection.connect(function (err) {
    if (err) {

        console.log(err);
    }

    connection.query("SELECT * FROM products", function (err, result, fields) {

        console.table(result);

        ask();
    });

});



