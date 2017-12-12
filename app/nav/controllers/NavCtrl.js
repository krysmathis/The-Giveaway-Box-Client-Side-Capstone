angular
.module("TheGiveawayBoxApp")
.controller("NavCtrl",
function ($scope, $location, AuthFactory, ListingsFactory) {
    /*
    Just a pass-through method to the AuthFactory method of the
    same name.
    */
    $scope.isAuthenticated = () => {
        //console.log("checking authentication")
        AuthFactory.isAuthenticated();
    }

    $scope.toUserProfile = () => {
        const user = AuthFactory.getUser().uid;
        $location.url(`/users/${user}`)
        //console.log(`users/${$scope.navUser}`)
    }

    $scope.finder = event => {
        if (event.key === "Enter") {
            const employee = ListingsFactory.find($scope.searchString)
        }
    }

    /*
    Unauthenticate the client.
    */
    $scope.navLogout = () => {
        console.log("logging out")
        AuthFactory.logout();
    }

    const updateNavBar = (user) => {
        const navBar = document.querySelector(".nav__list")
        if (navBar.hasChildNodes()){
            // clear out the existing element
            const nodes = Array.from(navBar.childNodes)
            nodes.forEach(el => {
                if (el.className === "nav__user-email"){   
                    navBar.removeChild(el)
                }
            })
            // add the new one
            const li = document.createElement("li")
            li.className = "nav__user-email"
            li.innerHTML = user.email
                navBar.appendChild(li)
            }
        }
}
)