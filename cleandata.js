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

// function tryToMakeAPrefect(selectedStudent){
//   const prefects = allStudents.filter(student => student.prefect)
//   // i'm populating sameHouseAndGender when the selected students match the criteria on the return
//   const sameHouseAndGender = prefects.filter(student => student.house === selectedStudent.house && student.gender === selectedStudent.gender).shift();

//     // if other is different than undefined, it means that is has been populated
//     if (sameHouseAndGender !== undefined){
//       console.log("Prefects must be a boy and a girl!");
//       removeAorB(sameHouseAndGender, selectedStudent);
//   } else {
//       makePrefect(selectedStudent);
//   }

//   function removeAorB(studentA, studentB){
//     // show names on buttons
//     document.querySelector("#onlytwowinners [data-action=remove1] span").textContent =`${studentA.firstname}, the ${studentA.house}`;
//     document.querySelector("#onlytwowinners [data-action=remove2] span").textContent = `${studentB.firstname}, the ${studentB.house}`;
  
//     // ask the user to ignore or remove 'A or B
//     document.querySelector("#onlytwowinners").classList.remove("hide");
//     document.querySelector("#onlytwowinners .closebutton").addEventListener("click", closeDialog);
//     document.querySelector("#onlytwowinners [data-action=remove1]").addEventListener("click", clickRemoveA);
//     document.querySelector("#onlytwowinners [data-action=remove2]").addEventListener("click", clickRemoveB);
  
//     // if ignore, do nothing
//     function closeDialog(){
//     document.querySelector("#onlytwowinners").classList.add("hide");
//     document.querySelector("#onlytwowinners .closebutton").removeEventListener("click", closeDialog);
//     document.querySelector("#onlytwowinners [data-action=remove1]").removeEventListener("click", clickRemoveA);
//     document.querySelector("#onlytwowinners [data-action=remove2]").removeEventListener("click", clickRemoveB);
//     }
  
//   function clickRemoveA(){
//         removePrefect(studentA);
//         makePrefect(selectedStudent);
//         // buildList();
//         displayList();
//         closeDialog();
//     }
  
//   function clickRemoveB(){
//     // else - if removeB
//     removePrefect(studentB);
//     makePrefect(selectedStudent);
//     // buildList();
//     displayList();
//     closeDialog();
//     }
  

// -------------------- SOLUTION 2 - ANY GENDER, BUT MAX 2 ------------------------------
function tryToMakeAPrefect(selectedStudent){
  const prefects = allStudents.filter(student => student.prefect)
  const EachHousePrefects = prefects.filter(student => student.house === selectedStudent.house);


    // if other is different than undefined, it means that is has been populated
    if (EachHousePrefects.length >= 2){
      console.log("There can only be 2 prefects for each house");
      removeOther(selectedStudent, EachHousePrefects[0], EachHousePrefects[1]);
  } else {
      makePrefect(selectedStudent);
  }

  function removeOther(other, prefect1, prefect2){
    // show name on button
    document.querySelector("#onlytwo [data-action=remove1] span").textContent =`${other.firstname}`;
    document.querySelector("#onlytwo [data-action=remove2] span").textContent =`${prefect1.firstname}`;
    document.querySelector("#onlytwo [data-action=remove3] span").textContent =`${prefect2.firstname}`;
  
    //  !!!! i'm tired but there are stuff to fix hereeee -----------------------------------------------------
    // ask the user to ignore or remove the other
    document.querySelector("#onlytwo").classList.remove("hide");
    document.querySelector("#onlytwo .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlytwo p button").addEventListener("click", clickRemoveOther);
    // if ignore, do nothing (remove the event listeneras good practice)
    function closeDialog(){
    document.querySelector("#onlytwo").classList.add("hide");
    document.querySelector("#onlytwo .closebutton").removeEventListener("click", closeDialog);
    document.querySelector("#onlytwo p button").removeEventListener("click", clickRemoveOther);
    }
  
  function clickRemoveOther(){
    removePrefect(other);
    makePrefect(selectedStudent);
    // buildList();
    displayList();
    closeDialog();
    }
    }
  
   
}

function removePrefect(prefectStudent){
  console.log("remove prefect");
  prefectStudent.prefect = false;
}

function makePrefect(student){
  student.prefect = true;
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

  if(student.squad){
    clone.querySelector("[data-field=squad]").textContent = "⭐";  
  } else {
    clone.querySelector("[data-field=squad]").textContent = "☆";
  }
  // set clone data
  clone.querySelector("#image").src = student.image;
  clone.querySelector("[data-field=firstName").textContent = student.firstname;
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  clone.querySelector("[data-field=nickName").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  clone.querySelector("[data-field=gender").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=bloodStatus]").textContent = student.bloodstatus;

  //add someone to the squad
  clone.querySelector("[data-field=squad]").addEventListener(`click`, addToSquad);
    function addToSquad(){
      if(student.bloodstatus ==="Pure Blood" || student.house ==="Slytherin"){
        student.squad = !student.squad;
       }else{
         alert("you cannott")
       }
      }

  //put a student in prefect
  clone.querySelector("[data-field=prefects]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefects]").addEventListener(`click`, makePrefect);

    function makePrefect(){
       console.log("im in makePrefect function")
        // untoggle a prefect is always possible, but not toggle it (2 winners for each category)
        if(student.prefect === true){
            student.prefect = false;
        } else {
            tryToMakeAPrefect(student);
            console.log("im in the else")
        }
        //buildList();
        //displayList(); //??????????????????
    displayList();
    }
      
     
    
  

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);

  }