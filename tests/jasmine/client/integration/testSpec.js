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
});

describe('selectedDay', function () {
    it("should call Template", function() {

        expect(Session.get('dayView')).toEqual(false);
    });
});

describe("Player Ordering", function () {
    it("should result in a list where the first player has as many or more points than the second player", function () {
        var lectures = Template.Dayview.lectures().fetch();
        expect(lectures[0].begintime <= lectures[1].begintime).toBe(true);
    });
});