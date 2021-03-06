const { validationResult } = require('express-validator')
const Query = require('../models/Query')
const createTransporter = require('../utils/mailTransporter')

module.exports = {
  async fetchAllQueries(_, res) {
    try {
      const queries = await Query.find({}).sort('-createdAt')
      res.send({ statusCode: 200, queries })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  async addQuery(req, res) {
    const errros = validationResult(req)
    if (!errros.isEmpty())
      return res.status(400).send({ statusCode: 400, message: errros.array() })
    try {
      const { name, phoneNumber, message, email } = req.body
      const queryObj = { name, phoneNumber: `+1${phoneNumber}`, message, email }
      const query = await Query.create(queryObj)

      const modifiedPhoneNumber = `+1${phoneNumber.slice(
        0,
        3
      )}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
      // Construct email message
      const emailMessage = {
        from: process.env.CONTACT_EMAIL_ID,
        to: 'harishakira97@gmail.com',
        envelope: {
          from: `MEDEASY <${process.env.CONTACT_EMAIL_ID}>`,
          to: 'harishakira97@gmail.com'
        },
        subject: 'You have a new query',
        html: `
          <h1>QUERY DETAILS</h1>
					<h2>Name: </h2><p>${name}</p><br />
					<h2>Email: </h2><p>${email}</p><br />
					<h2>Phone: </h2><p><a href="tel:${modifiedPhoneNumber}">${modifiedPhoneNumber}</a></p><br/>
					<h2>Message: </h2><p>${message}</p>
          <br/><br/>
          <h4>With Regards</h4>
          <h3>Medeasy @ <a href='https://${process.env.MEDEASY_WEBSITE}'>medeasyonline.com</a></h3>
        `
      }
      // Send the email message
      const transporter = createTransporter(process.env.CONTACT_EMAIL_ID)
      await transporter.sendMail(emailMessage)
      res.send({ statusCode: 201, query })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  async submitTabletRequest(req, res) {
    const errors = validationResult(req)
    try {
      if (!errors.isEmpty())
        return req
          .status(400)
          .send({ statusCode: 400, message: errors.array() })

      const [name, dosage, quantity] = req.body.tabletRequest.split(',')
      // Construct email message
      const emailMessage = {
        from: process.env.PASSWORD_RESET_EMAIL,
        to: 'harishakira97@gmail.com',
        envelope: {
          from: `MEDEASY <${process.env.PASSWORD_RESET_EMAIL}>`,
          to: 'harishakira97@gmail.com'
        },
        subject: 'You have a new pill request',
        html: `
          <h1>TABLET REQUEST DETAILS</h1>
					<h2>Tablet name: </h2><p>${name}</p><br />
					${dosage ? `<h2>Tablet dosage: </h2><p>${dosage}</p><br />` : ''}
					${quantity ? `<h2>Tablet quantity: </h2><p>${quantity}</p><br />` : ''}
          <br/><br/>
          <h4>With Regards</h4>
          <h3>Medeasy @ <a href='https://${
            process.env.MEDEASY_WEBSITE
          }'>medeasyonline.com</a></h3>
        `
      }
      // Send the email message
      const transporter = createTransporter(process.env.PASSWORD_RESET_EMAIL)
			await transporter.sendMail(emailMessage)
			res.send({ statusCode: 200, message: 'Success!' })
    } catch (err) {
      req.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }
}
