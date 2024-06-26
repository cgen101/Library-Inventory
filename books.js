//Author: Chloe Gentry
//Last modified: 11/21/2023
//File name: books.js- model file containing book schema and virtual function;

const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const BookSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String},
    author: { type: String}, 
    publisher: { type: String },
    isbn: { type: String},
    avail: { type: Boolean},
    who: { type: String, default: 'null'},
    due: { type: String, default: 'null'}
}, { versionKey: false });


//Virtual function to display book id and title
BookSchema.virtual("IDandTitle")
    .get(function () {
        return { id: this.id, title: this.title, author:this.author};
    })
    .set(function (v) {
        this.set({ id: v.id, title: v.title, author: v.author });
    });

module.exports = model('Books', BookSchema);