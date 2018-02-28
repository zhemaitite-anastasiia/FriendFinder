var friends = require("../data/friends");
module.exports = function(app){

//A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
    app.get("/api/friends", function(req,res){
        console.log("friends incoming")
        res.json(friends);
    });
//A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.
app.post("/api/friends", function(req,res){
   //newFriend is the user that filled out the survey
   var newFriend =req.body;

   //best match from scores
   var bestMatch = {};
   
   for(var i=0; i<newFriend.scores.length; i++){
       if(newFriend.scores[i] == "1 (Strongly Disagree)"){
           newFriend.scores[i] = 1;

       } else if(newFriend.scores[i] == "5 (Strongly Agree)"){
           newFriend.scores[i] = 5;
       } else {
           newFriend.scores[i] = parseInt(newFriend.scores[i]);
       }
   }

   //compare the scores of newFriend with the scores of each friend in the database and find the friend with the smallest difference when each set of scores is compared
   var bestMatchIndex = 0;
   var bestMatchDifference = 40;

   for(var i=0; i<friends.length; i++){
       var totalDifference = 0;
      
 for(var index = 0; index < friends[i].scores.length; index++){
     var differenceOneScore = Math.abs(friends[i].scores[index] - newFriend.scores[index]);
     totalDifference += differenceOneScore;
 }
if(totalDifference < bestMatchDifference){
    bestMatchIndex = i;
    bestMatchDifference = totalDifference;
}
   }
  //the best match index is used to get the best match data from the friends index
  bestMatch = friends[bestMatchIndex];

  //Put new friend from survey in the "database" array
  friends.push(newFriend);

  //return the best match friend
  res.json(bestMatch);
});

};