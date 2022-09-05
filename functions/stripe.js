'use strict';
const stripe = require("stripe")('sk_test_51LZqGFSJyoPZ5CkLST1bfrqOYQ6tiSOvup4Hc22qjbsMNfi5aAUBBrh9Dt06YlRPD2LANtmZ42KJDAF98v8anhbg001X1bzGED');
// console.log('---->',process.env.STRIPE_API_KEY)
// exports.createCustomer = (payload) => {
//     return new Promise((resolve, reject) => {
//         stripe.customers.create(payload, function (err, result) {
//             console.log("......createCustomer.....", err, result);
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

// exports.updateCustomerCard = (stripe_id, card_id) => {
//     return new Promise((resolve, reject) => {
//         stripe.customers.update(stripe_id, { default_source: card_id }, function (err, result) {
//             resolve(result);
//         });
//     });
// }

// exports.addSource = (customer, source) => {
//     //const  token = await stripe.tokens.create({card: source});
//     return new Promise((resolve, reject) => {
//         stripe.customers.createSource(
//             customer,
//             { source: source }, function (err, result) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//     });
// }

// exports.createCardToken = (source) => {
//     // const  token =  stripe.tokens.create({card: source});
//     return new Promise((resolve, reject) => {
//         stripe.tokens.create({
//             card: {
//                 exp_month: source.month,
//                 exp_year: source.year,
//                 number: source.number,
//                 cvc: (source.cvc),
//                 name: source.name
//             }
//         }, function (err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }


// exports.deleteSource = (customer, source) => {
//     return new Promise((resolve, reject) => {
//         stripe.customers.deleteSource(
//             customer,
//             source, function (err, result) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//     });
// }

// exports.createCharge = (customer, card, merchantAmount,platformAmount, merchant) => {
//     return new Promise((resolve, reject) => {
//         stripe.charges.create({
//             amount: parseInt(merchantAmount).toFixed(2) * 100,
//             currency: "usd",
//             customer: customer,
//             source: card,
//             application_fee_amount: parseInt(platformAmount).toFixed(2) * 100,
//             transfer_data: {
//                 destination: merchant,
//             },
//         }, function (err, result) {
//             console.log(result)
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }
// exports.createMerchant = (payload) => {

//     return new Promise((resolve, reject) => {
//         stripe.accounts.create({
//             type: 'custom',
//             country: 'US',
//             email: payload.email,
//             business_type: 'individual',
//             individual: {
//                 email: payload.email,
//                 first_name: payload.first_name,
//                 last_name: payload.last_name
//             },
//             capabilities: {
//                 card_payments: { requested: true },
//                 transfers: { requested: true }
//             },
//             settings: {
//                 payouts: {
//                     schedule: {
//                         interval: 'manual'
//                     }
//                 }
//             }
//         }, function (err, account) {
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             } else {
//                 stripe.accountLinks.create({
//                     account: account.id,
//                     refresh_url: `https://admin.feedmeapplication.com/back.html`,
//                     return_url: `https://admin.feedmeapplication.com/back.html`,
//                     type: 'account_onboarding',
//                     collect: 'currently_due'
//                 }, function (err, result) {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         result.id = account.id;
//                         resolve(result);
//                     }
//                 });
//             }
//         });
//     })
// }
// exports.createLink = (id) => {
//     return new Promise((resolve, reject) => {
//         console.log("hsddjhas")
//         // console.log( `${process.env.IP}staging/back.html`);
//         stripe.accountLinks.create({
//             account: id,
//             refresh_url: `http://localhost:5000/back.html`,
//             return_url: `http://localhost:5000/back.html`,
//             //refresh_url: `https://apps.apple.com/us/app/taximo-driver/id1270660099`,
//             //return_url: `https://apps.apple.com/us/app/taximo-driver/id1270660099`,
//             type: 'account_onboarding',
//             // type: 'custom_account_verification',
//             collect: 'currently_due'
//         }, function (err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     })
// }
// exports.balance = (payload) => {
//     return new Promise((resolve, reject) => {
//         console.log('!!!!!!!!!!!!!!1', payload);
//         stripe.balance.retrieve({
//             stripeAccount: payload.id,
//         }, function (err, result) {
//             console.log(result)

//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     })
// }

// exports.payouts = (payload) => {
//     // console.log("asdlkia",payload)
//     return new Promise((resolve, reject) => {
//         stripe.payouts.create({
//             amount: payload.amount,
//             currency: 'usd',
//             statement_descriptor: 'FeedMe',
//             // method: 'instant',
//         },
//             {
//                 stripeAccount: payload.id,
//             }, function (err, result) {
//                 if (err) {
//                     reject(err);
//                     console.log(err)
//                 } else {
//                     resolve(result);
//                     console.log(result)
//                 }
//             });
//     })
// }

// exports.addAccount = (payload, req) => {
//     console.log(payload.id , payload.token,"fffffffff")
//     return new Promise((resolve, reject) => {
//         stripe.accounts.createExternalAccount(
//             payload.id,
//             {
//                 external_account: payload.token,
//             }, function (err, result) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//     })
// }
// exports.deleteAccount = (payload) => {
//     return new Promise((resolve, reject) => {
//         stripe.accounts.deleteExternalAccount(
//             payload.bank_account,
//             {
//                 external_account: payload.token,
//             }, function (err, result) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//     })
// }

// // exports.editAccount = (payload) => {
// //     return new Promise((resolve, reject) => {
// //         stripe.accounts.updateExternalAccount( payload.id,payload.bankid,
// //             {
// //               external_account: payload.token,
// //             }, function (err, account) {
// //         if (err) {
// //             console.log(err);
// //             reject(err);
// //         } else {
// //             resolve(account);
// //         }
// //         });
// //     });
// // }

// exports.updateMerchant = (payload) => {
//     return new Promise((resolve, reject) => {
//         stripe.accounts.update(payload.id, {
//             metadata: { internal_id: '42' },
//             tos_acceptance: {
//                 date: Math.floor(Date.now() / 1000),
//                 ip: process.env.PROVIDER_URL, // Assumes you're not using a proxy
//             },
//         }, function (err, account) {
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             } else {
//                 resolve(account);
//             }
//         });
//     })
// }
// exports.createBankToken = (payload) => {
//     return new Promise((resolve, reject) => {
//         // console.log(payload.routing_number, payload.account_number);
//         stripe.tokens.create({
//             bank_account: {
//                 country: 'US',
//                 currency: 'usd',
//                 account_holder_name: payload.account_holder_name,
//                 account_holder_type: 'individual',
//                 routing_number: payload.routing_number,
//                 account_number: payload.account_number,
//             },
//         }, function (err, account) {
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             } else {
//                 // console.log(account)
//                 resolve(account);

//             }
//         });
//     });
// }

