var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var prefsSchema = new Schema({
	uid: String,
	font: String,
	bg: String,
	border: String,
	fontColor: String
});

mongoose.model('Prefs', prefsSchema);