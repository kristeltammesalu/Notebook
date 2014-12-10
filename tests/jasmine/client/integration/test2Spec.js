var selectDate = function (callback) {
    Session.set('userID', "Jta3bFxkvWx2dN4PY");
    Session.set("selectedDate", "1.12.2014");

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


beforeEach(function () {
    Session.set('selectedDate', '1.12.2014');
    Lectures.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: '1.12.2014', begintime: '13.00', endtime: '14:00', lecturename: 'Matemaatika'});
    Lectures.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: '1.12.2014', begintime: '12.00', endtime: '13:00', lecturename: 'Muusika'});
    Homework.insert({homework: "tere", lectureid: "zsWNQ9xiX45hTyqPL"});
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

    it ("should sort lectures by time", function() {
        spyOn(Lectures, "find").and.returnValue({});

        // call the function "data()"
        var data = Template.Dayview.lectures();

        expect(Lectures.find).toHaveBeenCalled();
        expect(Lectures.find.calls.mostRecent().args[0]).toEqual({userid : 'Jta3bFxkvWx2dN4PY', lecturedate : '1.12.2014' });
        expect(Lectures.find.calls.mostRecent().args[1].sort.begintime).toEqual(1);
        expect(data).toEqual({});
    });
});

describe("Homework", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("should add 1 homewrok is addHomewrok is clicked", function () {

        var countHomeworks = Homework.find({lectureid: "zsWNQ9xiX45hTyqPL"}).count();
        $(".addHomework").click((Homework.insert({homework: "tere", lectureid: "zsWNQ9xiX45hTyqPL"})));
        expect(Homework.find(Homework.insert({homework: "tere", lectureid: "zsWNQ9xiX45hTyqPL"}).count()).toBe(countHomeworks +1));
    });
});

describe("Conspectus", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("countConspectus", function () {

        var countConspectus = Conspectus.find({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "1.12.2014", lecturename: "Testin"}).count();
        $("#saveConspectusButton").click(Conspectus.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "1.12.2014", lecturename: "Testin", conspectus: "Tere"}));
        expect(Conspectus.find(Conspectus.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "1.12.2014", lecturename: "Testin"}).count()).toBe(countConspectus +1));
    });
});

describe("ToDoList", function () {

    it("should add todo in list", function (evt) {

        /*var countToDos = Todos.find({ listId: Session.get("listId") }).count();
        $(evt.which === 13 ).keyup(Todos.insert({todoText: "TODO", listId: "123"}));
        expect(Todos.find(Todos.insert({todoText: "TODO", listId: "123"}).count()).toBe(countToDos +1));*/

    });
});

describe("List", function () {

    it("should add new list", function (evt) {

        var countList = Lists.find().count();
        $(evt.which === 13 ).keyup(Lists.insert({ name: "ListiNimi" }));
        expect(Lists.find(Lists.insert({ name: "ListiNimi" }).count()).toBe(countList +1));

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

