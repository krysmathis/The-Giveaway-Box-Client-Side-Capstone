angular.module("TheGiveawayBoxApp")
.factory("AuthFactory", function ($http, $route, $timeout, $location) {
    
    let currentUserData = null

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserData = user
            if ($location.url() !== "/add-listing"){
                $timeout(function () {
                    $location.url("/add-listing")
                }, 100);
            } else {
                $route.reload();
            }

        } else {
            currentUserData = null
            console.log("User is not authenticated")
            $timeout(function () {
                $location.url("/auth")
            }, 500);
        }
    })

    return Object.create(null, {
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
            value: () => firebase.auth().signOut()
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