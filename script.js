import someBooks from "./data.js";

// Library mechanism logic
class Book {
  constructor(title, author, pages, read, cover, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.cover = cover;
    this.id = id;
  }
  toggleRead() {
    this.read = !this.read;
  }
}

class Library {
  #library = [];

  get library() {
    return this.#library;
  }

  addBook(title, author, pages, read, cover) {
    let id = crypto.randomUUID();
    let book = new Book(title, author, pages, read, cover, id);
    this.library.push(book);
  }

  editBook(updates, id) {
    const index = this.findBook(id);
    if (index === -1) return;
    Object.assign(this.library[index], { ...updates, id });
  }

  deleteBook(id) {
    const index = this.findBook(id);
    if (index === -1) return;
    this.library.splice(index, 1);
  }

  toggleReadStatus(id) {
    const index = this.findBook(id);
    if (index === -1) return;
    this.library[index].toggleRead();
  }

  findBook(id) {
    return this.library.findIndex((book) => book.id === id);
  }
}

class LibraryView {
  constructor() {
    this.booksGridEl = document.querySelector("#books-grid");
    this.dialogEl = document.querySelector(".add-book dialog");
    this.formEl = document.querySelector("#add-book-form");
    this.dialogHeadingEl = document.querySelector("dialog h1");
    this.dialogIsAdd = true;
  }

  displayBooks(library) {
    this.booksGridEl.innerHTML = "";
    library.forEach((book) => {
      const card = this.#createCard(book);
      this.booksGridEl.append(card);
    });
  }

  #createCard(book) {
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

    img.src = book.cover;

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
    cardFooter.append(btnToggle, btnEdit, btnDelete);
    info.append(title, author, pages, read, cardFooter);
    card.append(cover, info);

    return card;
  }

  showModal(type, book) {
    if (type === "add") {
      this.dialogIsAdd = true;
      this.dialogHeadingEl.textContent = "Add a new book";
      this.dialogEl.showModal();
      this.formEl.reset();
      this.formEl.dataset.bookId = "";
    } else if (type === "edit") {
      this.dialogIsAdd = false;
      this.dialogHeadingEl.textContent = "Edit this book";
      this.dialogEl.showModal();
      this.formEl.dataset.bookId = book.id;
      this.formEl.elements["book-title"].value = book.title;
      this.formEl.elements["book-author"].value = book.author;
      this.formEl.elements["book-pages"].value = book.pages;
      this.formEl.elements["book-read"].checked = book.read;
      this.formEl.elements["book-cover"].value = book.cover;
    }
  }
}

class LibraryController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  loadDummyData() {
    someBooks.forEach((book) => {
      this.model.addBook(...book);
    });
  }

  init() {
    this.view.displayBooks(this.model.library);

    // Card Delete/Edit/Toggle logic
    document.addEventListener("click", (e) => {
      // Add
      if (e.target.classList[0] === "btn-add") {
        this.view.showModal("add");
      }

      // Edit
      if (e.target.classList[0] === "btn-edit") {
        const id = e.target.dataset.bookId;
        const index = this.model.findBook(id);
        this.view.showModal("edit", this.model.library[index]);
      }

      // Delete
      if (e.target.classList[0] === "btn-delete") {
        this.model.deleteBook(e.target.dataset.bookId);
        this.view.displayBooks(this.model.library);
      }

      // Toggle
      if (e.target.classList[0] === "btn-toggle") {
        const id = e.target.dataset.bookId;
        this.model.toggleReadStatus(id);
        this.view.displayBooks(this.model.library);
      }
    });

    // Form submit logic
    this.view.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = this.view.formEl.elements["book-title"].value;
      const author = this.view.formEl.elements["book-author"].value;
      const pages = this.view.formEl.elements["book-pages"].value;
      const read = this.view.formEl.elements["book-read"].checked;
      const cover =
        this.view.formEl.elements["book-cover"].value ||
        "https://placehold.co/180x300";

      if (this.view.dialogIsAdd) {
        this.model.addBook(title, author, pages, read, cover);
      } else {
        const id = this.view.formEl.dataset.bookId;
        this.model.editBook({ title, author, pages, read, cover }, id);
      }
      this.view.displayBooks(this.model.library);
      this.view.dialogEl.close();
    });
  }
}

const babel = new Library();
const view = new LibraryView();
const controller = new LibraryController(babel, view);
controller.loadDummyData();
controller.init();
