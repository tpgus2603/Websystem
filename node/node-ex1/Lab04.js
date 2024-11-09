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

let id=3;

app.listen(port, () => {
    console.log(`도서 관리 서버 실행 - http://localhost:${port}`);
});
app.get('/books',(req,res)=>{
    res.status(200).json(books);
});
app.post('/books',(req,res,next)=>
{
    const {title,author,price,stock} =req.body;
    id++;
    if(title==null||author==null||price==null||stock==null)
    {
        res.status(400).json({message :'요청 정보가 누락되었습니다'});
    }
    else
    {
        books.push({id,title,author,price,stock});
        res.status(201).json({id,title,author,price,stock});
    }
    
}
)
app.get('/books/:id',(req,res)=>
{
    const sid=req.params.id;
    let flag=false;
    for(let i=0;i<books.length;i++)
    {
        if(books[i].id==sid)
        {
            flag=true;
            res.json(books[i]);
        }
    }
    if(!flag)
        res.status(404).json({message :'해당 id의 값을 찾을 수 없습니다'});
}
)
app.put('/books/:id',(req,res)=>
{
    const {stock}=req.body;
    let sid=req.params.id;
    let flag= false;
    if(stock<0)
    {
        res.status(400).json({message:'재고가 음수입니다 '})
    }
    else
    {
        for(let i=0;i<books.length;i++)
        {
            if(books[i].id==sid)
            {
                books[i].stock=stock;
                res.status(200).json(books[i]);
                flag=true;
            }
        }
        if(!flag)
            res.status(404).json({message :'해당 id의 값을 찾을 수 없습니다'});
    }
}
)
app.delete('/books/:id',(req,res)=>
{
    let sid=req.params.id;
    let flag= false;
    for(let i=0;i<books.length;i++)
    {
        if(books[i].id==sid)
        {
            flag=true;
            res.status(200).json({message:'책이 삭제되었습니다',books:books[i]});
            books.splice(i, 1);  
            if(sid==id)
                id--;
        }
    }
    if(!flag)
    {
        res.status(404).json({message :'해당 id의 책을 찾을 수 없습니다'});
    }
}
)




