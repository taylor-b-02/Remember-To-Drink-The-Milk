# Remember-The-Milk
## Week 13 Group Project
### Brief explanation of what the app is and does
* Remember the milk is a site for people who are too busy to remember self care.  You can create tasks such as to meditate, eat healther, and exercise.  You can add these to lists to better organize them.  You can also check the tasks off as complete.
### Link to live site
* https://remeber-to-drink-the-milk.herokuapp.com/
### Link to wiki docs
* https://github.com/taylor-b-02/Remember-To-Drink-The-Milk/wiki
### Discussion of technologies used
* The entire "user-home" section of our site is rendered dynamically.
* We used bcrypt for authentication, and all but the splash page needs authorization to access.
* We implemented a search function on the user accessed pages.
* Users have the ability to update edit their profile and update their password.
### Discussion of two features that show off the team's technical abilities
* I believe our dynamic user home was a huge show of our technical abilities.  Most of the features on our site are dynamic.
* Our search function was going to be dynamic as well, but due to time constraints it redirects you.  It was still a really interesting feature to implement.
### Discussion of both challenges faced and the way the team solved them
* Challenge: We had a hard time using the "search" input with an event listener.  We worked together and tried multiple solutions until we were able to get it to function.  Once it was functioning, we were able to clean up the code.
* Challenge: Making the lists, tasks, and edit/delete for both dynamic on the main page.  We teamed up to tackle this challenge.  It was broken up into smaller pieces, and brought to fruition one by one.
### Code snippets to highlight the best code
* window.location.href=`http://localhost:8080/lists/searchResults/${search}` Figuring out how to use a GET method but still have access to the search input was interesting.  String interpolation for the win!

* 
