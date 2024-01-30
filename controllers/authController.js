const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const config = require('../config');
const moment = require('moment');
const User = require('../models/User');
const Image = require('../models/Image')
const Response = require('../models/bcountmodel');
const { Mongoose, default: mongoose } = require('mongoose');
const formatDate = (date) => moment(date).format('YYYY/MM/DD');


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

exports.register = async (req, res) => {
  try {
    const { email, password,UserName,registrationNumber,chosse,
        phoneNumber,branch,address,year,BoadingPoint,gender,ParentPhoneNumber
       } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      UserName,
      registrationNumber,
      chosse,
      branch,
     phoneNumber,
     ParentPhoneNumber,
     BoadingPoint,
     address,
     year,
     gender,
    
     
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid  password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({id:user._id ,token, "isAdmin":"false" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
      const pageNumber = req.query.params - 1 || 0;
      const pageSize = req.query.params;
      const users = await User.find({}, '-password').skip(pageNumber * pageSize).limit(pageSize);

      const maleUsers = users.filter(user => user.gender === 'M');
      const femaleUsers = users.filter(user => user.gender === 'F');

      const maleCount = maleUsers.length;
      const femaleCount = femaleUsers.length;
      const totalCount = users.length;

      // Count of users with Accept set to true
      const acceptedCount = users.reduce((count, user) => {
          count += user.Accepted.filter(acceptance => acceptance.Accept).length;
          return count;
      }, 0);

      // Count of users with Accept set to false
      const rejectedCount = users.reduce((count, user) => {
          count += user.Accepted.filter(acceptance => !acceptance.Accept).length;
          return count;
      }, 0);

      // Count of users in fromrequested array
      const fromRequestedCount = users.reduce((count, user) => {
          count += user.fromrequested.length;
          return count;
      }, 0);

      res.status(200).json({
          users,
          maleCount,
          femaleCount,
          totalCount,
          acceptedCount,
          rejectedCount,
          fromRequestedCount,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve all users' });
  }
};
exports.UpdateUsers = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only the fields you want to change
    user.UserName = req.body.UserName || user.UserName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.ParentPhoneNumber = req.body.ParentPhoneNumber || user.ParentPhoneNumber;
    user.BoadingPoint = req.body.BoadingPoint || user.BoadingPoint;
    user.address = req.body.address || user.address;
    user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.image =  async (req, res) => {
//   try {
//     // const { userId,imageData } = req.body;
//     const fileData = req.file;
//     const userId = req.body.userId;
 
//      // Assuming the user ID is sent in the request body
//     // Ensure you have the correct model for the user (e.g., User model)
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     // Create a new image document and associate it with the user
//     const newDocument = new Image({
//       imageData: fileData.buffer,
//       user: userId // Assuming there is a 'user' field in your ImageModel to associate with a user
//     });

//     await newDocument.save();
//     const imageId = newDocument._id;
  
//     res.status(200).send(`File uploaded successfully for user ${userId}. Image ID: ${imageId}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }

//   };
  exports.image = async (req, res) => {
    try {
      const fileData = req.file;
      const userId = req.body.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
      if (user.image.length > 0) {
        return res.status(400).send('User already has an image. Cannot upload another image.');
      }
      const newDocument = new Image({
        imageData: fileData.buffer,
        user: userId
      });
  
      await newDocument.save();
      const imageId = newDocument._id;
  
      // Update the user's image array with the new imageId
      user.image.push({ imageData: imageId });
      await user.save();
  
      res.status(200).send(`File uploaded successfully for user ${userId}. Image ID: ${imageId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
exports.getimage = async(req,res) =>{
   try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', 'image/jpeg'); // Adjust the content type based on your file type
    res.send(image.imageData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.deleteFromRequested = async (req, res) => {
  const userId = req.params.userId;
  const requestId = req.params.requestId;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Find the index of the request in the fromrequested array
      const requestIndex = user.fromrequested.findIndex(request => request._id.toString() === requestId);

      if (requestIndex === -1) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Use $pull to remove the request from the array
      user.fromrequested.pull({ _id: requestId });

      // Save the updated user document
      await user.save();

      res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete request' });
  }
};


    // exports.updateUser = async (req, res) => {
    //   try {
    //     const userId = req.params.userId;
    //     const updateData = req.body;
    
    //     // Update user details in the database
    //     const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    //     if (!updatedUser) {
    //       return res.status(404).json({ message: 'User not found' });
    //     }
    
    //     res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }
    //     };
        
        // exports.requestform = async(req,res) =>{
        //   try {
        //     const { firstName,registrationNumber,branch,phoneNumber,email,BoardingPoint} = req.body;
        
        //     // Save the response to MongoDB
        //     await Response.create({firstName,registrationNumber,branch,phoneNumber,email,BoardingPoint});
        
        //     res.status(201).json({ message: 'Response saved successfully.'});
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ message: 'Internal Server Error' });
        // }
        // };
exports.studentAttendence = async(req ,res) =>{
  try {
    const { userId, firstName, registrationNumber1, branch1, phoneNumber1, email1, BoardingPoint,gender1,present } = req.body;
    
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.fromrequested.some(record => record.present === present)) {
      return res.status(400).json({ message: ' Already stored the  Requested from' });
    }
    // Add attendance record to the existing user
    user.fromrequested.push({
      firstName,
      registrationNumber1,
      branch1,
      phoneNumber1,
      email1,
      BoardingPoint,
      gender1,
      present
    });

    await user.save();

    res.status(200).json({ message: 'RequestFrom recorded successfully', user: user });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}
exports.Accept = async(req,res)=>{
  try {
    const { userId, Accept, message } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.Accepted.some(record => record.Accept === Accept)) {
      return res.status(400).json({ message: 'Admin already accepted and  Duplicate record' });
    }
    // Add accepted attendance record to the existing user
    user.Accepted.push({
      Accept,
      message,
    });

    await user.save();

    res.status(200).json({ message: 'Admin Form is Accepeted successfully', user: user });
  } catch (error) {
    console.error('Error recording accepted attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}  
exports.BusPassAccept = async(req,res)=>{
  try {
    const { userId, BusAccept } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.AdminbuspassAccepted.some(record => record.BusAccept === true)) {
      return res.status(400).json({ message: 'Admin already AdminbuspassAccepted and  Duplicate record' });
    }
    if (user.AdminbuspassAccepted.some(record => record.BusAccept === false)) {
      return res.status(400).json({ message: 'Admin already AdminbuspassAccepted and  Duplicate record' });
    }
    // Add accepted attendance record to the existing user
    user.AdminbuspassAccepted.push({
      BusAccept,
     
    });

    await user.save();

    res.status(200).json({ message: 'Admin Form is Accepeted successfully', user: user });
  } catch (error) {
    console.error('Error recording accepted attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}  
exports.getOneUser = async(req,res) =>{
  try {
    const userId = req.params.userId;

    // Find the user by ID and exclude the password field
    const user = await User.findById(userId, '-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
}

exports.updatebuspass = async(req,res) =>{
  try {
    const { userId } = req.params;
    const { BusAccept } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the existing record with the new BusAccept value
    user.AdminbuspassAccepted.forEach(record => {
      record.BusAccept = BusAccept;
    });

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: `Admin form is updated successfully with BusAccept: ${BusAccept}`, user: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


  exports.UserupdateId = async (req, res) => {
    try {
      const userId = req.params.id; // Assuming you pass the user ID in the URL
  
      // Fetch the existing user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user properties based on the request body
      const {
      
        UserName,
        phoneNumber,
        address,
        year,
        ParentPhoneNumber
      } = req.body;
  
      // Update only if the field is provided in the request body
     
      if (UserName) user.UserName = UserName;
      if (phoneNumber) user.phoneNumber = phoneNumber;
    
      if (ParentPhoneNumber) user.ParentPhoneNumber = ParentPhoneNumber;
      if (address) user.address = address;
      if (year) user.year = year;
      
      // Save the updated user to the database
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
exports.ResetPassword =async (req,res)=>{
  try {
    // const { userId } = req.params;
    const{email,newPassword,chosse} = req.body
    // const user = await User.findById(userId);

    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }
const user  = await User.findOne({email,chosse})
if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
const hashedPassword = await bcrypt.hash(newPassword, 10);
 user.password = hashedPassword
 await user.save()
 res.status(200).json({ message: 'Reset-Password updated successfully' });
  } catch (error) {
    
  }
}