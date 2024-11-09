const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let books = [
    { id: 1, title: "JavaScript 기초", author: "홍길동", price: 25000, stock: 10 },
    { id: 2, title: "HTML/CSS 입문", author: "김철수", price: 30000, stock: 5 },
    { id: 3, title: "웹 개발 시작하기", author: "이영희", price: 28000, stock: 8 }
];

app.get('/books', (req, res) => {
    res.json(books);
});

app.post('/books', (req, res) => {
    try {
        const { title, author, price, stock } = req.body;

        if (!title || !author || price === undefined || stock === undefined) {
            throw new Error("요청 정보가 누락되었습니다.");
        }

        if (price <= 0||stock <=0) {
            throw new Error("도서 추가에 실패했습니다");
        }
        const maxId = books.length > 0 ? Math.max(...books.map(book => book.id)) : 0;
        const addedBook = {
            id: maxId + 1,
            title,
            author,
            price,
            stock
        };

        books.push(addedBook);
        res.status(201).json(addedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = books.find(book => book.id == id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "해당 id의 책을 찾을 수 없습니다." });
    }
});

app.put("/books/:id", (req, res) => {
  try {
    const id = req.params.id;
    let { stock } = req.body;
    stock = Number(stock);
    if (stock < 0) {
      throw new Error("재고 수정에 실패했습니다");
    }
    const book = books.find((book) => book.id == id);
    if (book) {
      book.stock = stock;
      res.json(book);
    } else {
      res.status(404).json({ message: "해당 id의 책을 찾을 수 없습니다." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    const bookIndex = books.findIndex(book => book.id == id);

    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1);
        res.json({ message: "책이 삭제되었습니다.", book: deletedBook[0] });
    } else {
        res.status(404).json({ message: "해당 id의 책을 찾을 수 없습니다." });
    }
});

app.listen(port, () => {
    console.log(`도서 관리 서버 실행 - http://localhost:${port}`);
});
