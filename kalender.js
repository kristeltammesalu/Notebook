Lectures = new Mongo.Collection("lectures");

if (Meteor.isClient) {

    Session.set('selectedDate', "");
    Session.set('dayView', false);

    Template.CalendarTemplate.rendered = function () {
        this.$('.calendar').fullCalendar({
            dayClick: function (date, jsEvent, view) {

                //alert(Template.Dayview.countLectures());

                Session.set('dayView', true);

                Session.set('selectedDate', date.format("D.M.YYYY"));


            }
        });
    }

    Template.content.ifDayviewTrue = function () {

        if (Session.equals('dayView', true)) {
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
    
    //Clears inputs' values
    Template.Dayview.inputSetEmpty = function () {
        var beginTimeEmpty = $('#beginTime').val('');
        var endTimeEmpty = $('#endTime').val('');
        var lectureNameEmpty = $('#lectureName').val('');

        return beginTimeEmpty, endTimeEmpty, lectureNameEmpty;
    };


    Template.Dayview.events({
        'click #saveButton': function (evt, tmpl) {
            var selectedCurrent = Session.get('selectedDate');

            //alert(Session.get('selectedDate'));

            var beginTime = tmpl.find("#beginTime").value;
            var endTime = tmpl.find("#endTime").value;
            var lectureName = tmpl.find("#lectureName").value;
            var rex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;


            if ($.trim(beginTime) == '' || $.trim(endTime) == '' || $.trim(lectureName) == '') {
                alert("Palun sisesta kõik väljad!");
            } else if (!rex.test(beginTime) || !rex.test(endTime)) {
                alert("Vale formaat!");
            } else if ($.trim($('#beginTime').val()) > $.trim($('#endTime').val())) {
                alert("Algusaeg peab olema väiksem lõpuajast!");
            } else if(Template.Dayview.countLectures() > 14){
               alert("Rohkem tunde ei saa lisada!");
            } else {
                //If all conditions completed, then clicking saveButton will add lecture in colletion
                Lectures.insert({lecturedate: selectedCurrent, begintime: beginTime, endtime: endTime, lecturename: lectureName});

                $('#addNewLectureInput').hide();
            }

        },
        'click #addNewLecture': function () {
            Template.Dayview.inputSetEmpty();

            if(Template.Dayview.countLectures() > 14){
                alert("Rohkem tunde ei saa lisada!");
            } else {
                $('#addNewLectureInput').show();
            }


            //console.dir("midagi ei juhtu");


        },
        'click #backButton': function () {
            Session.set('dayView', false);
            //console.dir(Session.get('adding_task'));

        },
        'click #closeButton': function () {
            $('#addNewLectureInput').hide();
           Template.Dayview.inputSetEmpty();
                
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
