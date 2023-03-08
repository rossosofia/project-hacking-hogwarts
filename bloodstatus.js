"use strict"

let endpoint = "https://petlatkea.dk/2021/hogwarts/families.json";

let half = {};
let pure = {};
// let lastname = "Weasley";
loadJSON();

function loadJSON() {
    fetch(endpoint)
      .then((response) => response.json())
      .then((jsonData) => {
        half = jsonData.half;
        pure = jsonData.pure;
        getBloodStatus();
    });
}

export function getBloodStatus(lastname){
    if(half.includes(lastname)){
        return "Half-Blood";
    } else if (pure.includes(lastname)){
        return "Pure-Blood";
    } else {
        return "Muggle";
    }
}
