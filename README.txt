Our game implements some basic, but fun, features that make gameplay more exciting.
First, the background changes according to the status of the player. If the player is
wielding a hammer, the background changes (as does their avatar) to display their powered-up status. When the player loses, the background also changes to an image of Valhalla, the 
Nordic heaven, indicating the game is over. This is accomplished using basic jQuery commands 
tied to in-game actions.
The title of our game flashes above the display. While this is a minor feature, it adds to 
the aesthetic of a classic arcade game title screen.
Stylistically, the boxes at the bottom have rounded borders, allows them to look nicer in
conjunction with the rest of the screen. This, along with the other items mentioned thus
far, represent CSS3 specific features as required by the assignment.

For the javascript, the project was made basically from scratch. No libraries were needed for 
the game itself, while the jQuery library and the external high score API javaScript files 
were used for specific portions of the page. Functionally, the game was relatively manageable
to implement. There were some issues initially with defining the enemies and their locations;
this was resolved after some work by redefining the enemies as objects and handling them based
on an array, from which elements were removed actively as the game progressed. 

As such, the project meets all functional requirements. The game itself is observably complex in
terms of the amount of code/functionality required for it to run correctly. It plays as
designed, with actual gameplay in accordance with the intended design based on our proposal.
All files also validate as required, so the project is completed in accordance with specifications.