const express = require('express')
const router = express.Router()
const Registeration = require('../models/Registeration')
const ContactForm = require('../models/ContactForm');
 const nodemailer = require('nodemailer');

// create user signup 
  
router.post('/signup', async (req, res) => {
  try {
    const { name, mobileNumber, password, email } = req.body;

    // Create a new instance of the Registration model
    const registration = new Registeration({
      name,
      mobileNumber,
      password,
      email,
    }); 
    // Save the registration record to the database
    const savedRegistration = await registration.save();

    res.status(200).json({ message: 'Registration successful', userDetail: savedRegistration , statu: true });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});


// Admin Login
router.post('/signin', (req, res) => {
  Registeration.findOne({
    email: req.body.email,
    password: req.body.password,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }
    if (!user) {
      return res.status(404).send({
        message: 'user email or password is incorrect.',
        userDetail: null,
        statu: false,
      })
    }
    if (user) {
      Registeration.findOne({ email: req.body.email }, function (err, doc) {
        return res
          .status(200)
          .send({ message: 'user is logged in', userDetail: doc, optional:err, statu: true })
      })
    }
  })
})
 
// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const email = req.body.email;
  try {
    const user = await Registeration.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        message: 'user not found',
        status: false,
      });
    }
    const new_password = Math.random().toString(36).slice(-8); // Generate a new random password
    user.password = req.body.password;
    await user.save(); // Save the new password to the user document in the database
    // Send the new password to the user via email or other means
    return res.status(200).send({
      message: 'successfully',
      status: true,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
 
 // Contact Us
router.post('/contact', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  try {
    // Save the contact form data to the database
    const contactForm = new ContactForm({
      name,
      email,
      message,
    });
    await contactForm.save();
    
   const transporter = nodemailer.createTransport({
        service:"goDaddy",
        host: "smtp.office365.com",
        port: 465,
        secure: false,
         auth: {
           user: "hello@techingcopilot.com",
           pass: "Duane@cgpt123" 
       },
       tls: {
            rejectUnauthorized: false 
       }
    });
 
    let sendMessage = {
        from: `${email}`,
        to: "hikmatullahit@gmail.com",
        subject: "Enquiry from Deane Project Management",
        html: `
        <hr />
            <h1>Request for: ${ "No title"}</h1>
            <span>Name: ${name}</span><br/>
            <span>Email: ${email}</span><br/>
            <span>Phone: ${ "No phone"}</span><br/>
            <span>Message:</span><br/>
            <p>${message || "No message"}</p>
        <hr />
        ` }
 
    transporter.sendMail(sendMessage, function (err, info) {
        return res.status(200).send({
         message: 'Your message has been sent',
         status: true,
         err:err
       });
    }); 
   
  } catch (err) {
    console.error(err, 'error');
    return res.status(500).send({
      message: 'An error occurred while sending your message. Please try again later.',
      status: false,
    });
  } 
});

 
module.exports = router
