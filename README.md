####My First Node-Express Application
--
#####Purpose:
This application is a small exploratory exercise to learn more about web development.
#####Functionality:
This application includes an authenticated user system using encrypted session cookies. This user system allows users to change their passwords on a settings page. On the search page, it allows them to search for and send friend requests to other users. On the home page users can see a list of their friends, accept friend requests, and see friend requests which they have sent to other users.
#####Design:
Overview: The design closely resembles RPC methodology.    
<br>
Client-Server Model: There are six key components.   


>Views: Clients use their browsers to make requests to GET views from the server. Clients can request JSON data from the server by POSTing a  correctly formatted order object to a particular route. The order consists of a particular behavior aspect method and the arguments that will be needed to invoke that method (see Behaviors). If a client has an encrypted session and the behavior aspect method requires one of the session parameters as input, the client can write in the name of the parameter instead of its value. This parameter will be replaced with the correct value from the session by the PageController object on the server before the behavior aspect method is invoked. Once the order is processed, the client will get back an object with a served property that references the response object. 
    

>Routes: Every route has a Page associated with it (see Pages). When an order is requested by the client, the route first parses the order (using JSON.pasrse) and then loads the session using the PageController method "loadSession." This method essentially stores session information in the PageController which is a prototype for all Pages. Once the session is information is loaded, the route code either passes the order to the PageController method "onRequest" or "onRender" circumstantially depending on whether the route is a POST or a GET respectively.

>Pages: Every Page inherits from PageController. Page objects override two properties from the PageController prototype. These properties are called "menu" and "onRender." The menu needs to contain a key to value mapping where the key is a menu property that can be exposed to the client side view and the value is the behavior aspect to be invoked when the client requests that menu property. Note that nothing the client sends gets evaluated as sent (as in using .eval() which can be dangerous). 

>Behaviors: Behaviors have different properties, or aspects, associated with them. Behaviors can be standalone objects consisting of one or many aspects. They can be mixtures of other behaviors, though they should not directly copy aspects from other behaviors. Where Pages expose Behavior aspects to clients, Behavior objects expose which aspects are legal for Pages to expose. Behaviors can have one BehaviorMotor object associated with them to help hide methods that should never be exposed to a Page.
    
>BehaviorMotors: BehaviorMotors are essentially helpers to Behavior objects. They contain methods which should not and may even be risky behavior to expose on a Page. BehaviorMotors can be standalone or mixtures of other BehaviorMotors but, they should not use Behavior objects. They can use any number of MotorGear objects.

>MotorGears: MotorGears are essentially helpers to BehaviorMotors. The definition for what these should be is a loose one. They should not use Behaviors or BehaviorMotors. They should mainly be used for increased flexibility when the Model requires complicated operations or goes beyond the normal scope of a simple Create-Read-Update-Delete application. In other words they could mainly be used as an interface to extend with new design decisions rather than with new implementation. The TransactionGear I have right now is not a very good example of this though.

Simplicity: There are three steps needed to add new behavior to an existing view.

	1. Create a new Behavior with appropriate supporting objects. 
	2. Add a behavior aspect from this Behavior to a Page menu.
	3. Create an order on the view and send it to the server.

Coupling: Coupling is linear (worst case) from View to Behaviors.

>View to Page: To change one behavior aspect on the view may require changing one behavior aspect on the Page menu.
    
>Page to Behavior: To add one behavior aspect on the menu, may mean adding that aspect to a Behavior object or creating a Behavior object. 
	
>Total: Linear Complexity + Linear Complexity = Linear Complexity
	
Deep Model Coupling: Deep Model Coupling is squared in magnitude (worst case) but is easily automated.

>Behavior to Behavior w/out versioning: To change one behavior aspect may mean having to change all other behavior aspects in the case that all other behavior aspects depend on it. In the worst case, the dependency graph of behavior aspects is fully connected.
    
>Behavior to Behavior with versioning: To change one behavior aspect may mean having to run a script that updates the version of all other behavior aspects depending on it.
    
>Total: Squared Complexity (but if only considering manual changes, can be linear).
    
Security: Modularity makes it easy to close security holes.

>Behavior aspects from Behavior objects are added to Pages. If one of those Behaviors aspects is exposing a bug, that Behavior object can be removed and replaced.
    
Database: Postgresql was chosen after experimenting with MongoDB.

>MongoDB is a NoSQL database and Postgresql supports both SQL and NoSQL. NoSQL databases store collections of documents. SQL databases store tables of records. MongoDB supports atomic transactions within a document but not across collections. Although I found MongoDB easy to work with, I needed a database that supported atomic transactions across collections or tables. For this reason, I decided to go with Postgresql for this mini project. In the future I will probably look at other NoSQL solutions. There are many different databases available which are good for different types of applications.
	
#####Future:

I may extend this project a little but this project was mostly just to test out Node and practice coding in Javascript. 

#####How to Run:
1. Install and start running postgres.

2. Install node.

3. Create a postgres database.

4. Replace the connection string in Model/Database/connectionString.js.
Replace 5432 with the appropriate port and testdb with the appropriate database name.

5. Open terminal and navigate to app.js

6. To load the node module dependencies run $ npm install 

5. To start the application run $ node app.js

6. The app should now be running on localhost:3000.


#####Special Notes:

There are some things which are not implemented in the best way possible. I also intentionally left in a piece of code which may be buggy. The piece of code I am referring to is code that handles the transaction that must be made for accepting a friend request. There are two ways to do a transaction with the external library I am using (called knex). Both ways seem to work but one of the ways throws an error after the transaction succeeds basically saying the transaction did not. I want to check this out and see if this bug is on my end, on the end of the knex library or on the end of the Promise library I am using (bluebird). 
    
Also of note, is that there is no security middleware in this implementation.

