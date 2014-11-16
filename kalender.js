Lectures = new Mongo.Collection("lectures");
Homework = new Mongo.Collection("homework");

if (Meteor.isClient) {


    Session.set('selectedDate', "");
    Session.set('selectedLecture', "");
    Session.set('dayView', false);
    Session.set('conspectus', false);
    Session.setDefault("homeworkId", null);

    Template.CalendarTemplate.rendered = function () {
        $( ".login-button" ).addClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).addClass('logout-buttons-with-only-one-button');

        this.$('.calendar').fullCalendar({
            dayClick: function (date, jsEvent, view) {

                //alert(Template.Dayview.countLectures());

                //Session.set('dayView', true);

                //alert(Meteor.userId());

                Session.set('selectedDate', date.format("D.M.YYYY"));
                Session.set('userID', Meteor.userId());

                Router.go('Dayview');
            }
        });
    }

    Template.content.rendered = function() {
        $( ".login-button" ).addClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).addClass('logout-buttons-with-only-one-button');

    }

    Template.loginButtons.rendered = function() {
        $( ".login-button" ).addClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).addClass('logout-buttons-with-only-one-button');

    }


    Template.content.ifDayviewTrue = function () {

        if (Session.equals('dayView', true)) {
            return Session.get('selectedDate');
        }
        return;
    }

    Template.content.ifkonspektTrue = function () {

        if (Session.equals('conspectus', true)) {
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
        var userID = Session.get('userID');

        return Lectures.find({userid: userID, lecturedate: selectedDate}, {sort: {begintime: 1}});
    };

    Template.Dayview.homeworks = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');

        return Homework.find({lectureid: Session.get("homeworkId")});
    };

    Template.Dayview.countLectures = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');

        var countLectures = Lectures.find({userid: userID, lecturedate: selectedDate}, {sort: {begintime: 1}}).count();

        return countLectures;
    };
    
    //Clears inputs' values
    Template.Dayview.inputSetEmpty = function () {
        var beginTimeEmpty = $('#beginTime').val('');
        var endTimeEmpty = $('#endTime').val('');
        var lectureNameEmpty = $('#lectureName').val('');

        return beginTimeEmpty, endTimeEmpty, lectureNameEmpty;
    };

    Template.loginButtons.events({
        'click #login-buttons-facebook': function () {
            Session.set('dayView', false);
            Session.set('conspectus', false);
            console.dir("Töötab!");
            $('#login-buttons-logout').addClass("signInPage");
        }

    });

    Template.Dayview.rendered = function () {
        $( ".login-button" ).addClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).addClass('logout-buttons-with-only-one-button');
    }


    Template.signinpage.rendered = function () {
        $( ".login-button" ).removeClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).removeClass('logout-buttons-with-only-one-button');
    }

    Template.Dayview.events({
        'click #saveButton': function (evt, tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');

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
                Lectures.insert({userid:userID, lecturedate: selectedCurrent, begintime: beginTime, endtime: endTime, lecturename: lectureName});

                var newLecture = Lectures.findOne({ userid:userID, lecturedate: selectedCurrent, begintime: beginTime, endtime: endTime, lecturename: lectureName });
                Session.set("homeworkId", newLecture._id);

                alert(newLecture._id);

                Template.Dayview.inputSetEmpty();

            }

        },
        'click #addNewLecture': function () {
            Template.Dayview.inputSetEmpty();

            if(Template.Dayview.countLectures() > 14){
                alert("Rohkem tunde ei saa lisada!");
            } else {
                $('#addNewLectureInput').show();
            }
        },
        'click #backButton': function () {
            Router.go('/');

        },
        'click #closeButton': function () {
            $('#addNewLectureInput').hide();
           Template.Dayview.inputSetEmpty();
                
        },

        'click .clickLecturename': function (e) {
            var lectureName = $(e.target).text();
            Session.set('selectedLecture', lectureName);

            Router.go('Conspectus');
        },

        'click .saveChanges': function (e, tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');

            var beginTime = tmpl.find(".beginTime").value;
            var endTime = tmpl.find(".endTime").value;
            var lectureName = tmpl.find(".lectureNameTest").value;


            Lectures.update({_id: this._id}, {$set: {begintime: beginTime, endtime: endTime, lecturename: lectureName}},
                {}, function(err, doc){
                    //alert("Töötab!");
                });
        },

        'click .editButton': function (e) {
            var selectedLecture = Lectures.findOne({_id: this._id});
            Session.set('selectedLecture', selectedLecture);


        }


    });

    Template.lecture.events({
        'click .addHomework': function (e, tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');

            var homework = tmpl.find(".homework").value;

            Homework.insert({homework: homework, lectureid: Session.get("homeworkId")},
                {}, function(err, doc){
                    alert("Töötab!");
                });
            alert("tere");

        }
    });


}
