"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("FilterFactory", function ($http,$sce) {
    
    return Object.create(null,{
        "filteredListings": {
            value: [],
            enumerable: true,
            writable: true
        },
        "filter": {
            value: {},
            enumerable: true,
            writable: true
        },
        "getfilteredListings": {
            value: function(listings,filter) {
                this.filter = filter
                
                // clear the filtered listings before proceeding
                this.filteredListings = []
                //go through keywords
                listings.forEach(
                    l=>{
                        if (this.searchKeywords(l)) {
                            this.filteredListings.push(l)
                            return
                        } else if (l.categoryExternalId > 0 && this.searchCategories(l,filter)) {
                            this.filteredListings.push(l)
                            return
                        }
                    })

                return this.filteredListings


            },
            enumerable: true
        },

        "searchCategories": {
            value: function(item, filter) {
                const filterHasKeywords = filter.keywords.length > 0
                if (filter.categoryExternalId > 0 && !filterHasKeywords){
                    return item.category.externalId === filter.categoryExternalId
                } else if (filterHasKeywords){
                    return false
                } else {
                    return item
                }
            },
            enumerable: true
        },

        "searchTags": {
            value: function(item, word) {
                return item.tags.some(t=> t.toLowerCase().includes(word))
            },
            enumerable: true
        },
        "searchAttributes": {
            value: function(item, word) {
                if (item.hasOwnProperty("attributes")){
                    return item.attributes.some(a => a.value.toLowerCase().includes(word))
                } else {
                    return false
                }
            },
            enumerable: true
        },
        "searchKeywords": {
            value: function (listing){
                let matched = false
                const l = listing
                //
                try {
                    if (!matched) {
                        this.filter.keywords.forEach(word => {
                            // label
                            // description
                            // attribute values
                            // tags
                            // looking for lowercase
                            word = word.toLowerCase()
                            if (
                                l.label.toLowerCase().includes(word) ||
                                l.desc.toLowerCase().includes(word)  ||
                                this.searchTags(l,word) ||
                                this.searchAttributes(l, word)
                            ) {
                                //console.log("findIndex: ", this.filteredListings.findIndex(i=> i.id === l.id))
                                matched = true
                                return matched
                            }
                        })
                    } else {
                        // end it here if it matched
                        return matched
                    }
                } catch (err) {
                    return matched
                }
                
                return matched
            },
            enumerable: true
        },
        "usersWithinBounds": {
            value: function(bounds,listings) {
                return listings.filter( l => {
                    const latLng = {lat: l.user.lat, lng: l.user.long}
                    return bounds.contains(latLng)
                })  
            },
            enumerable: true
        },
        "usersInGroups": {
            value: function(users,listings,filter) {
                // filter the listings based on current filter
                this.getfilteredListings(listings,filter)
                // return the listings 
                return this.filteredListings.filter(l=> {
                    return users.findIndex(x=> x === l.userId) > -1
                })
            },
            enumerable: true
        },
      
    })

})