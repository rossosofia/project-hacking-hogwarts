"use strict"

import {getBloodStatus} from "./bloodstatus.js"; 

const allStudents = []; 
const endpoint = `https://petlatkea.dk/2021/hogwarts/students.json`;

const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  gender: "",
  image: "",
  house: "",
  bloodstatus: "",
  squad: false,
  prefect: false
};

start();

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

    student.gender = makeFirstCapital(jsonObject.gender);
    student.house = makeFirstCapital(jsonObject.house.trim());
    student.firstname = makeFirstCapital(everyName.firstName);
    student.lastname = makeLastNameCapital(everyName.lastName);
    student.middlename = makeFirstCapital(everyName.middleName);
    student.nickname = everyName.nickName;
    student.image = putImage(everyName.lastName, everyName.firstName);
    student.bloodstatus = getBloodStatus(everyName.lastName);

    
    allStudents.push(student);});

  displayList();
}


// ------------- CONTROLLER -------------
function makeFirstCapital(x){
return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
}

function makeLastNameCapital(x){
  const hyp = /[-]/;
  let hasHyphen = x.search(hyp);
  if(hasHyphen === -1){
    return x.charAt(0).toUpperCase() + x.substring(1).toLowerCase();
  }else{
    let first = x.charAt(0).toUpperCase() + x.substring(1,hasHyphen).toLowerCase();
    let second = x.charAt(hasHyphen+1).toUpperCase() + x.substring(hasHyphen+2).toLowerCase();
    return `${first}-${second}`
  }}

function createName(fullname){
    let firstName = fullname.substring(0, fullname.indexOf(" "));
    let lastName = fullname.substring(fullname.lastIndexOf(" ") +1);
    let nickName;
    let middleName;

    const singleName = /[ ]/
    let isSingleName = fullname.search(singleName);
    if(isSingleName === -1){
        firstName = fullname;
        lastName = "";
    }

    const nic = /["]/;
    let isNick = fullname.search(nic);
    if (isNick === -1){
     middleName = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
    }else{
      nickName = fullname.substring(isNick+1, fullname.lastIndexOf("\""));
      middleName = fullname.substring(fullname.indexOf(" ")+1, isNick -1);
    }

    if (middleName = ""){
      middleName = "-";
    }

    // if (lastName = undefined){
    //   lastName = "-";
    // }

    // if (nickName = undefined){
    //   nickName = "-";
    // }

    return {firstName , middleName , nickName , lastName}
  }

  function putImage(lastname, firstname){
    if (lastname.includes("-")){
      return `images/${lastname.substring(lastname.indexOf("-")+1)}_${firstname.charAt(0).toLowerCase()}.png`;
    } else if (lastname === "Patil") {
      return `images/${lastname.toLowerCase()}_${firstname.toLowerCase()}.png`;
    } else {
      return `images/${lastname.toLowerCase()}_${firstname.charAt(0).toLowerCase()}.png`;
  }
}


// ----------- SOLUTION 1 - ONE BOY, ONE GIRL FOR EACH HOUSE. WE DON'T NEED THE CHECK THE LENGTH ----------------------

function tryToMakeAPrefect(selectedStudent){
  const prefects = allStudents.filter(student => student.prefect)
  // i'm populating sameHouseAndGender when the selected students match the criteria on the return
  const sameHouseAndGender = prefects.filter(student => student.house === selectedStudent.house && student.gender === selectedStudent.gender).shift();

    // if other is different than undefined, it means that is has been populated
    if (sameHouseAndGender !== undefined){
      console.log("Prefects must be a boy and a girl!");
      removeAorB(sameHouseAndGender, selectedStudent);
  } else {
      makePrefect(selectedStudent);
  }

  function removeAorB(studentA, studentB){
    // show names on buttons
    document.querySelector("#onlyonekind [data-action=remove1] span").textContent =`${studentA.firstname}`;
    document.querySelector("#onlyonekind [data-action=remove2] span").textContent = `${studentB.firstname}`;
  
    // ask the user to ignore or remove 'A or B
    document.querySelector("#onlyonekind").classList.remove("hide");
    document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlyonekind [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector("#onlyonekind [data-action=remove2]").addEventListener("click", clickRemoveB);
  
    // if ignore, do nothing
    function closeDialog(){
    document.querySelector("#onlyonekind").classList.add("hide");
    document.querySelector("#onlyonekind .closebutton").removeEventListener("click", closeDialog);
    document.querySelector("#onlyonekind [data-action=remove1]").removeEventListener("click", clickRemoveA);
    document.querySelector("#onlyonekind [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }
  
  function clickRemoveA(){
        removePrefect(studentA);
        makePrefect(studentB);
        displayList();
        closeDialog();
    }
  
  function clickRemoveB(){
    removePrefect(studentB);
    makePrefect(studentA);
    displayList();
    closeDialog();
    }
  
  }

// common to both solution 1 and 2 (check readme or documentation)
function removePrefect(student){
  console.log("remove prefect");
  student.prefect = false;
}

function makePrefect(student){
  student.prefect = true;
}

}


// ------------- VIEW ------------- 



function displayList() {
  // clear the list
  document.querySelector("section.students-list table#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  
    if(student.squad){
      clone.querySelector("[data-field=squad]").textContent = "⭐";  
      console.log("squad is true")
    } else {
      clone.querySelector("[data-field=squad]").textContent = "☆";
    }
  
  // set clone data
  clone.querySelector("#image").src = student.image;
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  clone.querySelector("[data-field=nickName").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  clone.querySelector("[data-field=gender").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;
  
  //add someone to the squad
  clone.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
  function addToSquad(){
    if(student.bloodstatus === "Pure Blood" || student.house === "Slytherin"){
      student.squad = !student.squad;
    }else{
      alert("you cannott");
    }
  }
  
  //put a student in prefect
  clone.querySelector("[data-field=prefects]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefects]").addEventListener(`click`, makePrefect);
  
  function makePrefect(){
    // untoggle a prefect is always possible, but not toggle it (2 winners for each category)
    if(student.prefect === true){
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    displayList();
  }

  clone.querySelector("td #image").addEventListener(`click`, () => {displayStudentCard(student)});
  
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
  
}

function displayStudentCard(student){
  const popup = document.querySelector("#student-card");
  popup.classList.remove("hide");
  
  popup.querySelector("#image").src = student.image;
  popup.querySelector("[data-field=firstName]").textContent = student.firstname;
  popup.querySelector("[data-field=middleName]").textContent = student.middlename;
  popup.querySelector("[data-field=nickName").textContent = student.nickname;
  popup.querySelector("[data-field=lastName]").textContent = student.lastname;
  popup.querySelector("[data-field=gender").textContent = student.gender;
  popup.querySelector("[data-field=house]").textContent = student.house;
  popup.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;
  
  if(student.house === "Gryffindor"){
    popup.querySelector("#dialog").classList.add("gryffindor");

  }else if(student.house === "Slytherin"){
    popup.querySelector("#dialog").classList.add("slytherin");
  }else if(student.house === "Ravenclaw"){
    popup.querySelector("#dialog").classList.add("ravenclaw");

  }else{
    popup.querySelector("#dialog").classList.add("hufflepuff");
  }

  popup.querySelector(".closebutton").addEventListener('click', closeStudentCard);
  
  function closeStudentCard(){
  popup.classList.add("hide");
  popup.querySelector("#dialog").classList = "";
  // popup.querySelector(".closebutton").removeEventListener("click", closeStudentCard());
  }
}
