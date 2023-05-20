const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb://localhost/listDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schemas
const schema = {
  name: String
};

const listSchema = {
  name: String,
  list: [schema]
};

// Models
const ItemModel = mongoose.model("Item", schema);

const ListModel = mongoose.model("List", listSchema);

// Values
const item1 = new ItemModel({
  name: "Welcome to the to-do-list app!"
});

const item2 = new ItemModel({
  name: "Click on \'+\' to add a task"
});

const item3 = new ItemModel({
  name: "Check the box if a task is done"
});

// Arrays
const items = [item1, item2, item3];
const workItems = [];

// Some Code
app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Get Method
app.get("/", function(req, res) {
  ItemModel.find(function(err, docs) {
    if (docs.length === 0) {
      ItemModel.insertMany(items, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted defaults successfully!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        ejsList: "Today",
        ejsItems: docs
      });
    }
  });
});

app.get("/work", function(req, res) {
  res.render("list", {
    ejsList: "Work List",
    ejsItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/:customParameter", function(req, res) {
  const parameterUrl = _.capitalize(req.params.customParameter);

  ListModel.findOne({
    name: parameterUrl
  }, function(err, doc) {

    if (!err) {
      if (!doc) {
        const itemsList = new ListModel({
          name: parameterUrl,
          list: items
        });
        itemsList.save();
        console.log("Inserted defaults to the list successfully!");
        res.redirect("/" + parameterUrl);
      } else {
        res.render("list", {
          ejsList: doc.name,
          ejsItems: doc.list
        });
      }
    }
  });
});

// Post Method
app.post("/delete", function(req, res) {
  const itemChecked = req.body.checkbox;
  const listName = req.body.listNameHidden;
  if (listName === "Today") {
    ItemModel.deleteOne({
      _id: itemChecked
    }, function(err) {
      if (!err) {
        console.log("The item has been successfully deleted!");
        res.redirect("/");
      }
    });
  } else {
    ListModel.updateOne({
      name: listName
    }, {
      $pull: {
        list: {
          _id: itemChecked
        }
      }
    }, function(err, doc) {
      if (!err) {
        console.log("The item list has been successfully deleted!");
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/", function(req, res) {
  const newItem = new ItemModel({
    name: req.body.addItem
  });
  const listName = req.body.listName;

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    ListModel.findOne({
      name: listName
    }, function(err, doc) {
      doc.list.push(newItem);
      doc.save();
      res.redirect("/" + listName);
    });

  }

});


// Server
app.listen(3000, function() {
  console.log("The server is running on port 3000...");
});
