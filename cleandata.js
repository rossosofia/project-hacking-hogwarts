"use strict"

import {getBloodStatus} from "./bloodstatus.js"; 

const allStudents = []; 
let globalObject ={filter: "*" , prefects:[] , squad:[], sortBy: "", sortDir: ""};
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
  triggerButtons();
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

  displayList(allStudents);
}


// ------------- CONTROLLER -------------
// ******* clean data *******
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

// ******* buttons *******

function triggerButtons(){
  document.querySelectorAll(".filter").forEach((each) =>{each.addEventListener("click", filterInput);}); 
  document.querySelectorAll("[data-filter=prefects]").forEach((each) =>{each.addEventListener("click", filterByPrefect);}); 
  document.querySelectorAll("[data-filter=squad]").forEach((each) =>{each.addEventListener("click", filterBySquad);}); 
  document.querySelector("#sort-options").addEventListener("change", (event) => {
    let selectedOption = event.target.selectedOptions[0];
    globalObject.sortBy = selectedOption.dataset.sort;
    globalObject.sortDir = selectedOption.dataset.sortDirection;
    buildList()});
}

// ******* filtering *******
// selectFilter (set the event as filter)
function filterInput(event){
  let filter = event.target.dataset.filter;
  setFilter(filter);
}

// setFilter (is taking the filter)
function setFilter(filter){
  globalObject.filter = filter;
  buildList();
}


// filterList (is returning the filter list)
function filterList(filteredList){
  if(globalObject.filter !== "*"){
    filteredList = allStudents.filter(filterBy);
  } else{ 
    filteredList = allStudents;
  }
  return filteredList;
}


function filterBy(student){
  if(student.house.toLowerCase() === globalObject.filter ){
    return true
  }
  if(student.bloodstatus.toLowerCase() === globalObject.filter ){
    return true
  }
}
 
function filterByPrefect(){
  //let prefects; // i made it global so i can call it here
    globalObject.prefects = allStudents.filter(student => student.prefect);
    displayList(globalObject.prefects);
    // console.log(globalObject.filter)

}

function filterBySquad(){
  document.querySelector("[data-filter=squad").classList.add("active");
  displayList(globalObject.squad);
}

// ******* sorting *******

function sortList(sortedList){
  let direction = 1;
  
  if(globalObject.sortDir === "desc"){
    direction = -1;
  }

  sortedList = sortedList.sort(sortByInput);
  
  function sortByInput(studentA, studentB){
    // console.log(`sorted by ${globalObject.sortBy}`)
    // this is A-Z
    if(studentA[globalObject.sortBy] < studentB[globalObject.sortBy]){
      return -1 * direction;
     }else{
      return 1 * direction;
     }
 }
  return sortedList;
}

// ******* make a prefect *******

function tryToMakeAPrefect(selectedStudent){
  // const prefects = allStudents.filter(student => student.prefect)
  //i made them global so i can call the display list later
  globalObject.prefects = allStudents.filter(student => student.prefect);

   // i'm populating sameHouseAndGender when the selected students match the criteria on the return
  const sameHouseAndGender = globalObject.prefects.filter(student => student.house === selectedStudent.house && student.gender === selectedStudent.gender).shift();

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
    //  displayList(allStudents);
     buildList();
     closeDialog();
    }
    
    function clickRemoveB(){
     removePrefect(studentB);
     makePrefect(studentA);
     //  displayList(allStudents);
     buildList();
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
  if (globalObject.filter !== "*"){
  // console.log(globalObject.filter)
  buildList();
  }
  
  }
}

// ------------- VIEW ------------- 
//  function buildList() {
//   const currentList = filterInput(allStudents);
//   //let sortedList = sortList(currentList);
//  displayList(currentList);
// }

function buildList() {
  const currentList = filterList(allStudents);
  let sortedList = sortList(currentList);
  displayList(sortedList);
  // console.log(globalObject.filter);
  // console.log(currentList);
}

function displayList(students) {
  // clear the list
  document.querySelector("section.students-list table#list tbody").innerHTML = "";

  // check if filters are active
  if(document.querySelector("[data-filter=squad").classList.contains('active')){
    globalObject.squad.forEach(displayStudent);
  } else {
  students.forEach(displayStudent);
  }
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

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
  if (student.squad) {
    clone.querySelector("[data-field=squad]").innerHTML = "⭐";
    //console.log("you are a squad member - change star");
  } else {
    clone.querySelector("[data-field=squad]").innerHTML = "☆";
    //console.log("you are not squad");
  }
  
  clone.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
  
  function addToSquad() {
      if (student.bloodstatus === "Pure-Blood" || student.house === "Slytherin") {
        student.squad = !student.squad;
        globalObject.squad = allStudents.filter(student => student.squad);
      } else {
        alert("you cannot");
      }
      buildList();
  }

  //put a student in prefect
  clone.querySelector("[data-field=prefects]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefects]").addEventListener(`click`, isPrefect);
  
  function isPrefect(){
    // untoggle a prefect is always possible, but not toggle it (2 winners for each category)
    if(student.prefect === true){
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    // displayList(allStudents);
    buildList();
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
  }
}
