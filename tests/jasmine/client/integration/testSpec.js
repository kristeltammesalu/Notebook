/**
 * Created by kristel on 15.10.14.
 */
beforeEach(function () {
    Session.set('selectedDate', '5.10.2014');
    Lectures.insert({lecturedate: '5.10.2014', begintime: '13.00', endtime: '14:00', lecturename: 'Matemaatika'});
    Lectures.insert({lecturedate: '5.10.2014', begintime: '12.00', endtime: '13:00', lecturename: 'Muusika'});
});

afterEach(function () {
    Session.set('selectedDate', '');
    //Lectures.remove({lecturedate: '8.10.2014'});
});

describe('Dayview', function () {
    it("should be false, because first view is calendarview", function() {

        expect(Session.get('dayView')).toEqual(false);
    });
});

describe("First begintime", function () {
    it("should be smaller than the second begintime", function () {
        var lectures = Template.Dayview.lectures().fetch();
        expect(lectures[0].begintime <= lectures[1].begintime).toBe(true);
    });
});

describe("Endtime", function () {
    it("should be bigger than the begintime", function () {
        var lectures = Template.Dayview.lectures().fetch();
        expect(lectures[0].begintime <= lectures[0].endtime).toBe(true);
    });
});

