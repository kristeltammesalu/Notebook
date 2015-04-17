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

                var filter = Session.get('selectedDate');


                //Router.go('Dayview:_id');
                Router.go('Dayview');
            }
        });
    }

    Template.Dayview.helpers({
        selectedDay: function() {
            return Session.get('selectedDate');
        },

        lectures: function () {
            var selectedDate = Session.get('selectedDate');
            var userID = Session.get('userID');

            return Lectures.find({userid: userID, lecturedate: selectedDate}, {sort: {begintime: 1}});
        },

        selectedLectureName: function () {
            var selectedDate = Session.get('selectedDate');
            var userID = Session.get('userID');

            return Lectures.findOne({_id: this._id}).lecturename;
        },

        countLectures: function () {
            var selectedDate = Session.get('selectedDate');
            var userID = Session.get('userID');

            var countLectures = Lectures.find({userid: userID, lecturedate: selectedDate}, {sort: {begintime: 1}}).count();

            return countLectures;
        },

        inputSetEmpty: function () {
            var beginTimeEmpty = $('#beginTime').val('');
            var endTimeEmpty = $('#endTime').val('');
            var lectureNameEmpty = $('#lectureName').val('');
            var placeEmpty = tmpl.find("#place").val('');

            return beginTimeEmpty, endTimeEmpty, lectureNameEmpty, placeEmpty;
        }
    });

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
                alert("Wrong format!");
            } else if ($.trim($('#beginTime').val()) > $.trim($('#endTime').val())) {
                alert("Starting time has to be smaller than ending time!");
            } else if(Meteor.call('countLectures') > 14){
               alert("Can't add more lectures!");
            } else {
                //If all conditions completed, then clicking saveButton will add lecture in colletion
                Meteor.call("sendSMS");
                Lectures.insert({userid:userID, lecturedate: selectedCurrent, begintime: beginTime, endtime: endTime, lecturename: lectureName, place: place});
                Meteor.call('inputSetEmpty');

            }

        },
        'click #addNewLecture': function () {
            Meteor.call('inputSetEmpty');

            if(Template.Dayview.countLectures() > 14){
                alert("Can't add more lectures!");
            } else {
                $('#addNewLectureInput').show();
            }
        },
        'click #backButton': function () {
            Router.go('/');

        },
        'click #closeButton': function () {
            $('#addNewLectureInput').hide();
            Meteor.call('inputSetEmpty');
                
        },

        'click .clickLecturename': function (e) {
            var lectureName = $(e.target).text();
            Session.set('selectedLecture', lectureName);

            Router.go('Conspectus');
        }

    });
}

if(Meteor.isServer) {

    Meteor.methods({
        sendSMS: function () {
            twilio = Twilio('ACe6d5c868a56d37c40ad8b8a6311c26a1', '5f1702c916b94652083966c9accdcb74');

            twilio.sendSms({
                to:'+3725016490',
                from: '+37259120008',
                body: "Your lecture have added to your notebook!"
            }, function(err, responseData) {
                if (!err) {
                    console.log(responseData.from);
                    console.log(responseData.body);
                }
            });
        }
    });

}
