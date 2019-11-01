var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    Products();
});


function Products() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (product) {
            console.log("Item Number: " + product.item_id + ", " + product.product_name + ", Price: $" + product.price + ",  Quantity: " + product.stock_quantity);
        })
        console.log("============")
        getOrder();
    });
}

function getOrder() {
    inquirer.prompt([

        {
            type: "input",
            name: "supply",
            message: "What do you want?"
        },
        {
            type: "input",
            name: "supply",
            message: "How much do you want?"
        }

    ]).then(function (ans) {
        console.log("Item Id: " + ans.item);
        console.log("Quantity: " + ans.amount);
        var itemChoice = ans.item;
        var amountChoice = ans.amount;

        connection.query("SELECT stock_quantity FROM products WHERE item_id = " + itemChoice, function (err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                if (results[i].stock_quantity >= amountChoice) {
                    var newQuantity = results[i].stock_quantity - amountChoice;
                    connection.query('UPDATE products SET stock_quantity = ' + newQuantity + ' WHERE item_id = ' + itemChoice);
                    connection.query("SELECT price FROM products WHERE item_id = " + itemChoice, function (err, results) {
                        console.log("Your total is: $" + results[0].price * amountChoice);
                        connection.end();
                    })
                } else {
                    console.log("We're out try again next time!");
                    connection.end();
                }
            }
        });
    });
};

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    listProduct();
});