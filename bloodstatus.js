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
        // console.log(`${lastname} is half`);
    } else if (pure.includes(lastname)){
        // console.log(`${lastname} is pure`)
        return "Pure Blood";
    } else {
        // console.log(`${lastname} is muggle`)
        return "Muggle";
    }
}