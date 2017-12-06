angular.module("TheGiveawayBoxApp")
.controller("UserCtrl", function($scope, $location, UserFactory) {
    
    //firebase.auth().currentUser.getIdToken(true)
    $scope.userDataSeed = [
        {
            //userId: "CY3yTSZgBkM0wJugzK9Vd2C2EWQ2",
            name: "Krys Mathis",
            address: "1710 Long Ave",
            city: "Nashville",
            state: "TN",
            zip: "37206",
            signup: Date.now(),
            lat: 0,
            long: 0,
            aboutMe: "designer, builder"
        },
    ]
    
    $scope.addUsers = () => {
        $scope.userDataSeed.forEach(user => {
            UserFactory.add(user)
        })
    }

})