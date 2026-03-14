// Library mechanism logic
const myLibrary = [];

class Book {
  constructor(title, author, pages, read, coverURL, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.coverURL = coverURL;
    this.id = id;
  }
  toggleRead() {
    this.read = !this.read;
  }
}

function addBookToLibrary(title, author, pages, read, coverURL) {
  let id = crypto.randomUUID();
  let book = new Book(title, author, pages, read, coverURL, id);
  myLibrary.push(book);
}

function deleteBook(bookId) {
  const bookIndex = findBook(bookId);
  myLibrary.splice(bookIndex, 1);
}

function findBook(bookId) {
  for (let book of myLibrary) {
    if (book.id === bookId) {
      return myLibrary.indexOf(book);
    }
  }
}

// Initialize Library
addBookToLibrary(
  "To Kill a Mockingbird",
  "Harper Lee",
  "281",
  true,
  "https://covers.openlibrary.org/b/id/15153500-M.jpg"
);
addBookToLibrary(
  "1984",
  "George Orwell",
  "328",
  false,
  "https://covers.openlibrary.org/b/id/12693610-M.jpg"
);
addBookToLibrary(
  "The Great Gatsby",
  "F. Scott Fitzgerald",
  "180",
  true,
  "https://covers.openlibrary.org/b/id/12364437-M.jpg"
);
addBookToLibrary(
  "Sapiens: A Brief History of Humankind",
  "Yuval Noah Harari",
  "498",
  false,
  "https://covers.openlibrary.org/b/id/9137127-M.jpg"
);
addBookToLibrary(
  "The Alchemist",
  "Paulo Coelho",
  "208",
  true,
  "https://covers.openlibrary.org/b/id/15121528-M.jpg"
);

// Display logic
function displayBooks(library) {
  const booksGrid = document.getElementById("books-grid");
  booksGrid.innerHTML = "";
  library.forEach((book) => {
    const card = createCard(book);
    booksGrid.append(card);
  });
}

function createCard(book) {
  const card = document.createElement("section");
  const cover = document.createElement("div");
  const info = document.createElement("div");
  const img = document.createElement("img");
  const title = document.createElement("h1");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const read = document.createElement("p");
  const cardFooter = document.createElement("footer");
  const btnEdit = document.createElement("button");
  const btnDelete = document.createElement("button");
  const btnToggle = document.createElement("button");

  card.classList.add("card");
  cover.classList.add("cover");
  info.classList.add("info");
  title.classList.add("title");
  author.classList.add("author");
  pages.classList.add("pages");
  read.classList.add("read");
  cardFooter.classList.add("card-footer");
  btnEdit.classList.add("btn-edit");
  btnDelete.classList.add("btn-delete");
  btnToggle.classList.add("btn-toggle");

  img.src = book.coverURL;

  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = book.pages + " pages";
  read.textContent = book.read ? "Read" : "Not read";
  btnEdit.textContent = "Edit";
  btnDelete.textContent = "Delete";
  btnToggle.textContent = book.read ? "Toggle Not Read" : "Toggle Read";

  btnEdit.dataset.bookId = book.id;
  btnDelete.dataset.bookId = book.id;
  btnToggle.dataset.bookId = book.id;

  cover.append(img);
  cardFooter.append(btnEdit, btnDelete, btnToggle);
  info.append(title, author, pages, read, cardFooter);
  card.append(cover, info);

  return card;
}

// Dialog display mechanisim
const dialog = document.querySelector(".add-book dialog");
const addBookBtn = document.querySelector(".add-book button");
const form = document.getElementById("add-book-form");
let dialogIsAdd = true;
const dialogHeading = document.querySelector("dialog h1");

addBookBtn.addEventListener("click", () => {
  dialogIsAdd = true;
  dialogHeading.textContent = "Add a new book";
  dialog.showModal();
  form.reset();
  form.dataset.bookId = "";
});

// Delete/Edit logic
document.addEventListener("click", (e) => {
  // Delete
  if (e.target.classList[0] === "btn-delete") {
    deleteBook(e.target.dataset.bookId);
    displayBooks(myLibrary);
  }

  // Edit
  if (e.target.classList[0] === "btn-edit") {
    dialogIsAdd = false;
    dialogHeading.textContent = "Edit this book";
    dialog.showModal();
    const bookId = e.target.dataset.bookId;
    form.dataset.bookId = bookId;
    const bookIndex = findBook(bookId);
    form.elements["book-title"].value = myLibrary[bookIndex].title;
    form.elements["book-author"].value = myLibrary[bookIndex].author;
    form.elements["book-pages"].value = myLibrary[bookIndex].pages;
    form.elements["book-read"].checked = myLibrary[bookIndex].read;
    form.elements["book-cover"].value = myLibrary[bookIndex].coverURL;
  }

  // Toggle
  if (e.target.classList[0] === "btn-toggle") {
    const bookId = e.target.dataset.bookId;
    const bookIndex = findBook(bookId);
    console.log(bookIndex);
    myLibrary[bookIndex].toggleRead();
    displayBooks(myLibrary);
  }
});

// Add/Edit book
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = form.elements["book-title"].value;
  const author = form.elements["book-author"].value;
  const pages = form.elements["book-pages"].value;
  const read = form.elements["book-read"].checked;
  const cover = form.elements["book-cover"].value;

  if (dialogIsAdd) {
    addBookToLibrary(title, author, pages, read, cover);
  } else {
    const bookId = form.dataset.bookId;
    const bookIndex = findBook(bookId);
    myLibrary[bookIndex].title = title;
    myLibrary[bookIndex].author = author;
    myLibrary[bookIndex].pages = pages;
    myLibrary[bookIndex].read = read;
    myLibrary[bookIndex].coverURL = cover;
  }
  displayBooks(myLibrary);
  dialog.close();
});

displayBooks(myLibrary);
