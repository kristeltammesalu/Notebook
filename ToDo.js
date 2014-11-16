/**
 * Created by kristel on 16.11.14.
 */

Lists = new Meteor.Collection("lists");
Todos = new Meteor.Collection("todos");

if (Meteor.isClient) {

    Session.setDefault("listId", null);
    Session.setDefault("editing_todo", false);

    Template.todos.list = function() {
        return Lists.findOne({ _id: Session.get("listId")});
    };

    Template.todos.todoListItems = function() {
        return Todos.find({ listId: Session.get("listId") });
    };

    Template.todos.itemsExist = function() {
        return Todos.find({ listId: Session.get("listId") }).count() > 0;
    };

    Template.todos.aListExists = function() {
        return Lists.findOne() != null;
    };

    Template.todos.events({
        "keyup #todo-input": function(evt, tmpl) {
            if (evt.which === 13) {
                var newTodo = tmpl.find("#todo-input").value;
                Todos.insert({todoText: newTodo, listId: Session.get("listId"), done: false});
                tmpl.find("#todo-input").value = "";
                newTodo = "";
            }
        }
    });


    Template.todoListItem.editing_todo = function() {
        return Session.get("editing_todo");
    };

    Template.todoListItem.done_class = function() {
        return this.done ? "done" : "";
    };

    Template.todoListItem.done_checkbox = function() {
        return this.done ? "checked" : "";
    };

    Template.todoListItem.events({
        "click .remove-todo": function() {
            Todos.remove({ _id: this._id });
        },

        "dblclick .todo-item-text": function() {
            if (!this.done)
                Session.set("editing_todo", true);
        },

        "keyup .todo-edit": function(evt, tmpl) {
            if (evt.which === 27 ) {
                Session.set("editing_todo", false);
            }

            if (evt.which === 13) {
                var todoText = tmpl.find(".todo-edit").value;
                Todos.update(this._id, { $set: { todoText: todoText, listId: Session.get("listId") }});
                todoText = "";
                Session.set("editing_todo", false);
            }
        },

        "click .check": function(evt, tmpl) {
            Todos.update(this._id, { $set: { done:!this.done }});
        }
    });

    Template.lists.events({
        "keyup #listname-input": function(evt, tmpl) {
            if (evt.which === 27)
                tmpl.find("#listname-input").value = "";
            if (evt.which === 13 ) {
                var listName = tmpl.find("#listname-input").value;
                if (listName != "" && !Lists.findOne({ name: listName })) {
                    // insert new list
                    Lists.insert({ name: listName });

                    // switch to new list
                    var newList = Lists.findOne({ name: listName });
                    Session.set("listId", newList._id);

                    // reset UI
                    tmpl.find("#listname-input").value = "";
                    listName = "";
                }

            }
        }
    });


    Template.lists.lists = function() {
        return Lists.find();
    };

    Template.listItem.remove_list = function() {
        return Session.get("show-remove-list") ? "icon-trash" : "";
    };


    Template.listItem.events({
        "click .listItem": function() {
            Session.set("listId", this._id);
        },

        "click .remove-list": function() {
            var removedListId = this._id;
            Lists.remove({ _id: removedListId });
            Session.set("listId", Lists.findOne()._id);
        },

        "mouseenter .listItem": function() {
            Session.set("show-remove-list", true);
        },

        "mouseleave .listItem": function() {
            Session.set("show-remove-list", false);
        }
    });
}