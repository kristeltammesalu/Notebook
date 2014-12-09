/**
 * Created by kristel on 14.11.14.
 */

if (Meteor.isClient) {
    Router.onBeforeAction(function() {
        if (! Meteor.userId()) {
            this.render('SignInPage');
        } else {
            this.next();

        }
    });

    Router.map( function () {
        //this.route('SignInPage', {path: '/'});
        this.route('CalendarTemplate', {path: '/'});
        this.route('Dayview', {path: '/Dayview'});
        this.route('Conspectus', {path: '/Conspectus'});
        this.route('ToDo', {path: '/ToDo'});
    });
}
