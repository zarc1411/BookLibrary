const PAGE = {
    READING: 0,
    COMPLETED: 1,
    DROPPED: 2,
    PLANNED: 3
}

Object.freeze(PAGE);

let currentPage = PAGE.READING;
let myReadingLibrary = [];
let myCompletedLibrary = [];
let myDroppedLibrary = [];
let myPlannedLibrary = [];

function Book(title, author, pages, isOnScreen) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isOnScreen = isOnScreen;
}

function addBookToReadingLibrary(title, author, pages, isOnScreen) {
    myReadingLibrary.push(new Book(title, author, pages, isOnScreen));
}

function addBookToCompletedLibrary(title, author, pages, isOnScreen) {
    myCompletedLibrary.push(new Book(title, author, pages, isOnScreen));
}

function addBookToDroppedLibrary(title, author, pages, isOnScreen) {
    myDroppedLibrary.push(new Book(title, author, pages, isOnScreen));
}

function addBookToPlannedLibrary(title, author, pages, isOnScreen) {
    myPlannedLibrary.push(new Book(title, author, pages, isOnScreen));
}

addBookToReadingLibrary('And Then There Were None', 'Agatha Christie', 264, false);

function toggleFormClasses(formAddBook) {
    formAddBook.classList.toggle("formPopupCSS");
    formAddBook.classList.toggle("formPopup");
}

function openOrCloseForm() {
    const formAddBook = document.getElementById("formAddBook");
    toggleFormClasses(formAddBook);
    return formAddBook;
}

const addBookButton = document.querySelector('.addButton');
addBookButton.addEventListener('click', openOrCloseForm);

const formAddBookButton = document.getElementById("formAddBookButton");
formAddBookButton.addEventListener('click', addBookFromForm);

function addBookFromForm() {
    const title = document.getElementById("formTitle").value;
    const author = document.getElementById("formAuthor").value;
    const pages = document.getElementById("formPages").value;
    let isOnScreen = false;
    if (title !== "" && author !== "" && pages !== "") {
        switch (currentPage) {
            case PAGE.READING: addBookToReadingLibrary(title, author, pages, isOnScreen);
                break;
            case PAGE.COMPLETED: addBookToCompletedLibrary(title, author, pages, isOnScreen);
                break;
            case PAGE.DROPPED: addBookToDroppedLibrary(title, author, pages, isOnScreen);
                break;
            case PAGE.PLANNED: addBookToPlannedLibrary(title, author, pages, isOnScreen);
                break;
        }
        renderBooks();
        openOrCloseForm();
    }
}

function createBook(bookTitle, bookAuthor, bookPages, bookIndex) {
    const shelf = document.getElementById('shelf');
    const bookDiv = document.createElement('div');
    const formPopup = document.getElementById("formAddBook");
    shelf.insertBefore(bookDiv, formPopup);
    bookDiv.setAttribute("dataIndex", "" + bookIndex);
    bookDiv.classList.add("bookInfo");

    const spanTitle = document.createElement('span');
    spanTitle.innerHTML = bookTitle;
    bookDiv.appendChild(spanTitle);

    const spanAuthor = document.createElement('span');
    spanAuthor.innerHTML = bookAuthor;
    bookDiv.appendChild(spanAuthor);

    const spanPages = document.createElement('span');
    spanPages.innerHTML = bookPages;
    bookDiv.appendChild(spanPages);

    const button = document.createElement('button');
    button.classList.add("deleteBook");
    /*If you're dynamically creating and adding buttons, its better to add 
    eventListener right then or add the event listeners in some function 
    because the script will only run once*/
    button.addEventListener('click' , deleteBookFromLibrary); 
    bookDiv.appendChild(button);

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add("fa", "fa-trash", "fa-2x");
    button.appendChild(deleteIcon);
}


function getBookInfo(library) {
    let bookIndex = -1;
    if (library.length > 0) {
        library.forEach(item => {
            const bookTitle = item.title;
            const bookAuthor = item.author;
            const bookPages = item.pages;
            let isOnScreen = item.isOnScreen;
            ++bookIndex;
            if (!isOnScreen) {
                item.isOnScreen = true;
                createBook(bookTitle, bookAuthor, bookPages, bookIndex);
            }
        })
    }
}

