Lectures = new Mongo.Collection("lectures");

if (Meteor.isClient) {


    Session.set('selectedDate', "");
    Session.set('selectedLecture', "");
    Session.set('dayView', false);
    Session.set('conspectus', false);

    Template.CalendarTemplate.rendered = function () {
        $( ".login-button" ).addClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).addClass('logout-buttons-with-only-one-button');

        this.$('.calendar').fullCalendar({
            dayClick: function (date, jsEvent, view) {

                //alert(Template.Dayview.countLectures());

                Session.set('dayView', true);

                //alert(Meteor.userId());

                Session.set('selectedDate', date.format("D.M.YYYY"));
                Session.set('userID', Meteor.userId());
            }
        });
    }

    /*Template.signinpage.rendered = function()
    {
        $( ".login-link-text" ).css( "display", "none" );
        Accounts._loginButtonsSession.set('dropdownVisible', true);

    };*/

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
        },
        'click #backButton': function () {
            Session.set('dayView', false);
            //console.dir(Session.get('adding_task'));

        },
        'click #closeButton': function () {
            $('#addNewLectureInput').hide();
           Template.Dayview.inputSetEmpty();
                
        },

        'click .clickLecturename': function (e) {
            var lectureName = $(e.target).text();
            //alert(lectureName);
            $('#katsetus').hide();
            Session.set('conspectus', true);
            Session.set('selectedLecture', lectureName);
        }

    });


}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
