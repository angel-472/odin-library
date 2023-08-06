class Book {
  constructor(title, author, status){
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.status = status;
  }
}

class LibraryApp {
  constructor(){
    this.books = {};

    this.btnAddBook = document.getElementById("add-book");
    this.booksContainer = document.getElementById("books");

    this.btnEditorSave = document.getElementById("book-editor-save");
    this.btnEditorClose = document.getElementById("book-editor-close");
    this.bookEditor = document.getElementById("book-editor");
    this.txtEditorTitle = document.getElementById("book-editor-title");
    this.txtEditorAuthor = document.getElementById("book-editor-author");
    this.divNoBooks = document.getElementById("no-books");
    this.editorValidationMessage = document.getElementById("book-editor-error-message");

    this.statuses = {
      0: 'Unread',
      1: 'Reading',
      2: 'Completed',
    }
  }
  init(){
    this.btnAddBook.addEventListener("click", (e) => {
      this.bookEditor.style.display = "flex";

      //resets inputs
      this.txtEditorTitle.value = "";
      this.txtEditorAuthor.value = "";

      this.editorValidationMessage.style.display = "none";
    });

    this.btnEditorSave.addEventListener("click", (e) => {
      let title = this.txtEditorTitle.value;
      let author = this.txtEditorAuthor.value;
      if(title == "" || author == ""){
        this.editorValidationMessage.textContent = 'Please make sure to fill all fields';
        this.editorValidationMessage.style.display = 'block';
        return;
      }
      else {
        this.bookEditor.style.display = "none";
        this.addBook(title,author,0);
      }
    });

    this.btnEditorClose.addEventListener("click", (e) => {
      this.bookEditor.style.display = "none";
    });

    document.addEventListener('click', ({ target }) => {
      if (target.matches('button')) {
        let bookId = target.getAttribute('data-book');
        if (bookId !== undefined){
          let book = this.books[bookId];
          if(target.classList.contains("button-remove")){
            console.log("remove book " + bookId);
            book.element.remove();
            delete this.books[bookId];
          }
          else if(target.classList.contains("button-status")){
            console.log("change status book " + bookId);
            let status = book.status;
            let newStatus = book.status + 1 < Object.keys(this.statuses).length ? book.status + 1 : 0;
            target.classList.remove("status-" + book.status);
            target.classList.add("status-" + newStatus);
            book.status = newStatus;
            target.innerText = this.statuses[newStatus];
          }
        }
      }
    });

    this.loadLocalStorage();
    setInterval(() => this.saveLocalStorage(), 1000);

    //no books div
    setInterval(() => {
      if(Object.keys(this.books).length < 1 && this.divNoBooks.style.display !== 'flex'){
        this.divNoBooks.style.display = 'flex';
      }
      else if(Object.keys(this.books).length > 0 && this.divNoBooks.style.display !== 'none') {
        this.divNoBooks.style.display = 'none';
      }
    }, 100);
  }
  addBook(title, author, status){
    let book = new Book(title,author,status);
    this.books[book.id] = book;
    let element = this.getNewBookElement(book);
    this.booksContainer.appendChild(element);
    book.element = element;
  }
  getNewBookElement(book){
    let element = document.createElement("div");
    element.classList.add("book");
    element.innerHTML = `
    <img class="book-icon" src="https://api.dicebear.com/5.x/icons/svg?seed=${book.title}">
    <div class="book-info">
      <p class="book-title">${book.title}</p>
      <p class="book-author">By: ${book.author}</p>
    </div>
    <div class="book-buttons">
      <button data-book="${book.id}" class="button button-status status-${book.status}">${this.statuses[book.status]}</button>
      <button data-book="${book.id}" class="button button-remove">Remove</button>
    </div>
    `
    return element;
  }
  saveLocalStorage(){
    window.localStorage.setItem('library_readinglist', JSON.stringify(this.books));
  }
  loadLocalStorage(){
    if(window.localStorage.getItem('library_readinglist') == undefined) return;
    let savedBooks = JSON.parse(window.localStorage.getItem('library_readinglist'));
    Object.values(savedBooks).forEach((book) => {
      library.addBook(book.title, book.author, book.status);
    });
  }
}

const library = new LibraryApp();
library.init();