const getReadingLibraryInfo = () => getBookInfo(myReadingLibrary);
const getCompletedLibraryInfo = () => getBookInfo(myCompletedLibrary);
const getDroppedLibraryInfo = () => getBookInfo(myDroppedLibrary);
const getPlannedLibraryInfo = () => getBookInfo(myPlannedLibrary);

function renderBooks() {
    switch (currentPage) {
        case PAGE.READING: getReadingLibraryInfo();
            break;
        case PAGE.COMPLETED: getCompletedLibraryInfo();
            break;
        case PAGE.DROPPED: getDroppedLibraryInfo();
            break;
        case PAGE.PLANNED: getPlannedLibraryInfo();
            break;
    }
}

renderBooks();

const formCancelButton = document.getElementById("formCancelButton");
formCancelButton.addEventListener('click', openOrCloseForm);

function deleteBookFromDOM(parentNode){
    const shelf = document.getElementById('shelf');
    shelf.removeChild(parentNode);
}

function deleteBookFromLibrary(e) {
    console.log(e);
    const parentNode = e.currentTarget.parentElement;
    console.log(parentNode);
    const index = parentNode.getAttribute("dataindex");
    console.log(index);
    switch (currentPage) {
        case PAGE.READING: myReadingLibrary.splice(index, 1);
            break;
        case PAGE.COMPLETED: myCompletedLibrary.splice(index, 1);
            break;
        case PAGE.DROPPED: myDroppedLibrary.splice(index, 1);
            break;
        case PAGE.PLANNED: myPlannedLibrary.splice(index, 1);
            break;
    }
    deleteBookFromDOM(parentNode);
    renderBooks();
}

function clearShelf(){
    const shelf = document.getElementById('shelf');
    const children = shelf.getElementsByClassName('bookInfo');

    /*We are looping from reverse because if we delete from the start
    we also change the list , so it wont work properly*/

    for(let i = children.length-1 ; i>=0 ; i--){
        children[i].remove();
    }
    renderBooks();
}

const clearReadingLibraryFromScreen = () => clearLibraryFromScreen(myReadingLibrary);
const clearCompletedLibraryFromScreen = () => clearLibraryFromScreen(myCompletedLibrary);
const clearDroppedLibraryFromScreen = () => clearLibraryFromScreen(myDroppedLibrary);
const clearPlannedLibraryFromScreen = () => clearLibraryFromScreen(myPlannedLibrary);

function clearLibraryFromScreen(library){
    for(let i = 0 ; i<library.length ; i++){
        library[i]["isOnScreen"] = false;
    }
}

const libraryClearFunctions = [
    clearReadingLibraryFromScreen,
    clearCompletedLibraryFromScreen,
    clearDroppedLibraryFromScreen,
    clearPlannedLibraryFromScreen
]

function chooseWhichLibraryToClearFromScreen(){
    let currentPageIndex = currentPage;
    for(let i = 0 ; i<libraryClearFunctions.length ; i++){
        if(i!==currentPageIndex){
            libraryClearFunctions[i]();
        }
    }
}

const readingPageButton = document.getElementById('reading');
readingPageButton.addEventListener('click' , () => {
    if(currentPage!=PAGE.READING){
        currentPage = PAGE.READING;
        clearShelf();
        chooseWhichLibraryToClearFromScreen();
    }
})

const completedPageButton = document.getElementById('completed');
completedPageButton.addEventListener('click' , () => {
    if(currentPage!=PAGE.COMPLETED){
        currentPage = PAGE.COMPLETED;
        clearShelf();
        chooseWhichLibraryToClearFromScreen();
    }
})

const droppedPageButton = document.getElementById('dropped');
droppedPageButton.addEventListener('click' , () => {
    if(currentPage!=PAGE.DROPPED){
        currentPage = PAGE.DROPPED;
        clearShelf();
        chooseWhichLibraryToClearFromScreen();
    }
})

const plannedPageButton = document.getElementById('planned');
plannedPageButton.addEventListener('click' , ()=>{
    if(currentPage!=PAGE.PLANNED){
        currentPage = PAGE.PLANNED;
        clearShelf();
        chooseWhichLibraryToClearFromScreen();
    }
})