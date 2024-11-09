const apiUrl = 'http://localhost:3000/books';
let books = [];
let currentPage = 1;
const rowsPerPage = 5;
let sortDirection = 1; //1인경우 오름차순 ,-1내림차순 
let sortField = 'title';

async function fetchBooks() {
    try {
        const res = await fetch(apiUrl);
        books = await res.json();
        displayBooks();
    } catch (error) {
        console.error(new Error(`Error: ${errorData.message}`));
    }
}

function displayBooks() {
    const tbody = document.getElementById('bookTableBody');
    tbody.innerHTML = '';

    let filteredBooks = books.filter(book => {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        return (
            book.title.toLowerCase().includes(searchInput) ||
            book.author.toLowerCase().includes(searchInput)
        );
    });

    filteredBooks.sort((a, b) => { //1인경우 오름차순으로 
        if (a[sortField] < b[sortField]) return -sortDirection;
        if (a[sortField] > b[sortField]) return sortDirection;
        return 0;
    });

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedBooks = filteredBooks.slice(start, start + rowsPerPage);

    for (const book of paginatedBooks) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price}</td>
            <td>${book.stock}</td>
            <td>
                <button class="btn detail-btn" 
                    onclick="openEditModal(${book.id}, '${book.title}', '${book.author}', ${book.price}, ${book.stock})">
                    상세
                </button>
                <button class="btn delete-btn" onclick="deleteBook(${book.id})">삭제</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
    setupPagination(filteredBooks.length);
}

function setupPagination(totalItems) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.disabled = i === currentPage;
        btn.className = 'page-btn';
        btn.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        paginationDiv.appendChild(btn);
    }
}

document.getElementById('addBookForm').addEventListener('submit', addBook);

async function addBook(e) {
    e.preventDefault(); 

    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const price = Number(document.getElementById('price').value);
    const stock = Number(document.getElementById('stock').value);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, price, stock })
        });

        if (response.status === 201) {
            await fetchBooks(); 
            e.target.reset(); 
        } else {
            const errorData = await response.json(); 
            alert(errorData.message); 
            console.error(new Error(`Error: ${errorData.message}`)); 
        }
    } catch (error) {
        console.error('Unexpected Error:', error); 
    }
}

async function deleteBook(id) {
    const confirmDelete = confirm('정말로 이 도서를 삭제하시겠습니까?');
    if (!confirmDelete) return; 
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message); 
            throw new Error(`Error: ${errorData.message}`); 
        }
        await fetchBooks();
    } catch (error) {
        console.error('Unexpected Error:', error); 
    }
}

function openEditModal(id, title, author, price, stock) {
    document.getElementById('editModal').style.display = 'block';

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalAuthor').textContent = author;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalStock').textContent = stock;

    document.getElementById('editBookId').value = id;
    document.getElementById('editStock').value = stock;
}

document.getElementById('closeModal').onclick = function () {
    document.getElementById('editModal').style.display = 'none';
};


document.getElementById('editBookForm').addEventListener('submit', updateStock);

async function updateStock(e) {
  e.preventDefault();

  const id = document.getElementById("editBookId").value;
  const stock = Number(document.getElementById("editStock").value);

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });

    if (response.ok) {
      await fetchBooks();
      document.getElementById("editModal").style.display = "none";
    } else {
      const errorData = await response.json();
      console.error(new Error(`Error: ${errorData.message}`));
      alert(errorData.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
}

document.getElementById('searchInput').addEventListener('input', function () {
    currentPage = 1;
    displayBooks();
});
document.querySelectorAll('th[data-sort]').forEach(header => {
    header.addEventListener('click', function () {
        const field = this.getAttribute('data-sort');
        if (sortField === field) {
            sortDirection *= -1;
        } else {
            sortField = field;
            sortDirection = 1;
        }
        displayBooks();
    });
});

fetchBooks();
