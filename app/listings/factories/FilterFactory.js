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
                //go through keywords
                listings.forEach(
                    l=>{
                        if (this.searchKeywords(l)) {
                            return
                        } else if (this.searchKeywords(l)) {
                            return
                        }
                    })

                return this.filteredListings


            },
            enumerable: true
        },
        "searchKeywords": {
            value: function (listing){
                let matched = false
                const l = listing
                //
                if (!matched) {
                    this.filter.keywords.forEach(word => {
                        if (l.label.includes(word) ||
                            l.desc.includes(word)) {
                                this.filteredListings.push(l)
                                matched = true
                                return matched
                            }
                    })
                } else {
                    // end it here if it matched
                    return matched
                }
                return matched
            },
            enumerabele: true
        }
      
    })

})