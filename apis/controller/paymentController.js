
var Secret_Key = 'sk_test_51LLAvFJ9nnMhlV7kVExDWv4r7aPrPKnGH7ArfRWJqUJuXtKxn7XmdkpMBSJWwTmEl29MyV0iS8ZuogM79HTnc8bV00Z75cWlY1'
 
const stripe = require('stripe')(Secret_Key)

exports.order_payment = async(req, res)=>{
 
  // Moreover you can take more details from user
  // like Address, Name, etc from form
   await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,  
      name: 'Madhav shridhar ',
      // address: {
      //     line1: 'TC 9/4 Old MES colony',
      //     postal_code: '452331',
      //     city: 'Indore',
      //     state: 'Madhya Pradesh', 
      //     country: 'India',
      // }
  })
  .then((customer) => {

    
      return stripe.charges.create({
        amount: 2500,     // Charging Rs 25
        description: 'Web Development Product',
        currency: 'USD',
        customer: customer.id
    });
  })
  .then((charge) => {
      res.send(charge)  // If no error occurs
  })
  .catch((err) => {
      res.send(err)       // If some error occurs
  });
}


























