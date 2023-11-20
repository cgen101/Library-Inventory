var express = require('express');
const mongoose = require('./mongoose'); 
const Book = require('./books');

var app = express();

app.use(express.json());
app.use(function(req, res, next) {   
   res.header('Access-Control-Allow-Origin', '*');   
   res.header('Access-Control-Allow-Methods', 
   'GET,PUT,POST,PATCH,DELETE,OPTIONS');   
   res.header('Access-Control-Allow-Headers',         
   'Content-Type, Authorization, Content-Length, X-Requested-With');   
   if (req.method === "OPTIONS") res.sendStatus(200);   
   else next(); 
});


app.get('/books', async (req, res) => {
   try {
      const avail = req.query.avail;

      if (avail !== undefined) 
      {
         filteredBooks = await Book.find({ avail });
      }
      
      const allBooks = await Book.find({});

      if (avail)
         responseBookList = responseBooks(filteredBooks); 
      else 
         responseBookList = responseBooks(allBooks); 

      if (!allBooks)
         res.status(404).json({error:"ERROR 404: No books found."}); 
      else
      res.status(200).json(responseBookList); 
   } catch (error) {
       console.error(error);
       res.status(500).send('Internal Server Error');
   }
});

//helper fxn
function responseBooks(listBooks) 
{ 
   const response = (listBooks).map(book => ({
      id: book.IDandTitle.id,
      title: book.IDandTitle.title
   }));

   return response;
}


app.post("/books", async (req, res) => { 
   const newBook = req.body;
   try { 
      const bookExists = await Book.exists({id: newBook.id}); 
      if (!bookExists)
      {  
         const newBookData = new Book(newBook);
         const savedBook = await newBookData.save();
         
         console.log("201 OK");
         res.status(201).json(responseBooks(newBook)); 
         return;
      }
      else 
      { 
         console.log("ERROR 403: book already exists.");
         res.status(403).json({error:"ERROR 403: book already exists."});
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
}); 

app.get("/books/:id", async (req, res) => { 
   try {
      const bookId = req.params.id; 
      const book = await Book.findOne({ id: bookId }).select('-_id');

      if (book)
      {
         res.status(200).json(book); 
         console.log("200 OK"); 
         return;
      }
      else 
      {
         res.status(404).json({error:"ERROR 404: Book not found."}); 
         console.log("ERROR 404: Book not found");
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
});

app.put("/books/:id", async (req,res) => { 
   const bookId = req.params.id; 
   const updateBookData = req.body; 

   try { 
      const updateBook = await Book.findOneAndUpdate( 
         { id: bookId },
         { $set: updateBookData },
         { new: true });

      if (updateBook)
      {
         res.status(200).json(updateBook); 
         console.log("200 OK");
         return;
      }
      else
      {
         res.status(404).json({error:"ERROR 404: book not found."}); 
         console.log("ERROR 404: book not found.");
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
}); 

app.delete("/books/:id", async (req,res) => { 
   const bookId = req.params.id; 
   try { 
      const deleteBook = await Book.findOneAndDelete( 
         {id: bookId});

      if (deleteBook)
      { 
         res.status(200).send("200"); 
         console.log("200 OK"); 
         return;
      }
      else 
      { 
         res.status(204).json({error:"ERROR 204: nothing to delete."}); 
         console.log("ERROR 204: nothing to delete.");
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }    
});


app.listen(3000, () => {
   console.log("Server running at http://localhost:3000/books");
});

