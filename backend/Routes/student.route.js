let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
  
// Student Model
const { Student,Student_Details,Properties_By_Type}  = require('../Models/Student.js');

// CREATE Student
router.route('/create-student').post((req, res, next) => {
  Student.create({name:req.body.name,
                  email:req.body.email,
                  rollno:req.body.rollno
                }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      Student_Details.create({
                              course:req.body.course,
                              phoneno:req.body.phoneno,
                              address:req.body.address,
                              student_id:data._id
                            }, (error, data) => {
        if (error) {
          return next(error)
        } else {
          console.log(data)
          res.json({"student_id":data.student_id})
        }
      })
     // res.json(data)
    }
  })
});

// CREATE Student Details
router.route('/create-student-details').post((req, res, next) => {
  Student_Details.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

// READ Students
router.route('/').get((req, res) => {
    Student.find((error, data) => {
//  studentSchema.find({name:'Rakshit'},(error,data)  => {
//  studentSchema.find({},{_id:0,email:0},(error,data)  => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// Get Single Student
router.route('/edit-student/:id').get((req, res) => {
  Student.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update Student
router.route('/update-student/:id').put((req, res, next) => {
 // Student.findByIdAndUpdate(req.params.id, {
   Student_Details.updateMany({student_id:req.params.id}, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Student updated successfully !')
    }
  })
})

//Update Many
router.route('/update-student/').put((req, res, next) => {
    Student.updateMany({}, {
     $inc: req.body
   }, (error, data) => {
     if (error) {
       return next(error);
       console.log(error)
     } else {
       res.json(data)
       console.log('Student updated successfully !')
     }
   })
 })

 router.route('/update-properties/').put((req, res, next) => {        /* Array Filters */
  Properties_By_Type.updateOne({id:123456}, 
   { $set:  { "properties.$[elem].email":"n@n.com"} },
   { arrayFilters: [ { "elem.name": "NATASHA" } ] },
  (error, data) => {
   if (error) {
     return next(error);
     console.log(error)
   } else {
     res.json(data)
     console.log('Properties updated successfully !')
   }
 })
})

router.route('/update-properties/add-to-set').put((req, res, next) => {        /* Push or Add to Set */
  Properties_By_Type.updateOne({id:902101}, 
   { $addToSet:  { "properties":req.body} },
  (error, data) => {
   if (error) {
     return next(error);
     console.log(error)
   } else {
     res.json(data)
     console.log('Properties updated successfully !')
   }
 })
})

router.route('/update-properties/pull-from-set').put((req, res, next) => {        /* Pull */
  Properties_By_Type.updateOne({id:902101}, 
   { $pull:  { "properties":req.body} },
  (error, data) => {
   if (error) {
     return next(error);
     console.log(error)
   } else {
     res.json(data)
     console.log('Properties updated successfully !')
   }
 })
})

 router.route('/update-student/email/:id').put((req, res, next) => {
  Student.updateMany({email:req.params.id}, {
   $set: req.body
 }, (error, data) => {
   if (error) {
     return next(error);
     console.log(error)
   } else {
     res.json(data)
     console.log('Student email updated successfully !')
   }
 })
})
// Delete Student
router.route('/delete-student/:id').delete((req, res, next) => {
  Student.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

//Aggregate Pipeline
router.route('/aggregate-demo/').get((req, res) => {
  Student.aggregate(
    [ 
   // { $group : { _id : "$name" } } , 
  //  { $match: { rollno: { $lt: 1000 } } },
  //  { $group: { _id: "$email", total: { $sum: "$rollno" } } }
  //  { $sort:  { "rollno": -1 } }
  //  { $match: { "email": "r@r.com" } },
  //  { $count: "totalEmail"  }

      {
        $group: {
          _id: "$rollno",
          properties: {
            $push: {
              name: "$name",
              email:"$email"
            }
          }
        }
      },
      { $out: "properties_by_type" }, 
    ],
  (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.route('/aggregate-demo/student/:id').get((req, res) => {
  Student.aggregate(
    [ 
        { 
          $match: { 
           _id: mongoose.Types.ObjectId(req.params.id)
          }
        },
        {
          $lookup: {      /* Left Outer Join */
            from: "student_details",
            localField: "_id",
            foreignField: "student_id",
            as: "student_details1",
            /* Pipeline Compataible with Mongo Community edition 5.0   test> db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )*/
           //  pipeline: [         
           //     {
           //       $project:{
           //         course:1,
           //         phoneno:1,
           //         address:1,
           //         _id:0
           //       }
           //     }
          //    ]
          }
        },
        {
          $project:{      //use to select the fileds you want to select
            _id:0,                      //:0 will not select the field
            student_details1:1,         //:1 will select the field
            name:1
          }
        }
    ],
  (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// READ Properties By Type
router.route('/properties').get((req, res) => {
  Properties_By_Type.find((error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
})
module.exports = router;