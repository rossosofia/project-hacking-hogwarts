"use strict"

const allStudents = []; 
const endpoint = `https://petlatkea.dk/2021/hogwarts/students.json`;

start();

const Student = {
    firstname: "",
    lastname: "",
    middlename: "",
    nickname: "",
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
    let everyName = createName(jsonObject.fullname.trim());

    student.gender = jsonObject.gender;
    student.house = makeFirstCapital(jsonObject.house.trim());
    student.firstname = everyName.firstName;
    student.lastname = everyName.lastName;;
    student.middlename = everyName.middleName;;
    student.nickname = everyName.nickName;
   
    // const text = jsonObject.fullname.split(" ");

    allStudents.push(student);
  });

  displayList();
}

// ------------- CONTROLLER -------------
function makeFirstCapital(x){
return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
}


function createName(fullname){
    let firstName = fullname.substring(0, fullname.indexOf(" "));
    let lastName = fullname.substring(fullname.lastIndexOf(" ")+1);
    let nickName;
    let middleName;
    const nic = /["]/;
    let isNick = fullname.search(nic);
    if (isNick === -1){
     middleName = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
    }else{
      nickName = fullname.substring(isNick +1, fullname.lastIndexOf("\""));
      middleName = fullname.substring(fullname.indexOf(" ")+1, isNick -1);
    }
    if (firstName === " "){
      firstName = "";
    }
    else if (middleName === " "){
      middleName = "";
    }
    else if(lastName === " "){
      lastName = "";
    }
    return {firstName , middleName , nickName , lastName}
  }
    








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
  clone.querySelector("[data-field=firstName").textContent = student.firstname;
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  clone.querySelector("[data-field=nickName").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
