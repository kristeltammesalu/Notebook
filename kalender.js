Lectures = new Mongo.Collection("lectures");

if (Meteor.isClient) {

    Session.set('selectedDate', "");
    Session.set('adding_task', false);

    Template.CalendarTemplate.rendered = function () {
        this.$('.calendar').fullCalendar({
            dayClick: function (date, jsEvent, view) {


                // change the day's background color just for fun
                //$('.calendar').hide();

                //alert(Template.Dayview.countLectures());

                Session.set('adding_task', true);

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

    //ask all lectures and sort by begintime
    Template.Dayview.lectures = function () {
        var selectedDate = Session.get('selectedDate');

        return Lectures.find({lecturedate: selectedDate}, {sort: {begintime: 1}});
    };

    Template.Dayview.countLectures = function () {
        var selectedDate = Session.get('selectedDate');

        var countLectures = Lectures.find({lecturedate: selectedDate}, {sort: {begintime: 1}}).count();

        return countLectures;
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
                alert("Palun sisesta kõik väljad!");
            } else if (!rex.test(beginTime) || !rex.test(endTime)) {
                alert("Vale formaat");
            } else if ($.trim($('#beginTime').val()) > $.trim($('#endTime').val())) {
                alert("loll loom");
            } else if(Template.Dayview.countLectures() > 15){
               alert("Rohkem tunde ei saa lisada!");
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

        },
        'click #closeButton': function () {
                $('#addNewLectureInput').hide();
                $('#beginTime').val('');
                $('#endTime').val('');
                $('#lectureName').val('');
                
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
