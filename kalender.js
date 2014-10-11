Lectures = new Mongo.Collection("lectures");

if (Meteor.isClient) {

    Session.set('selectedDate', "");
    Session.set('adding_task', false);

    Template.CalendarTemplate.rendered = function () {
        this.$('.calendar').fullCalendar({
            dayClick: function (date, jsEvent, view) {


                // change the day's background color just for fun
                //$('.calendar').hide();

                Session.set('adding_task', true);

                console.dir(Session.get('adding_task'));

                Session.set('selectedDate', date.format("D.M.YYYY"));


            }
        });
    }

    Template.content.ifDayviewTrue = function () {

        if (Session.equals('adding_task', true)) {
            return Session.get('selectedDate');
        }


        return;
    }

    Template.Dayview.selectedDay = function () {

        return Session.get('selectedDate');

    };

    Template.Dayview.lectures = function () {
        var selectedDate = Session.get('selectedDate');

        return Lectures.find({lecturedate: selectedDate}, {sort: {begintime: 1}});
    };

    Template.Dayview.events({
        'click #saveButton': function (evt, tmpl) {
            var selectedCurrent = Session.get('selectedDate');

            //alert(Session.get('selectedDate'));

            var beginTime = tmpl.find("#beginTime").value;
            var endTime = tmpl.find("#endTime").value;
            var lectureName = tmpl.find("#lectureName").value;
            var rex = /^([0-1][0-9]|[2][0-3]|[0-9]):([0-5][0-9])$/;


            if ($.trim($('#beginTime').val()) == '' || $.trim($('#endTime').val()) == '' || $.trim($('#lectureName').val()) == '') {
                $('#addNewLectureInput').hide();
            } else if (!rex.test(beginTime) || !rex.test(endTime)) {
                alert("Vale formaat");
            } else if ($.trim($('#beginTime').val()) > $.trim($('#endTime').val())) {
                alert("loll loom");
            } else {
                Lectures.insert({lecturedate: selectedCurrent, begintime: beginTime, endtime: endTime, lecturename: lectureName});

                $('#addNewLectureInput').hide();
            }


        },
        'click #addNewLecture': function () {

            $('#addNewLectureInput').show();
            
            console.dir("midagi ei juhtu");


        },
        'click #backButton': function () {
            Session.set('adding_task', false);
            console.dir(Session.get('adding_task'));

        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
