var friends = require("../data/friends.js");
module.exports = function(app){

//A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
    app.get("/api/friends", function(req,res){
        
        res.json(friends);
    });
//A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.
app.post("/api/friends", function(req,res){
   //newFriend is the user that filled out the survey
  // Parse new friend input to get integers (AJAX post seemed to make the numbers strings)
  var bestMatch = {
    name: "",
    photo: "",
    friendDifference: 1000
};

// Here we take the result of the user's survey POST and parse it.
var userData 	= req.body;
var userName 	= userData.name;
var userPhoto 	= userData.photo;
var userScores 	= userData.scores;

// This variable will calculate the difference between the user's scores and the scores of
// each user in the database
var totalDifference = 0;

// Here we loop through all the friend possibilities in the database. 
for  (var i=0; i< friends.length; i++) {

    console.log(friends[i].name);
    totalDifference = 0;

    // We then loop through all the scores of each friend
    for (var j=0; j< friends[i].scores[j]; j++){

        // We calculate the difference between the scores and sum them into the totalDifference
        totalDifference += Math.abs(parseInt(userScores[j]) - parseInt(friends[i].scores[j]));

        // If the sum of differences is less then the differences of the current "best match"
        if (totalDifference <= bestMatch.friendDifference){

            // Reset the bestMatch to be the new friend. 
            bestMatch.name = friends[i].name;
            bestMatch.photo = friends[i].photo;
            bestMatch.friendDifference = totalDifference;
        }
    }
}

// Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
// the database will always return that the user is the user's best friend).
friends.push(userData);

// Return a JSON with the user's bestMatch. This will be used by the HTML in the next page. 
res.json(bestMatch);

});

}