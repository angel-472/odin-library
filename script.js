const btnAddBook = document.getElementById("add-book");
const booksContainer = document.getElementById("books");

const btnEditorSave = document.getElementById("book-editor-save");
const btnEditorClose = document.getElementById("book-editor-close");
const bookEditor = document.getElementById("book-editor");
const txtEditorTitle = document.getElementById("book-editor-title");
const txtEditorAuthor = document.getElementById("book-editor-author");

let books = {};
const statuses = {
  0: 'Unread',
  1: 'Reading',
  2: 'Completed',
}

btnAddBook.addEventListener("click", (e) => {
  bookEditor.style.display = "flex";

  //resets inputs
  txtEditorTitle.value = "";
  txtEditorAuthor.value = "";
});
btnEditorSave.addEventListener("click", (e) => {
  let title = txtEditorTitle.value;
  let author = txtEditorAuthor.value;
  bookEditor.style.display = "none";
  if(title == "" || author == ""){
    return;
  }
  addBookToLibrary(title,author,0);
});
btnEditorClose.addEventListener("click", (e) => {
  bookEditor.style.display = "none";
});

function Book(title, author, status){
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.status = status;
}

function addBookToLibrary(title, author, status){
  let book = new Book(title,author,status);
  books[book.id] = book;
  let element = getNewBookElement(book);
  booksContainer.appendChild(element);
  book.element = element;
}

function getNewBookElement(book){
  let element = document.createElement("div");
  element.classList.add("book");
  element.innerHTML = `
  <img class="book-icon" src="https://api.dicebear.com/5.x/icons/svg?seed=${book.title}">
  <div class="book-info">
    <p class="book-title">${book.title}</p>
    <p class="book-author">By: ${book.author}</p>
  </div>
  <div class="book-buttons">
    <button data-book="${book.id}" class="button button-status status-${book.status}">${statuses[book.status]}</button>
    <button data-book="${book.id}" class="button button-remove">Remove</button>
  </div>
  `
  return element;
}

document.addEventListener('click', ({ target }) => {
  if (target.matches('button')) {
    let bookId = target.getAttribute('data-book');
    if (bookId !== undefined){
      let book = books[bookId];
      if(target.classList.contains("button-remove")){
        console.log("remove book " + bookId);
        book.element.remove();
        delete books[bookId];
      }
      else if(target.classList.contains("button-status")){
        console.log("change status book " + bookId);
        let status = book.status;
        let newStatus = book.status + 1 < Object.keys(statuses).length ? book.status + 1 : 0;
        target.classList.remove("status-" + book.status);
        target.classList.add("status-" + newStatus);
        book.status = newStatus;
        target.innerText = statuses[newStatus];
      }
    }
  }
});

function saveLocalStorage(){
  window.localStorage.setItem('library_readinglist', JSON.stringify(books));
}

function loadLocalStorage(){
  let savedBooks = JSON.parse(window.localStorage.getItem('library_readinglist'));
  Object.values(savedBooks).forEach((book) => {
    addBookToLibrary(book.title, book.author, book.status);
  });
}

//runs them
loadLocalStorage();
setInterval(() => saveLocalStorage(), 1000);
