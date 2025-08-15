document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");

  loadBooks();

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const newBook = {
      id: +new Date(),
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete,
    };

    addBookToShelf(newBook);
    saveBooks();
    inputBookForm.reset();
  });

  function addBookToShelf(book) {
    const shelfList = book.isComplete
      ? document.getElementById("completeBookshelfList")
      : document.getElementById("incompleteBookshelfList");

    const bookItem = createBookElement(book);
    shelfList.appendChild(bookItem);
  }

  function createBookElement(book) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.dataset.id = book.id;
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <div class="action">
        <button class="${book.isComplete ? "green" : "red"}">${
      book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca"
    }</button>
        <button class="red deleteButton">Hapus buku</button>
      </div>
    `;

    const deleteButton = bookItem.querySelector(".deleteButton");
    deleteButton.addEventListener("click", function () {
      deleteBook(bookItem.dataset.id);
    });

    const statusButton = bookItem.querySelector(".action > button");
    statusButton.addEventListener("click", function () {
      toggleBookStatus(book, bookItem);
    });

    return bookItem;
  }

  function toggleBookStatus(book, bookItem) {
    book.isComplete = !book.isComplete;
    const shelfList = book.isComplete
      ? document.getElementById("completeBookshelfList")
      : document.getElementById("incompleteBookshelfList");
    shelfList.appendChild(bookItem);

    const statusButton = bookItem.querySelector(".action > button");
    statusButton.textContent = book.isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";
    statusButton.classList.toggle("green");
    statusButton.classList.toggle("red");

    saveBooks();
  }

  function deleteBook(id) {
    const bookItem = document.querySelector(`.book_item[data-id="${id}"]`);
    if (bookItem) {
      bookItem.remove();
      saveBooks();
    }
  }

  function saveBooks() {
    const incompleteBooks = Array.from(
      document.querySelectorAll("#incompleteBookshelfList .book_item")
    ).map((bookItem) => {
      return {
        id: bookItem.dataset.id,
        title: bookItem.querySelector("h3").textContent,
        author: bookItem
          .querySelector("p:nth-of-type(1)")
          .textContent.split(": ")[1],
        year: parseInt(
          bookItem.querySelector("p:nth-of-type(2)").textContent.split(": ")[1]
        ),
        isComplete: false,
      };
    });

    const completeBooks = Array.from(
      document.querySelectorAll("#completeBookshelfList .book_item")
    ).map((bookItem) => {
      return {
        id: bookItem.dataset.id,
        title: bookItem.querySelector("h3").textContent,
        author: bookItem
          .querySelector("p:nth-of-type(1)")
          .textContent.split(": ")[1],
        year: parseInt(
          bookItem.querySelector("p:nth-of-type(2)").textContent.split(": ")[1]
        ),
        isComplete: true,
      };
    });

    localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }

  function loadBooks() {
    const incompleteBooks =
      JSON.parse(localStorage.getItem("incompleteBooks")) || [];
    const completeBooks =
      JSON.parse(localStorage.getItem("completeBooks")) || [];

    incompleteBooks.forEach((book) => {
      addBookToShelf(book);
    });

    completeBooks.forEach((book) => {
      addBookToShelf(book);
    });
  }
});
