const express = require('express')
const router = express.Router()
const Registeration = require('../models/Registeration')
const ContactForm = require('../models/ContactForm');
const payment = require('../models/payment'); 
const moment = require('moment');

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
      message: 'new password has been created',
      status: true,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
 
// Check if email exists in the database
router.post('/check-email', async (req, res) => {
  const email = req.body.email;
  try {
    const user = await Registeration.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        message: 'Email not found',
        status: false,
      });
    }
    return res.status(200).send({
      message: 'Email found',
      status: true,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// Update user profile by ID
router.patch('/updateprofile/:id', async (req, res) => {
  const updates = Object.keys(req.body);
    
  try {
    const user = await Registeration.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save(); 
    res.json({
      message: 'Profile updated successfully',
      statu: true,
      userDetail:user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message ,  statu: false,});
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
           user: "hello@teachingcopilot.com",
           pass: "Duane@cgpt123" 
       }, 
    });
 
    let sendMessage = {
        from: `${email}`,
        to: "hello@teachingcopilot.com",
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
         err:err,
         info:info
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




 
const stripe = require("stripe")('sk_test_51IvIySJzkqBjcDrui1qhWY4fSTiWESTIQoRQe6VsC9Y0bLUlolgEFmOsH7NeNABBX0IxMxvJpXwTZiQ2LsQBFVwA00a7zZipf3');
  
const calculateOrderAmount = (items) => { 
  return 1400;
};


router.get('/get_all_payments', async (req, res) => {
  try {
    const paymentdata = await payment.find()
     res.status(500).json({status:true, payment:paymentdata})
  } catch (err) {
    res.status(500).json({status:true, message:err, payment:null})
  }
})


// GET API to check if the user's plan is active 

// Assuming you have already connected to your MongoDB and have the 'payment' collection available

router.get('/check-plan-status/:userId', async (req, res) => {
  const { userId } = req.params;
  const currentDate = moment().startOf('day');
  const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day');

  try {
    // Find the latest payment record for the user from the database
    const latestPayment = await payment.findOne({ userid: userId }).sort({ startDate: -1 });

    if (!latestPayment) {
      return res.json({ isActive: false });
    }

    const { startDate } = latestPayment;
    const endDate = moment(startDate).add(30, 'days').startOf('day');

    const isActive = currentDate.isBetween(startDate, endDate, null, '[]');

    res.json({ currentPlanStatus: isActive });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve plan data.' });
  }
});
 


// save the transaction own db and in stripe as well
router.post("/create-payment-intent", async (req, res) => {
 const { name, address, email ,city, postcode, userid, amount, id, planId, duration} = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(amount),
    currency: "usd",
    interval: 'month',
    automatic_payment_methods: {
      enabled: true,
    },
  });
  const currentDate = moment().startOf('day');
 const startDate = currentDate.clone().toDate();
  const endDate = currentDate.clone().add(duration, 'days').toDate();

    // Create a new instance of the Registration model
    const paymentData = new payment({
       name, address, email ,city, postcode, userid, amount, id, clientSecret: paymentIntent.client_secret,planId,duration, startDate, endDate 
    }); 
    // Save the registration record to the database
    const paymentSaved = await paymentData.save();
  res.json({
      message: 'payment successfuly done',
      statu: true,  
      payment: paymentSaved,
    }); 
});


// save the transaction own db only
router.post("/create-payment-OwnDb", async (req, res) => {
 const { name, address, email ,city, postcode, userid, amount, id, planId, duration} = req.body;

  
  const currentDate = moment().startOf('day');
 const startDate = currentDate.clone().toDate();
  const endDate = currentDate.clone().add(duration, 'days').toDate();

    // Create a new instance of the Registration model
    const paymentData = new payment({
       name, address, email ,city, postcode, userid, amount, id, clientSecret: "", planId,duration, startDate, endDate 
    }); 
    // Save the registration record to the database
    const paymentSaved = await paymentData.save();
  res.json({
      message: 'payment successfuly done',
      statu: true,  
      payment: paymentSaved,
    }); 
});



router.post('/create-checkout-session', async (req, res) => {
 console.log("hit")
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      // Add line items to specify the products or services being purchased
       { price: 'price_1NLNoSJzkqBjcDruuy8ZBOFW', quantity: 1 },
    ],
     mode: 'subscription',
    success_url: 'https://teachingcopilot.com/upgrade',
    cancel_url: 'https://teachingcopilot.com/cancel',
  });

  res.json({ id: session.id });
});






const createSubscription = async (createSubscriptionRequest, res)=> {
    // create a stripe customer
   try{
    
    const customer = await  stripe.customers.create({
      name: createSubscriptionRequest.name,
      email: createSubscriptionRequest.email,
      payment_method: createSubscriptionRequest.paymentMethod,
      invoice_settings: {
        default_payment_method: createSubscriptionRequest.paymentMethod,
      },
    });

   console.log(customer, 'customer')

    // get the price id from the front-end
    const priceId = "price_1NLNoSJzkqBjcDruuy8ZBOFW";

    // create a stripe subscription
    const subscription = await   stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: 'any',
          },
        },
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    }); 

    // return the client secret and subscription id
    return  res.json({
       result:"success" ,
       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    });
   } catch(e){
    console.log(e, 'errors')
   }
  }


router.post('/create-subscription', ( req  ,res ) => {
    createSubscription(req.body, res);
})

router.get('/payments', async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list();
    res.json(payments.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
