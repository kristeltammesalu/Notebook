# Notebook

This application is a notebook for students. In this application you can add lectures to your selected day, also homeworks and conspectuses for your lecuture. 
Saving your lecture sends user message, that the lecture is saved. 

First, you have to log in with your Facebook account. 

Then, when you have logged in with your Facebook account, you can see a calendar. Clicking on any day takes you to
Dayview, where you can add with the "+" button new lecture. When you have added your first lecture, you can add homework with the other "+", what you can see next to the lecture. You can watch the homeworks, when you click the button with arrows. 
Clicking on the lecture name takes you to Conspectus view. There you can write your conspectus. In page footer there are two buttons. 
Check button saves the conspectus and arrow button takes you to Day view.

I am using Twilio API when user is adding new lecture and presses "save" button. Clicking "save" saves the lecture and sends message to the user. Message lets user know, that the lecture is saved. Right now the solution is very primitive and the message is always sent to me(author). You can see message solution in "kalender.js" file.

There is a known bug: refreshing page while being in the day view loses day view data. I am very sorry about that, i haven't found a solution for this problem yet. 
