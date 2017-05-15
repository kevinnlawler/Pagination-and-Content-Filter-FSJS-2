/* Techdegree: Project #2 - Pagination & Content Filter */
/* Treehouse: Kevin Lawler - GitHub: kevinnlawler - Slack: kevin.lawler */

/* INITIAL VARIABLES */
let range;
let inputFieldName;
let currentPage = 1;
let studentList = document.getElementsByClassName("student-list")[0].children;

/* INITIAL FUNCTIONS */
createPage();
pagesPerList(studentList.length);
showPage(studentList);

/* PAGINATION CLICK HANDLER */
/* Manage active link, call function to append page for Search or Full page. */
document.getElementsByClassName("pagination")[0].addEventListener("click", function(event) {
  if (event.target.nodeName === "A") {
    activePage(currentPage, false);
    currentPage = event.target.innerText;
    activePage(currentPage, true);
    appendToPage();
  }
});

/* ACTIVE PAGE */
/* Toggle the pagination. */
function activePage(index, isActive) {
  let page = document.getElementsByClassName("pagination")[0];

  if (isActive) {
    page.children[index-1].children[0].classList.add("active");
  } else {
      page.children[index-1].children[0].classList.remove("active");
  }
}

/* CREATE PAGE */
/* Add elements to build page. */
function createPage() {
  let paginationList = document.createElement("ul");
    paginationList.classList.add("pagination");
    document.querySelector(".page").appendChild(paginationList);

  let searchDiv = document.createElement("div");
    searchDiv.classList.add("student-search");

  let inputBox = document.createElement("input");
    inputBox.placeholder = "Search for students...";
    inputBox.id = "inputBox";
    searchDiv.appendChild(inputBox);

  let searchBtn = document.createElement("button");
    searchBtn.innerText = "search";
    searchBtn.id = "searchBtn";
    searchDiv.appendChild(searchBtn);
    document.querySelector(".page-header").appendChild(searchDiv);

  let resetBtn = document.createElement("button");
    resetBtn.innerText = "reset";
    resetBtn.id = "resetBtn";
    searchDiv.appendChild(resetBtn);
    document.querySelector(".page-header").appendChild(searchDiv);

/* 'NOT FOUND' DIV */
/* Create DIV for indicating Not Found search message */
  let notFound = document.createElement("div");
    notFound.id = "notFound";
    document.querySelector(".page").appendChild(notFound);

/* PAGE RANGE COUNT */
/* Create DIV for indicating student range message on current page */
  range = document.createElement("div");
    range.id = "range";
    document.querySelector(".page-header").appendChild(range);
}

/* SHOW PAGE */
/* Display on a page the student info for 10 students at a time. Show info for student list range based on pagination. Correct count to list length when student file not evenly divisible by 10. Hide all other student's info. */
function showPage(list) {
  const studentDivPerPage = 10;
  let startIndex = (currentPage * studentDivPerPage) - studentDivPerPage;
  let endIndex = currentPage * studentDivPerPage;
  let firstOfTen = startIndex;
  let lastOfTen = endIndex;

  if (endIndex > studentList.length) {
    lastOfTen = studentList.length;
  }
  range.innerHTML = "<b> Students " + (firstOfTen + 1) + " to " + lastOfTen + " of " + studentList.length + "</b>";
  range.style.display = "block";

  if (inputFieldName) {
    range.style.display = "none";
  }

  for (let i = 0; i < list.length; i++) {
    if (i >= startIndex && i < endIndex) {
      list[i].style.display = "block";
    } else {
        list[i].style.display = "none";
    }
  }
}

/* SEARCH and RESET CLICK HANDLERS */
/* Check input and alert if no entry, call function to append for Search page/Full page, reload first page as a Reset */
document.getElementById("searchBtn").addEventListener("click", function() {
  let inputText = this.previousElementSibling.value;
  inputFieldName = inputText;
  appendToPage();
});
document.getElementById("resetBtn").addEventListener("click", function() {
  window.location.reload(true);
});

/* HOW MANY PAGES */
/* Determines how many page buttons to display based on length of given student list, and having 10 students for each pagination. */
function pagesPerList(totalStudents) {
  let list = document.getElementsByClassName("pagination")[0];
  const studentsPerPagin = 10;
  let totalPages =  Math.ceil(totalStudents / studentsPerPagin);

  if (list) {
    removePagination(list);
  }

  if (currentPage > totalPages) {
    currentPage = 1;
  }

  if (totalPages > 1 ) {
    addPagination(totalPages, list);
    activePage(currentPage, true);
  }
}

/* REMOVE FROM PAGINATION PAGES */
function removePagination(list) {
  list.innerHTML = "";
}

/* ADD TO PAGINATION PAGES */
function addPagination(pageCount, list) {
  for (let i = 1; i <= pageCount; i++) {
    let paginNumber = document.createElement("li");
    let paginLink = document.createElement("a");
    paginLink.innerText = i;
    paginLink.setAttribute("href", "#" +i );
    paginNumber.appendChild(paginLink);
    list.appendChild(paginNumber);
  }
}

/* APPEND PAGE LINKS */
/* Function is called to create page whether from a search input or from clicking page buttons. */
function appendToPage() {
  let searchResultCount;

  if (inputFieldName) {
    searchResultCount = searchList();
    pagesPerList(searchResultCount);
    searchResults();
  } else {
      showPage(studentList);
  }
}

/* HIDE ALL BUT SEARCH */
/* Hide all elements not part of a successful search. */
function hideAllButSearch(list) {
  for(let i = 0; i < list.length; i++) {
  list[i].style.display="none";
  }
}

/* SEARCH LIST */
/* Use Regular Expression coding to determine if input at search-box matches a student, based on list name, or email. If successful matching, allow a SHOW of student info on page. Allow a HIDE if search not found. */
function searchList() {
  let letterMatcher = RegExp("\\b" + inputFieldName);
  let searchSuccessNum = 0;

  for (let i = 0; i < studentList.length; i++) {
    let listName = studentList[i].getElementsByTagName("H3")[0].innerText;
    let listEmail = studentList[i].getElementsByClassName("email")[0].innerText;

    studentList[i].style.display="none";

  if (letterMatcher.test(listName) || letterMatcher.test(listEmail)) {
    studentList[i].classList.add("show");
    studentList[i].classList.remove("hide");
    searchSuccessNum++;
    } else {
        studentList[i].classList.remove("show");
        studentList[i].classList.add("hide");
    }
  }
  return searchSuccessNum;
}

/* DISPLAY SEARCH RESULTS or NOT FOUND */
/* Use current SHOW and HIDE classes to properly display search results. When no search info found, call function to hide list and have notFound info DIV display. */
function searchResults() {
  let showList = document.querySelectorAll(".show");
  let hideList = document.querySelectorAll(".hide");
  let notFound = document.getElementById("notFound");

  hideAllButSearch(hideList);

  if (showList.length > 0) {
    notFound.style.display = "none";
    showPage(showList);
  } else {
      notFound.innerHTML = "<b> Sorry, student</b" + "<b> ' </b>" + inputFieldName + "<b> ' </b>" + "<b>was not found.</b>";
      notFound.style.display = "block";
      range.style.display = "none";
  }
}
