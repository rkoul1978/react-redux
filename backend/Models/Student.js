const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
  name:  String,
  email: String,
  rollno:Number
}, { collection: 'students' });

let studentDetailsSchema = new Schema({
  course:  String,
  phoneno: String,
  address: String,
  hobbies:[String],
  date: { type: Date, default: Date.now },
  student_id: { type: Schema.ObjectId, ref:'Student'}
  }, { collection: 'student_details' });

let propertiesByTypeSchema = new Schema ({
  id: Number,
  properties:[{
    name: String,
    email: String,
    phoneno:String
  }]
}, { collection: 'properties_by_type'});
  
const Student = mongoose.model('Student', studentSchema)
const Student_Details = mongoose.model('Student_Details', studentDetailsSchema)
const Properties_By_Type = mongoose.model('Properties_By_Type', propertiesByTypeSchema)

module.exports = { Student,Student_Details,Properties_By_Type}