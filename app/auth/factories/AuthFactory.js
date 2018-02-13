angular.module("TheGiveawayBoxApp")
.factory("AuthFactory", function ($http, $rootScope, $route, $timeout, $location) {
    
    let currentUserData = null

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserData = user
            if ($location.url() !== "/listings"){
                $timeout(function () {
                    $location.url("/listings")
                }, 400);
            } else {
                $route.reload();
            }

            $rootScope.$broadcast("authenticationSuccess")
            
        } else {
            currentUserData = null
            $timeout(function () {
                $location.url("/auth")
            }, 400);
        }
    })


    return Object.create(null, {
        currentUser: {
            value: () => {
                return currentUserData ? currentUserData : ""
            },
            enumerable: true
        },
        isAuthenticated: {
            value: () => {
                const user = currentUserData
                return user ? true : false
            }
        },
        getUser: {
            value: () => firebase.auth().currentUser
        },
        logout: {
            value: () => {
                firebase.auth().signOut()
                $rootScope.$broadcast("loggedOut")
                $location.url("/auth")
            }

        },
        authenticate: {
            value: credentials =>
                firebase.auth()
                        .signInWithEmailAndPassword(
                            credentials.email,
                            credentials.password
                        )
        },
        registerWithEmail: {
            value: user =>
                firebase.auth()
                        .createUserWithEmailAndPassword(
                            user.email,
                            user.password
                        )
        }
        
    })
})