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
      name: name,
      email: email,
      message: message,
    });
    await contactForm.save();

 
 
 
  try {
    // Create a transport object with SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'mail.teachingcopilot.com',
      port: 465,
      secure: false,
      auth: {
        user: 'hello@teachingcopilot.com',
        pass: 'Duane@cgpt123',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: email,
      to: 'hikmatullahit@gmil.com',
      subject: message,
      text: message,
    });
      return res.status(200).send({
      message: 'successfully sent',
      status: true,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (err) {
     return res.status(200).send({
      message: err,
      status: false,
    });
  }

 
 
 
});
 
module.exports = router
