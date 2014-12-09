Lectures = new Mongo.Collection("lectures");
Homework = new Mongo.Collection("homework");

if (Meteor.isClient) {


    Session.set('selectedDate', "");
    Session.set('selectedLecture', "");

    Template.CalendarTemplate.rendered = function () {
        this.$('.calendar').fullCalendar({
            dayClick: function (date, jsEvent, view) {

                Session.set('selectedDate', date.format("D.M.YYYY"));
                Session.set('userID', Meteor.userId());

                Router.go('Dayview');
            }
        });
    }

    Template.SignInPage.rendered = function () {
        $( ".login-button" ).removeClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).removeClass('logout-buttons-with-only-one-button');
    }

    Template.loginButtons.rendered = function() {
        $( ".login-button" ).addClass('logout-button');
        $( ".login-buttons-with-only-one-button" ).addClass('logout-buttons-with-only-one-button');

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

    Template.Dayview.selectedLectureName = function () {
        var selectedDate = Session.get('selectedDate');
        var userID = Session.get('userID');

        return Lectures.findOne({_id: this._id}).lecturename;
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

    Template.Dayview.events({
        'click #saveButton': function (evt, tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');
            var beginTime = tmpl.find("#beginTime").value;
            var endTime = tmpl.find("#endTime").value;
            var lectureName = tmpl.find("#lectureName").value;
            var place = tmpl.find("#place").value;
            var rex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;


            if ($.trim(beginTime) == '' || $.trim(endTime) == '' || $.trim(lectureName) == '') {
                alert("Palun sisesta kõik vajalikud väljad!");
            } else if (!rex.test(beginTime) || !rex.test(endTime)) {
                alert("Vale formaat!");
            } else if ($.trim($('#beginTime').val()) > $.trim($('#endTime').val())) {
                alert("Algusaeg peab olema väiksem lõpuajast!");
            } else if(Template.Dayview.countLectures() > 14){
               alert("Rohkem tunde ei saa lisada!");
            } else {
                //If all conditions completed, then clicking saveButton will add lecture in colletion
                Lectures.insert({userid:userID, lecturedate: selectedCurrent, begintime: beginTime, endtime: endTime, lecturename: lectureName, place: place});
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
        }/*,

        'click .saveChanges': function (e, tmpl) {
            var selectedCurrent = Session.get('selectedDate');
            var userID = Session.get('userID');

            var beginTime = tmpl.find(".beginTime").value;
            var endTime = tmpl.find(".endTime").value;
            var lectureName = tmpl.find(".lectureNameTest").value;
            var rex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;


            if ($.trim(beginTime) == '' || $.trim(endTime) == '' || $.trim(lectureName) == '') {
                alert("Palun sisesta kõik väljad!");
            } else if (!rex.test(beginTime) || !rex.test(endTime)) {
                alert("Vale formaat!");
            } else if ($.trim($('#beginTime').val()) > $.trim($('#endTime').val())) {
                alert("Algusaeg peab olema väiksem lõpuajast!");
            } else {
                //If all conditions completed, then clicking saveButton will add lecture in colletion
                Lectures.update({_id: this._id}, {$set: {begintime: beginTime, endtime: endTime, lecturename: lectureName}},
                    {}, function(err, doc){
                        //alert("Töötab!");
                    });

                $('#myModal').modal('hide');
                console.log("Updated lecture with id: " + this._id);

            }
        },*/

        /*'click .editButton': function (e) {
            var lecturename = Lectures.findOne({_id: this._id}).lecturename;
            var begintime = Lectures.findOne({_id: this._id}).begintime;
            var endtime = Lectures.findOne({_id: this._id}).endtime;

            $(".editBegintime").val(begintime);
            $(".editEndtime").val(endtime);
            $(".editLecturename").val(lecturename);


        }*/
    });
}
