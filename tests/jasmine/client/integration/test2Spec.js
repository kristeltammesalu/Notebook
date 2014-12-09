var selectDate = function (callback) {
    Session.set('userID', "Jta3bFxkvWx2dN4PY");
    Session.set("selectedDate", "3.11.2014");

    if (callback) {
        Deps.afterFlush(callback);
    }
};


describe("Selecting Lectures", function () {
    beforeEach(function (done) {
        Meteor.autorun(function (c) {
            var lecture = Lectures.find({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "2.11.2014"});
            if (lecture) {
                c.stop();
                selectDate(done);
            }
        })
    });
});


describe("Lectures", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("should add 1 lecture is saveButton is clicked", function () {

        var countLectures = Lectures.find({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014"}, {sort: {begintime: 1}}).count();
        $("#saveButton").click(Lectures.insert({userid:"Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", begintime: "12:00", endtime: "14.00", lecturename: "Test"}));
        expect(Lectures.find({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014"}, {sort: {begintime: 1}}).count()).toBe(countLectures +1);
    });
});

describe("Homework", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("should add 1 homewrok is addHomewrok is clicked", function () {

        var countHomeworks = Homework.find(Homework.find({lectureid: 123})).count();
        $(".addHomewrok").click(Homework.insert(Homework.insert({homework: "tere", lectureid: 123})));
        expect(Homework.find(Homework.insert({homework: "tere", lectureid: 123}).count()).toBe(countHomeworks +1));
    });
});

describe("Conspectus", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("should add conspectus", function () {

        var countConspectus = Conspectus.find({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", lecturename: "Test"}).count();
        $("#saveConspectusButton").click(Conspectus.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", lecturename: "Test", conspectus: "Tere"}));
        expect(Conspectus.find(Conspectus.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", lecturename: "Test"}).count()).toBe(countConspectus +1));
    });
});


describe("Signin", function () {
    beforeEach(function () {
        Session.set('userID', "Jta3bFxkvWx2dN4PY");
    });

    it("should check user id", function () {
        expect(Session.get('userID')).toBeDefined();
    });

    it("should be able to logout", function (done) {
        Meteor.logout(function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });
});