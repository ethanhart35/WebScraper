var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    _headlineId: {
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },
    date : String,
    noteText : String

});

var note = mongoose.model("Note", noteSchema);

module.exports = note;