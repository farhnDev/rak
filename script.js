
const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved_book";
const STORAGE_KEY = "BOOK_APPS";


function generateId(){
    return +new Date();
}


function addBook() {

    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const generateID = generateId();
    const isCompleted = document.getElementById("inputBookIsComplete").checked;


    const bookObject = generateBookObject(generateID, title, author, year, isCompleted);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


function generateBookObject(id, title, author, year, isCompleted){
    return{
        id,
        title,
        author,
        year,
        isCompleted,
    };
}


function creatBookElement(bookObject){
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;


    const textAuthor = document.createElement('p');
    textAuthor.innerHTML = `<span style="color:cornflowerblue">Penulis:</span> ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;


    const statusBook = document.createElement('button');
    statusBook.classList.add('green');


    const buttonRemove = document.createElement('button');
    buttonRemove.classList.add('red');
    buttonRemove.innerText = "Hapus Buku";




    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    actionContainer.append(statusBook,buttonRemove);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-button');
    actionContainer.append(editBtn);

    editBtn.addEventListener('click', function () {

        showModalEdit();

        const bookId = container.getAttribute('id').replace('book-', '');
        console.log('Book ID:', bookId);


        const bookIdToFind = parseInt(bookId);
        const book = findBook(bookIdToFind);


        if (book) {

            const modalTitleInput = document.getElementById('editTitle');
            const modalAuthorInput = document.getElementById('editAuthor');
            const modalYearInput = document.getElementById('editYear');

            modalTitleInput.value = book.title;
            modalAuthorInput.value = book.author;
            modalYearInput.value = book.year;

            const saveButton = document.getElementById('saveEditButton');
            saveButton.addEventListener('click', function () {

                const editedTitle = modalTitleInput.value;
                const editedAuthor = modalAuthorInput.value;
                const editedYear = modalYearInput.value;

                book.title = editedTitle;
                book.author = editedAuthor;
                book.year = editedYear;

                updateBookList();


                hideModalEdit();
            });
        } else {
            console.error(`Buku dengan ID ${bookId} tidak ditemukan.`);
        }
    });



    const modalEdit = document.getElementById('myModal');
    if (!modalEdit) {
        console.error('Modal HTML dengan ID modalEdit tidak ditemukan dalam dokumen.');
    }


    const container = document.createElement('article');
    container.classList.add('book_item');
    container.setAttribute("id", `book-${bookObject.id}`);
    container.append(textTitle,textAuthor,textYear,actionContainer);
    container.setAttribute("id",`book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        statusBook.innerText = "Belum selesai dibaca";
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        actionContainer.append(checkButton);
    } else {
        statusBook.innerText = "Selesai dibaca";

    }

    statusBook.addEventListener('click', function () {
        if (bookObject.isCompleted) {

            toUncompleted(bookObject.id);
        } else {
            toCompleted(bookObject.id);

        }
    });

    buttonRemove.addEventListener('click', function () {

        const confirmationModal = document.getElementById('confirmationModal');


        const confirmYesButton = document.getElementById('confirmYes');
        const confirmNoButton = document.getElementById('confirmNo');


        confirmYesButton.addEventListener('click', function () {

            const bookId = container.getAttribute('id').replace('book-', '');
            console.log('Book ID:', bookId);


            const bookIdToFind = parseInt(bookId);
            const indexToRemove = books.findIndex(book => book.id === bookIdToFind);

            if (indexToRemove !== -1) {
                books.splice(indexToRemove, 1);

                confirmationModal.style.display = 'none';


                updateBookList();
            }

            saveData();

        });


        confirmNoButton.addEventListener('click', function () {
            confirmationModal.style.display = 'none';
        });


        buttonRemove.addEventListener('click', function () {

            confirmationModal.style.display = 'block';
        });

    });

    return container;

}

function showModalEdit() {
    const modalEdit = document.getElementById('myModal');
    modalEdit.style.display = 'block';
}


function hideModalEdit() {
    const modalEdit = document.getElementById('myModal');
    modalEdit.style.display = 'none';
}

function updateBookList() {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");


    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";


    for (const bookItem of books) {
        const bookElement = creatBookElement(bookItem);


        const targetId = bookItem.isCompleted ? completeBookshelf.id : incompleteBookshelf.id;


        document.getElementById(targetId).appendChild(bookElement);
    }

    saveData();
}



    function findBook(bookId) {
        for (const bookItem of books) {
            if (bookItem.id === bookId) {
                return bookItem;
            }
        }
        return null;
    }



    function toCompleted(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function toUncompleted(bookId){
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return ;

        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }



function loadDataStorage(){

    const serializedStorage = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedStorage);
    if (data !== null){
        for (const bok of data){
            books.push(bok);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}


    // function saveData;
    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }


    function isStorageExist(){
        if (typeof Storage === undefined){
            alert("browser itu tidak mendukung");
            return false;
        }
        return true;
    }
    function bookSearch(searchValue) {
        return books.filter((book) => {
            return (
                book.title.toLowerCase().includes(searchValue) ||
                book.author.toLowerCase().includes(searchValue) ||
                book.year.toString().includes(searchValue)
            );
        });
    }

    function displaySearchResults(searchValue) {
        const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
        const completeBookshelf = document.getElementById("completeBookshelfList");

        const searchResults = bookSearch(searchValue);


        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        if (searchResults.length === 0) {
            incompleteBookshelf.textContent = "Tidak ada hasil pencarian.";
            completeBookshelf.textContent = "Tidak ada hasil pencarian.";
        } else {
            searchResults.forEach((book) => {
                const bookElement = creatBookElement(book);


                const targetId = book.isCompleted ? completeBookshelf.id : incompleteBookshelf.id;


                document.getElementById(targetId).appendChild(bookElement);
            });
        }
    }
    function data() {
        const searchInput = document.getElementById('searchBookTitle').value.toLowerCase();
        displaySearchResults(searchInput);
    }
    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        data();
    });
    const submitForm = document.getElementById('searchSubmit');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        data();
    });



    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(STORAGE_KEY));
    });

    document.addEventListener(RENDER_EVENT,function (){

        const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
        incompleteBookshelf.innerHTML = "";
        const completeBookshelf = document.getElementById("completeBookshelfList");
        completeBookshelf.innerHTML = "";

        for (const bookItem of books){

            const bookElement = creatBookElement(bookItem);
            if (bookItem.isCompleted) {
                completeBookshelf.appendChild(bookElement);
            } else {
                incompleteBookshelf.appendChild(bookElement);
            }
        }
    });


    document.addEventListener("DOMContentLoaded",function (){
        const submitForm = document.getElementById('inputBook');
        submitForm.addEventListener('submit', function (event){
            event.preventDefault();
            addBook();
            data();
            showModalEdit();
            hideModalEdit();
            updateBookList();
            const searchInput = document.getElementById('searchBookTitle').value.toLowerCase();
            displaySearchResults(searchInput);
        });


        if (isStorageExist()){
            loadDataStorage();
        }
    });