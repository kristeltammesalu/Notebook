/**
 * Created by kristel on 8.11.14.
 */
Conspectus = new Mongo.Collection("lectureconspectus");

if (Meteor.isClient) {

    Template.conspectus.selectedDay = function () {

        return Session.get('selectedDate');

    };

    Template.conspectus.selectedLecture = function () {

        return Session.get('selectedLecture');

    };

    Template.conspectus.showConspectus = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');
        var selectedCurrentLecture = Session.get('selectedLecture');

        return Conspectus.find({userid: userID, lecturedate: selectedDate, lecturename: selectedCurrentLecture});
    };

    Template.Dayview.countConspectus = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');
        var selectedCurrentLecture = Session.get('selectedLecture');

        var countConspectus = Conspectus.find({userid: userID, lecturedate: selectedDate, lecturename: selectedCurrentLecture}).count();

        return countConspectus;
    };

    Template.conspectus.events({

        'click #saveButton': function (tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');
            var selectedCurrentLecture = Session.get('selectedLecture');
            //var writtenConspectus = tmpl.find("#writtenConspectus").value;
            var writtenConspectus = document.getElementById("writtenConspectus").value;
            //alert(writtenConspectus);
            //Conspectus.insert({userid:userID, lecturedate: selectedCurrent, lecturename: selectedCurrentLecture, conspectus: writtenConspectus});
            alert(Template.Dayview.countConspectus());

            if(Template.Dayview.countConspectus() == 0) {
                Conspectus.insert({userid:userID, lecturedate: selectedCurrent, lecturename: selectedCurrentLecture, conspectus: writtenConspectus});
            } else if (Template.Dayview.countConspectus() == 1) {
                alert("elseif" + writtenConspectus);
                Conspectus.update({userid: userID, lecturedate: selectedCurrent, lecturename: selectedCurrentLecture}, {$set: {writtenconspectus: writtenConspectus}});
            }

        },

        'click #backButton': function () {
            $('#katsetus').show();
            Session.set('conspectus', false);
            Session.set('dayView', true);
        },

        'click #editButton': function () {
            if(document.getElementById("writtenConspectus").disabled == true) {
                $("#writtenConspectus").prop('disabled',false);
            } else {
                $("#writtenConspectus").prop('disabled',true);
            }
        }
    });
}