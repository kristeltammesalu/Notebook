/**
 * Created by kristel on 8.11.14.
 */
Conspectus = new Mongo.Collection("lectureconspectus");

if (Meteor.isClient) {

    Template.Conspectus.selectedDay = function () {

        return Session.get('selectedDate');

    };

    Template.Conspectus.selectedLecture = function () {

        return Session.get('selectedLecture');

    };

    Template.Conspectus.showConspectus = function () {
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

    Template.Conspectus.events({

        'click #saveConspectusButton': function (t) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');
            var selectedCurrentLecture = Session.get('selectedLecture');
            var writtenConspectus = document.getElementById("writtenConspectus").value;
            $(writtenConspectus).val();

            if(Template.Dayview.countConspectus() == 0) {
                Conspectus.insert({userid:userID, lecturedate: selectedCurrent, lecturename: selectedCurrentLecture, conspectus: writtenConspectus});
            } else if (Template.Dayview.countConspectus() == 1) {

                var conspectus = Conspectus.findOne({userid: userID, lecturedate: selectedCurrent, lecturename: selectedCurrentLecture});

                Conspectus.update({_id: conspectus._id}, {$set: {conspectus: writtenConspectus}},
                    {}, function(err, doc){
                    //alert("Töötab!");
                });
            }

        },

        'click #backConspectusButton': function () {
            Router.go('Dayview');
        }
    });

    Template.Conspectus.rendered = function () {
        $('#writtenConspectus').wysihtml5();
    };
}