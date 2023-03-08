"use strict"

import {getBloodStatus} from "./bloodstatus.js"; 

const allStudents = []; 
const expelledStudents = []; 

let globalObject ={filter: "*" , prefects:[] , squad:[], sortBy: "firstname", sortDir: ""};
let hackingFlag = false;

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
  prefect: false,
  isHacker: false
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
  // displayList(allStudents);
  buildList();
  showNumbers();
}

// ------------- VIEW ------------- 
function showNumbers(){
  document.querySelector(".total-numbers .enrolled span").textContent = allStudents.length;
  document.querySelector(".total-numbers .expelled span").textContent = expelledStudents.length;
  }

function buildList() {
  const currentList = filterList(allStudents);
  let sortedList = sortList(currentList);
  displayList(sortedList);
}

function displayList(students) {
  showNumbers();
  // clear the list
  document.querySelector("section.students-list").innerHTML = "";
  students.forEach(displayStudent);
}

function displayStudent(student) {

  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("#image").src = student.image;
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  clone.querySelector("#blood-status-icon").src= `images/icon-${student.bloodstatus}.svg`;

  if(student.house === "Gryffindor"){
    clone.querySelector("#single-student").classList.add("gryffindor");
  }else if(student.house === "Slytherin"){
    clone.querySelector("#single-student").classList.add("slytherin");
  }else if(student.house === "Ravenclaw"){
    clone.querySelector("#single-student").classList.add("ravenclaw");
  }else{
    clone.querySelector("#single-student").classList.add("hufflepuff");
  }

  if (student.squad) {
    clone.querySelector("#squad-icon").classList.remove("hide");
  }

  if (student.prefect) {
    clone.querySelector("#prefect-icon").classList.remove("hide");
  }
  
  clone.querySelector("div#single-student").addEventListener(`click`, () => {displayStudentCard(student)});
  
  document.querySelector(".house-Gryffindor span").textContent = allStudents.filter(student => student.house==="Gryffindor").length;
  document.querySelector(".house-Slytherin span").textContent = allStudents.filter(student => student.house==="Slytherin").length;
  document.querySelector(".house-Ravenclaw span").textContent = allStudents.filter(student => student.house==="Ravenclaw").length;
  document.querySelector(".house-Hufflepuff span").textContent = allStudents.filter(student => student.house==="Hufflepuff").length;

  // append clone to list
  document.querySelector(".students-list").appendChild(clone);
  
}

