# Notebook

This is a application where you have to log in with your Facebook account. 

First, when you have logged in with your Facebook account, you can see a calendar. Clicking on any day takes you to
Dayview, where you can add with the "+" button new lecture. When you have added your first lecture, you can add homework with 
the other "+", what you can see next to the lecture. You can watch the homeworks, when you click button with arrows. 
Clicking on lecture name takes you to Conspectus view. There you can write your conspectus. In page footer there are two buttons. 
Check button saves the conspectus and arrow button takes you to Day view.

I am using Twilio API when user is adding new lecture and presses "save" button. Clicking "save" saves the lecture and sends message to
user. Message lets user know, that the lecture is saved. Right now the solution is very primitive and the message is 
always sent to me(author). You can see message solution in "kalender.js" file.
