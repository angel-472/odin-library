const btnAddBook = document.getElementById("add-book");
const btnEditorSave = document.getElementById("book-editor-save");
const btnEditorClose = document.getElementById("book-editor-close");
const bookEditor = document.getElementById("book-editor")
const booksContainer = document.getElementById("books");

const books = {};
const statuses = {
  0: 'Unread',
  1: 'Reading',
  2: 'Completed',
}

btnAddBook.addEventListener("click", (e) => {
  bookEditor.style.display = "flex";
});
btnEditorSave.addEventListener("click", (e) => {

});
btnEditorClose.addEventListener("click", (e) => {
  bookEditor.style.display = "none";
});

function Book(title, author){
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.status = 0;
}

function addBookToLibrary(title, author){
  let book = new Book(title,author);
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
