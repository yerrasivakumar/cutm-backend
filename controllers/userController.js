
const jwt = require('jsonwebtoken');
// const Response = require('../models/bcountmodel')
const Admin = require('../models/Admin')
const Feedbacks = require('../models/bcountmodel')
const ContactForm = require('../models/Email')
const bcrypt = require('bcrypt'); 
// const Image = require('../models/Image')

 // exports.getadminDetails = async (req, res) => {
//   try {
//     const userId = req.user.userId; // Extracted from the JWT token

//     // Retrieve user details from the database
//     const user =  await User.find({},'-password')

//     // if (!user) {
//     //   return res.status(404).json({ message: 'User not found' });
//     // }

//     res.status(200).json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const User1 = require('../models/User');

// exports.getOneUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Retrieve user details from the database
//     const user = await User1.findById(userId).select('-password');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const updateData = req.body;

//     // Update user details in the database
//     const updatedUser = await User1.findByIdAndUpdate(userId, updateData, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'User updated successfully', user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// exports.totalcount = async (req ,res) =>{
//     try {
//     //   console.log('sss',count);
//       const userCounts = await Response.find();
//     const yesCount = userCounts.filter((count) => count.answer === 'yes').length;
//     const noCount = userCounts.filter((count) => count.answer === 'no').length;
//     const totalCount = userCounts.length;

//     res.status(200).json({ yesCount, noCount, totalCount, userCounts });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
//   }     

  exports.adminRegistration = async (req,res) =>{
    try {

        const { email, password,username,
            phonenumber,employeeId
           } = req.body;
           const existingUser = await Admin.findOne({ email });
           if (existingUser) {
             return res.status(400).json({ message: 'Email already registered' });
           }
       
           // Hash the password
           const hashedPassword = await bcrypt.hash(password, 10);
       
           // Create a new user
           const user = new Admin({
             email,
             password: hashedPassword,
             username,
             phonenumber,employeeId
            
           });
       
           // Save the user to the database
           await user.save();
       
           res.status(201).json({ message: 'Admin registered successfully' });
         } catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Internal server error' });
         }
  }
   // Make sure to import bcrypt

  exports.adminLogin = async (req, res) => {
      const { email, password } = req.body;
      try {
          // Find the user by email
          const admin = await Admin.findOne({ email });
  
          if (!admin) {
              return res.status(401).json({ message: 'Invalid email' });
          }
  
          // Use bcrypt.compare to validate the password
          const isPasswordValid = await bcrypt.compare(password, admin.password);
  
          if (!isPasswordValid) {
              return res.status(401).json({ message: 'Invalid password' });
          }
  
          // Create a JWT token
          const token = jwt.sign(
              { adminId: admin._id, isAdmin: admin.isAdmin },
              'your-secret-key',
              { expiresIn: '2h' }
          );
  
          const adminResponse = {
              _id: admin._id,
              adminname: admin.username,
              email: admin.email,
              isAdmin: admin.isAdmin,
              employeeId: admin.employeeId,
              phonenumber: admin.phonenumber,
          };
  
          res.json({ token, admin: adminResponse });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };
  

  // exports.imageUpload = async(req,res) =>{
  //   try {
  //     const { base64Image} = req.body;
  
  //     // Decode base64 image
  //     const dataBuffer = Buffer.from(base64Image, 'base64');
  
  //     // Create new Image document
  //     const newImage = new Image({
  //       data: dataBuffer,
  //     //  contentType,
  //     });
  
  //     // Save the image to MongoDB
  //     await newImage.save();
  
  //     res.status(201).json({ message: 'Image uploaded successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }
  // exports.imageAll = async(req,res) => {
  //   try {
  //     const images = await Image.find();
  
  //     const imageInfo = images.map(image => ({
  //       contentType: image.contentType,
  //       dataSize: image.data.length,
  //       base64Data: image.data.toString('base64'),
  //     }));
  
  //     res.status(200).json(imageInfo);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }
exports.feedback = async (req,res) =>{
try {
  const {Username,Branch,FeedBack} = req.body
  const existingFeedback = await Feedbacks.findOne({ Username, Branch,FeedBack});

    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this user and branch' });
    }
  const user = new Feedbacks({
    Username,
    Branch,
    FeedBack
  })
  await user.save()
  res.status(201).json({ message: 'FeedBack Submited Sucessfully successfully' });
} catch (error) {
  res.status(500).json({ message: 'Internal server error' });
}
}

exports.Allfeedback = async(req,res)=>{
try {
  const allFeedbacks = await Feedbacks.find();
  res.status(200).json({ feedbacks: allFeedbacks });
} catch (error) {
  res.status(500).json({ message: 'Internal server error' });
}
}

exports.Cform = async (req,res) =>{
  try {
    const {Name,Gmail,Message} = req.body
    // const existingFeedback = await Feedbacks.findOne({ Username, Branch,FeedBack});
  
    //   if (existingFeedback) {
    //     return res.status(400).json({ message: 'Feedback already submitted for this user and branch' });
    //   }
    const user = new ContactForm({
      Name,
      Gmail,
      Message
    })
    await user.save()
    res.status(201).json({ message: 'ContactFrom Submited Sucessfully successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
  }

  exports.AllEmails = async(req,res)=>{
    try {
      const allmsg = await ContactForm.find();
      res.status(200).json({ Forms: allmsg });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
    }