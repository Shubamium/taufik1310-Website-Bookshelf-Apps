const inputSubmit = document.querySelector("#input-book");
const searchSubmit = document.querySelector("#search-book");
const RENDER_EVENT = "render-book";
const localBooksKey = "books-key";
let books = [];

const renderBook = (bookObj) => {
  const uncompletedBook = document.querySelector("#books");
  uncompletedBook.innerHTML = "";
  const completedBook = document.querySelector("#completed-books");
  completedBook.innerHTML = "";

  for (let book of bookObj) {
    const itemTitle = document.createElement("h3");
    itemTitle.classList.add("item-title");
    itemTitle.innerText = book.title;

    const itemAuthor = document.createElement("p");
    itemAuthor.classList.add("item-author");
    itemAuthor.innerText = `Penulis: ${book.author}`;

    const itemYear = document.createElement("p");
    itemYear.classList.add("item-year");
    itemYear.innerText = `Tahun: ${book.year}`;

    const itemContent = document.createElement("div");
    itemContent.classList.add("content");
    itemContent.append(itemTitle, itemAuthor, itemYear);

    const itemDone = document.createElement("ion-icon");
    itemDone.classList.add("act-btn");
    itemDone.setAttribute("name", "checkmark-circle");

    const itemRemove = document.createElement("ion-icon");
    itemRemove.classList.add("act-btn");
    itemRemove.setAttribute("name", "trash");
    itemRemove.addEventListener("click", () => {
      removeBook(book.id);
    });

    const itemEdit = document.createElement("ion-icon");
    itemEdit.classList.add("act-btn");
    itemEdit.setAttribute("name", "create");
    itemEdit.addEventListener("click", () => {
      editBook(book.id);
    });

    const itemAction = document.createElement("div");
    itemAction.classList.add("action");

    if (book.isCompleted) {
      itemDone.setAttribute("name", "arrow-undo-circle");

      itemDone.addEventListener("click", () => {
        undoBookFromCompleted(book.id);
      });
    } else {
      itemDone.addEventListener("click", () => {
        addBookToCompleted(book.id);
      });
    }
    itemAction.append(itemDone, itemRemove, itemEdit);

    const item = document.createElement("article");
    item.classList.add("item");
    item.append(itemContent, itemAction);

    if (book.isCompleted) {
      completedBook.append(item);
    } else {
      uncompletedBook.append(item);
    }
  }
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

const addBookToCompleted = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const removeBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const undoBookFromCompleted = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const editBook = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  const editBookTitle = document.querySelector("#edit-book-title");
  const editBookAuthor = document.querySelector("#edit-book-author");
  const editBookYear = document.querySelector("#edit-book-year");
  const editBookContainer = document.querySelector(".edit-book-container");
  const blurBody = document.querySelector(".blur-body");

  editBookTitle.value = bookTarget.title;
  editBookAuthor.value = bookTarget.author;
  editBookYear.value = bookTarget.year;

  editBookContainer.classList.add("show");
  blurBody.classList.add("show");

  document.querySelector("#edit-book").addEventListener("submit", () => {
    bookTarget.title = editBookTitle.value;
    bookTarget.author = editBookAuthor.value;
    bookTarget.year = editBookYear.value;
    editBookContainer.classList.remove("show");
    blurBody.classList.remove("show");

    document.dispatchEvent(new Event(RENDER_EVENT));
  });
};

const generateID = () => +new Date();

inputSubmit.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const inputTitle = document.querySelector("#input-book-title").value;
  const inputAuthor = document.querySelector("#input-book-author").value;
  const inputYear = document.querySelector("#input-book-year").value;
  const isCompletedCheck = document.querySelector("#is-completed-book").checked;

  const newBookObj = {
    id: generateID(),
    title: inputTitle,
    author: inputAuthor,
    year: inputYear,
    isCompleted: isCompletedCheck,
  };

  books.push(newBookObj);

  document.dispatchEvent(new Event(RENDER_EVENT));
});

searchSubmit.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const searchBook = document.querySelector("#search-book-title");
  renderBook(
    books.filter((item) => {
      return item.title.toUpperCase().includes(searchBook.value.toUpperCase());
    })
  );
});

document.addEventListener(RENDER_EVENT, () => {
  localStorage.setItem(localBooksKey, JSON.stringify(books));
  renderBook(books);
});

window.addEventListener("load", () => {
  books = JSON.parse(localStorage.getItem(localBooksKey)) || [];
  renderBook(books);
});
