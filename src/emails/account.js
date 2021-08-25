const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL,
        subject: 'Welcome to the app!',
        text: `Welcome to the app, ${name}! Let me know how you get along with the app.`
    }).then(() => {
        console.log('Email sent succesfully')
    }).catch((e) => {
        console.log(e.response.body)
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chris@christopherfynes.co.uk',
        subject: "Sorry to see you leave!",
        text: "Your account has now been removed. Is there anything we could have done differently?"
    }).then(() => {
        console.log('Email sent successfully')
    }).catch((e) => {
        console.log(e.response.body)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail 
}