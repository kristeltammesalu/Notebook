/**
 * Created by kristel on 6.12.14.
 */

if (Meteor.isClient) {

    Template.lecture.homeworks = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');

        console.log("Getting homeworks for lecture with ID: " + this._id);

        return Homework.find({lectureid: this._id});
    };

    Template.lecture.countHomeworks = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');

        console.log("Getting homeworks for lecture with ID: " + this._id);


        return Homework.find({lectureid: this._id}).count();
    };

    Template.lecture.events({
        'click .addHomework': function (e, tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');

            var homework = tmpl.find(".homework").value;

            var homeworkID = "";

            Homework.insert({homework: homework, lectureid: this._id}, function(err, doc) {
                homeworkID = doc;
            });

            console.log("Inserted new Homework with ID: " + homeworkID + " for lecture ID: " + this._id);


        },

        'click .removeLecture': function (e, tmpl) {
            var removeLecture = this._id;
            Lectures.remove({ _id: removeLecture});

        }, 'click .addNewHomeWork': function (e, tmpl) {

            Session.set("homeworkId", this._id);
            alert(this._id + " ReaID");

            $("#homeworkModal").addClass(this._id);

        },'click .removeHomework': function (e, tmpl) {

            Homework.remove({ _id: this._id});

        }
    });

    Template.lecture.rendered = function() {
        console.log("Lecture ID: " + this._id);
    }
}