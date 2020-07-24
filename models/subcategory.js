const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    name: String,
    categoryId: String
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