function displayStudentCard(student){
  const popup = document.querySelector("#student-card");
  popup.classList.remove("hide");
  popup.querySelector("#dialog").classList = "";

  //add eventListeners
  popup.querySelector(".closebutton").addEventListener('click', closeStudentCard);
  popup.querySelector("[data-field=prefects]").addEventListener(`click`, isPrefect);
  popup.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
  popup.querySelector("[data-field=expell]").addEventListener('click', expellStudent);

  //define values
  popup.querySelector("#image").src = student.image;
  popup.querySelector("[data-field=firstName]").textContent = student.firstname;
  popup.querySelector("[data-field=middleName]").textContent = student.middlename;
  popup.querySelector("[data-field=nickName").textContent = student.nickname;
  popup.querySelector("[data-field=lastName]").textContent = student.lastname;
  popup.querySelector("[data-field=gender").textContent = student.gender;
  popup.querySelector("[data-field=house]").textContent = student.house;
  popup.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;
  popup.querySelector("[data-field=prefects]").dataset.prefect = student.prefect;

  //define border colour
  if(student.house === "Gryffindor"){
    popup.querySelector("#dialog").classList.add("gryffindor");

  }else if(student.house === "Slytherin"){
    popup.querySelector("#dialog").classList.add("slytherin");
  }else if(student.house === "Ravenclaw"){
    popup.querySelector("#dialog").classList.add("ravenclaw");

  }else{
    popup.querySelector("#dialog").classList.add("hufflepuff");
  }

  // ******* SQUAD *******
  // Define squad status
  if (student.squad) {
    popup.querySelector("[data-field=squad]").textContent = "Squad";
    popup.querySelector("[data-field=squad]").classList.add("active");
  } else {
    popup.querySelector("[data-field=squad]").textContent = "Add to Squad";
    popup.querySelector("[data-field=squad]").classList.remove("active");
  }
  
  function removeEventListeners(){
  popup.querySelector("[data-field=prefects]").removeEventListener(`click`, isPrefect);
  popup.querySelector("[data-field=squad]").removeEventListener(`click`, addToSquad);
  popup.querySelector("[data-field=expell]").removeEventListener('click', expellStudent);
   }

  function addToSquad() {
    if (student.bloodstatus === "Pure-Blood" || student.house === "Slytherin") {
        student.squad = !student.squad;
        globalObject.squad = allStudents.filter(student => student.squad);
    } else {
    alert("you cannot");
    }
    buildList();
    displayStudentCard(student);
  }

  // ******* MAKE PREFECT FROM STUDENT CARD *******
  // Define Prefect status

  if (student.prefect) {
    popup.querySelector("[data-field=prefects]").textContent = "Prefect";
    popup.querySelector("[data-field=prefects]").classList.add("active");
  } else {
    popup.querySelector("[data-field=prefects]").textContent = "Add to Prefects";
    popup.querySelector("[data-field=prefects]").classList.remove("active");
  }
  
  // function to add or remove prefect
  function isPrefect(){
    // untoggle a prefect is always possible, but not toggle it (2 winners for each category)
    if(student.prefect === true){
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    buildList();
    displayStudentCard(student);
  }

  // ****** EXPELL STUDENT FROM STUDENT CARD *******
  function expellStudent(){
    if(student.isHacker){
      alert("you can't b***h!!");

    }else {
    removeEventListeners();
    let oneStudent = allStudents.splice(allStudents.indexOf(student), 1)[0];
    expelledStudents.push(oneStudent);
    buildList();
    showNumbers();
    }

  }

// ****** CLOSE STUDENT CARD *******
  function closeStudentCard(){
  popup.classList.add("hide");
  popup.querySelector("#dialog").classList = "";
  }
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

// ******* BUTTONS *******

function triggerButtons(){
  document.querySelector("#hacking").addEventListener("click", hackTheSystem);
  document.querySelectorAll(".filter").forEach((each) =>{each.addEventListener("click", filterInput);}); 
  document.querySelectorAll("[data-filter=prefects]").forEach((each) =>{each.addEventListener("click", filterByPrefect);}); 
  document.querySelectorAll("[data-filter=squad]").forEach((each) =>{each.addEventListener("click", filterBySquad);}); 
  document.querySelectorAll("[data-filter=expelled]").forEach((each) =>{each.addEventListener("click", showExpelled);}); 
  document.querySelectorAll("[data-filter=enrolled]").forEach((each) =>{each.addEventListener("click", showEnrolled);}); 
  document.querySelector("#sort-options").addEventListener("change", (event) => {
    let selectedOption = event.target.selectedOptions[0];
    globalObject.sortBy = selectedOption.dataset.sort;
    globalObject.sortDir = selectedOption.dataset.sortDirection;
    buildList()});
    document.querySelector("#searchbox").addEventListener("input", liveSearch);
}

// ******* FILTERING *******
// selectFilter (set the event as filter)
function filterInput(event){
  let filter = event.target.dataset.filter;
  console.log(filter);
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
  // displayList(globalObject.squad);
  buildList();
}

function showExpelled(){
  displayList(expelledStudents);
}

function showEnrolled(){
  displayList(allStudents);
}

// ******* SORTING *******

function sortList(sortedList){
  let direction = 1;
  
  if(globalObject.sortDir === "desc"){
    direction = -1;
  }

  sortedList = sortedList.sort(sortByInput);
  
  function sortByInput(studentA, studentB){
    // this is A-Z
    if(studentA[globalObject.sortBy] < studentB[globalObject.sortBy]){
      return -1 * direction;
     }else{
      return 1 * direction;
     }
 }
  return sortedList;
}

// ******* PREFECT *******

function tryToMakeAPrefect(selectedStudent){
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
    document.querySelector("#onlyonekind h1 span").textContent =`${studentB.firstname}`;
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
    buildList();
  }
  
  }
}

// ******* SEARCH BAR ********
// https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
// right now it's searching inside the entire student row, we need to narrow it down to only name, surname e nickname
function liveSearch() {
  // Locate the card elements
  let studentRow = document.querySelectorAll('#single-student');
  let studentName = document.querySelectorAll('#student-fullname');

  // Locate the search input
  let searchBar = document.getElementById("searchbox").value;

  // Loop through the cards
  for (let i = 0; i < studentRow.length; i++) {
    // If the text is within the card, and the text matches the search query, remove the `.is-hidden` class.
    if(studentName[i].innerText.toLowerCase().includes(searchBar.toLowerCase())){
      // we need to keep "remove hide" so that it keeps searching also when we delete a letter
      studentRow[i].classList.remove("hidden");
    } else {
    // Otherwise, add the class.
    studentRow[i].classList.add("hidden");
    }
  }
}

function hackTheSystem(){
  console.log("hacked!");
  hackingFlag = true;
  const kama = createKama();
  const sofia = createSofia()
  allStudents.push(kama);
  allStudents.push(sofia);
  displayList(allStudents);
}

function createKama(){
  const kama = Object.create(allStudents);
  kama.firstname = "Kamarini";
  kama.lastname= "Moragianni";
  kama.middlename= "";
  kama.nickname= "Koukoumafka";
  kama.gender= "girl";
  kama.image= "";
  kama.house= "Hufflepuff";
  kama.bloodstatus= "Muggle";
  kama.squad= false ;
  kama.prefect= false;
  kama.isHacker = true;
  return kama;
}

function createSofia(){
  const sofia = Object.create(allStudents);
  sofia.firstname = "Sofia";
  sofia.lastname = "Amoroso";
  sofia.middlename= "";
  sofia.nickname= "Olivia";
  sofia.gender= "Girl";
  sofia.image= "images/sofia.png";
  sofia.house= "Ravenclaw";
  sofia.bloodstatus= "Muggle";
  sofia.squad= false;
  sofia.prefect= false;
  sofia.isHacker= true;
  return sofia;
}