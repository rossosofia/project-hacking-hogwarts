"use strict"

const allStudents = []; 
const endpoint = `https://petlatkea.dk/2021/hogwarts/students.json`;

start();

const Student = {
    firstname: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender: "",
    image: "",
    house: ""
};

function start() {
  console.log("ready");
  loadJSON();
}

// ------------- MODEL -------------
function loadJSON() {
  fetch(endpoint)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);
    student.gender = jsonObject.gender;
    student.house = makeFirstCapital(jsonObject.house.trim()) ;
   
    const text = jsonObject.fullname.split(" ");

    allStudents.push(student);
  });

  displayList();
}

// ------------- CONTROLLER -------------
function makeFirstCapital(x){
return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
}

// function createName(fullname){
//     let firstName = fullname.substring(0, fullname.indexOf(" "));
//     let lastName = fullname.substring(fullname.indexOf(" "));
//     let middleName =
//     let nickName =
//     return {firsName, middleName, nickName, lastName}
// }










// ------------- VIEW -------------
function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=gender").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
