const API = "http://localhost:8000/books";
const inpName = document.querySelector("#inpName");
const inpAuthor = document.querySelector("#inpAuthor");
const inpImg = document.querySelector("#inpImg");
const inpPrice = document.querySelector("#inpPrice");
const btnAdd = document.querySelector("#btnAdd");
const sectionBooks = document.querySelector(".sectionBooks");
const collapseThree = document.querySelector("#collapseThree");
const inpEditName = document.querySelector("#inpEditName");
const inpEditAuthor = document.querySelector("#inpEditAuthor");
const inpEditImg = document.querySelector("#inpEditImg");
const inpEditPrice = document.querySelector("#inpEditPrice");
const btnEditSave = document.querySelector("#btnEditSave");
const inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
let countPage = 1;
let currentPage = 1;

// console.log(inpName, inpAuthor, inpImg, inpPrice);
// console.log(btnAdd);
//! CREATE
btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Введите данные!");
    return;
  }
  let newBook = {
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImg: inpImg.value,
    bookPrice: inpPrice.value,
  };
  createBook(newBook);
  collapseThree.classList.toggle("show");
  inpName.value = "";
  inpAuthor.value = "";
  inpImg.value = "";
  inpPrice.value = "";
});

function createBook(book) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(book),
  }).then(() => readBooks());
}
//!READ
async function readBooks() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  ); //query параметры
  const data = await res.json();
  sectionBooks.innerHTML = "";
  data.forEach((elem) => {
    sectionBooks.innerHTML += `
    <div class="card m-4 cardBook" style="width: 15rem;">
    <img style = "height:300px" src="${elem.bookImg}" alt="${elem.bookName}">
<div class="card-body">
    <h5 class="card-title">${elem.bookName}</h5>
    <p class="text">${elem.bookAuthor}</p>
    <span>${elem.bookPrice}</span>
    <button type="button" class="btn btn-outline-danger btnDelete" id= "${elem.id}">
    Удалить
  </button>
  <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-outline-info btnEdit" id="${elem.id}">
  Редактировать
</button>
<button type="button" class="btn btn-outline-warning">Детальный обзор</button>

</div></div>
    `;
  });
  pageFunc();
}
readBooks();
//!DELETE
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  // console.log(del_class);
  let id = e.target.id;
  // console.log(id);
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then(() => readBooks());
  }
});
//!EDIT
document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  let id = e.target.id;
  if (edit_class.includes("btnEdit")) {
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        inpEditName.value = data.bookName;
        inpEditAuthor.value = data.bookAuthor;
        inpEditImg.value = data.bookImg;
        inpEditPrice.value = data.bookPrice;
        btnEditSave.setAttribute("id", data.id);
      });
  }
});
btnEditSave.addEventListener("click", () => {
  if (
    !inpEditName.value.trim() ||
    !inpEditAuthor.value.trim() ||
    !inpEditImg.value.trim() ||
    !inpEditPrice.value.trim()
  ) {
    alert("Введите данные!");
    return;
  }
  let editedBook = {
    bookName: inpEditName.value,
    bookAuthor: inpEditAuthor.value,
    bookImg: inpEditImg.value,
    bookPrice: inpEditPrice.value,
  };
  editBook(editedBook, btnEditSave.id);
});
function editBook(book, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(book),
  }).then(() => readBooks());
}
//!Search
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  // console.log(search.value);
  readBooks();
});
//! PAGINATION
async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();
  countPage = Math.ceil(data.length / 3);
  // console.log(countPage);
}
// pageFunc();
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readBooks();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readBooks();
});
