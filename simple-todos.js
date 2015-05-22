Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

    var _interval = null;
    var requestTimerStart = function () {
        console.log('launching interval');
        _interval = setInterval(function () {
            console.log('Posting to server');
        }, 1000);
    };

    var requestTimerStop = function () {
        console.log('stopping interval');
        clearInterval(_interval);
    };


    Meteor.subscribe("tasks");
    // This code only runs on the client
    Template.body.helpers({
        tasks: function () {
            return Tasks.find({}, {sort: {createdAt: -1}});
        },
        incompleteCount: function () {
            return Tasks.find({checked: {$ne: true}}).count();
        }
    });

    Template.body.events({

        "click #interv": function () {
            requestTimerStart();
        },

        "click #intervStop": function () {
            requestTimerStop();
        },


        "submit .new-task": function (event) {
            // This function is called when the new task form is submitted

            var text = event.target.text.value;

            Tasks.insert({
                text: text,
                createdAt: new Date(),
                owner: Meteor.userId()
            });

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        },

        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Tasks.update(this._id, {$set: {checked: !this.checked}});
        },

        "click .delete": function () {
            console.log(this);
            Tasks.remove(this._id);
        }
    });


    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}


if (Meteor.isServer) {
    Meteor.publish("tasks", function () {
        return Tasks.find({
            $or: [
                {owner: this.userId}
            ]
        });
    });


    Meteor.startup(function () {
        // code to run on server at startup
    });
}
