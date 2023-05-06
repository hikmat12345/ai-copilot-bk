const express = require('express')
const router = express.Router()
const Registeration = require('../models/Registeration')
const ContactForm = require('../models/ContactForm');
 
// create user signup
router.post('/signup', async (req, res) => {
  const register = new Registeration({
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
    email: req.body.email,
  })
  try {
    const loggedIn = await register.save()
    res
      .status(201)
      .json({ message: 'successfuly created', status: true, error: false })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}) 

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
      message: 'new password has been sent to your email',
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

    // Send the contact form data to the specified email address
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail email address
        pass: 'your-password', // Replace with your Gmail password
      },
    });
    const mailOptions = {
      from: email,
      to: 'hik@gmil.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
      } else {
        console.log(info);
        res.status(200).send({
          message: 'Your message has been sent',
          status: true,
        });
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
 
module.exports = router
