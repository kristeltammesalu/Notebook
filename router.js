/**
 * Created by kristel on 14.11.14.
 */

if (Meteor.isClient) {
    Router.map( function () {
        this.route('CalendarTemplate', {path: '/'});
        this.route('Dayview', {path: '/Dayview'});
        this.route('Conspectus', {path: '/Conspectus'});
        this.route('ToDo', {path: '/ToDo'});

    });

    Router.map( function () {
        this.route('TodoTemplate');
    });
}
