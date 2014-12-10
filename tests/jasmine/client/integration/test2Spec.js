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

    it ("should sort lectures by time", function() {
        spyOn(Lectures, "find").and.returnValue({});

        // call the function "data()"
        var data = Template.Dayview.lectures();

        expect(Lectures.find).toHaveBeenCalled();
        expect(Lectures.find.calls.mostRecent().args[0]).toEqual({userid : 'Jta3bFxkvWx2dN4PY', lecturedate : '3.11.2014' });
        expect(Lectures.find.calls.mostRecent().args[1].sort.begintime).toEqual(1);
        expect(data).toEqual({});
    });
});

describe("Homework", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("should add 1 homewrok is addHomewrok is clicked", function () {

        var countHomeworks = Homework.find(Homework.find({lectureid: "123"})).count();
        $(".addHomework").click((Homework.insert({homework: "tere", lectureid: "123"})));
        expect(Homework.find(Homework.insert({homework: "tere", lectureid: "123"}).count()).toBe(countHomeworks +1));
    });
});

describe("Conspectus", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("countConspectus", function () {

        var countConspectus = Conspectus.find({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", lecturename: "Test"}).count();
        $("#saveConspectusButton").click(Conspectus.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", lecturename: "Test", conspectus: "Tere"}));
        expect(Conspectus.find(Conspectus.insert({userid: "Jta3bFxkvWx2dN4PY", lecturedate: "3.11.2014", lecturename: "Test"}).count()).toBe(countConspectus +1));
    });
});

describe("ToDoList", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

    it("should add todo in list", function (evt) {

        var countToDos = Todos.find({ listId: Session.get("listId") }).count();
        $(evt.which === 13 ).keyup(Todos.insert({todoText: "TODO", listId: "123"}));
        expect(Todos.find(Todos.insert({todoText: "TODO", listId: "123"}).count()).toBe(countToDos +1));
    });
});

describe("List", function () {
    beforeEach(function (done) {
        selectDate(done);
    });

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

describe("Todos", function() {

    beforeEach(function() {
        this.name = "wash dishes"
        this.lists = new lists(this.name);
    });

    it("accepts name", function() {
        expect(this.lists.name).toEqual(this.name);
    });

    describe("keyup #listname-input", function() {

        beforeEach(function() {
            spyOn(Lists, "insert");

            this.lists.save();
        });

        it("inserts into the database", function() {
            expect(Lists.insert).toHaveBeenCalled();
        });
    });

});

