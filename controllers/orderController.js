const { validationResult } = require('express-validator')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const User = require('../models/User')
const Guest = require('../models/Guest')
const transporter = require('../utils/mailTransporter')
const moment = require('moment')

module.exports = {
	createOrder: async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).send({ statusCode: 400, message: errors.array() })
		const { cartId, mode, userId, shippingAddress, billingAddress } = req.body
		try {
			let order = await Order.findOne({ cart: cartId })
			if (order) return res.send({ statusCode: 200, orderId: order._id })
			const cart = await Cart.findById(cartId)
			if (!cart)
				return res
					.status(404)
					.send({ statusCode: 404, message: 'Cart not found' })
			let user
			if (mode === 'guest') user = await Guest.findById(userId)
			else user = await User.findById(userId)
			if (!user)
				return res
					.status(404)
					.send({ statusCode: 404, message: 'User not found' })
			const totalAmount = cart.products.reduce(
				(acc, product) => parseInt(acc) + parseInt(product.subTotal),
				0
			)
			const orderObj = {
				cart: cart._id,
				user: user._id,
				products: cart.products,
				mode,
				totalAmount,
				shippingAddress,
				billingAddress
			}
			order = await Order.create(orderObj)
			res.status(201).send({ statusCode: 201, orderId: order._id })
		} catch (err) {
			console.log(err.message)
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	changePaymentMethod: async (req, res) => {
		const { orderId } = req.params
		try {
			if (!orderId)
				return res
					.status(400)
					.send({ statusCode: 400, message: 'Order Id not found' })
			const errors = validationResult(req)
			if (!errors.isEmpty())
				return res
					.status(400)
					.send({ statusCode: 400, message: errors.array() })
			const { method } = req.body
			const order = await Order.findById(orderId)
			order.method = method
			await order.save()
			res.status(202).send({ statusCode: 202, order })
		} catch (err) {
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	changePaymentStatus: async (req, res) => {
		const { orderId } = req.params
		try {
			if (!orderId)
				return res
					.status(400)
					.send({ statusCode: 400, message: 'Order Id not found' })
			const errors = validationResult(req)
			if (!errors.isEmpty())
				return res
					.status(400)
					.send({ statusCode: 400, message: errors.array() })
			const { status } = req.body
			const order = await Order.findById(orderId)
			order.status = status
			if (status === 'Success') {
				await Cart.findByIdAndDelete(order.cart)
				order.cart = null
				await order.save()
				delete order.cart
			}
			res.status(202).send({ statusCode: 202, order })
		} catch (err) {
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	changeTrackingStatus: async (req, res) => {
		const { orderId } = req.params
		try {
			if (!orderId)
				return res
					.status(400)
					.send({ statusCode: 400, message: 'Order Id not found' })
			const errors = validationResult(req)
			if (!errors.isEmpty())
				return res
					.status(400)
					.send({ statusCode: 400, message: errors.array() })
			const { trackingId } = req.body
			const order = await Order.findById(orderId).populate('user', [
				'name',
				'email'
			])
			order.trackingId = trackingId
			await order.save()
			const message = {
				from: process.env.EMAIL_ID,
				to: order.user.email,
				envelope: {
					from: `MEDEASY <${process.env.EMAIL_ID}>`,
					to: order.user.email
				},
				subject: 'Update on your Shipment',
				html: `
          <h1>Dear ${order.user.name}</h1>
          <p>
            Your Order ID - <strong>${
							order._id
						}</strong>, amounting to USD <strong>${
					order.totalAmount
				}</strong>, placed at ${moment(order.createdAt).format(
					'L'
				)} has been shipped succesfully. <br/>
            Shipment Tracking Id - <strong>${trackingId}</strong><br />
            Estimated Delivery Date - <strong>${moment(order.createdAt)
							.add(10, 'days')
							.format('L')}</strong> to <strong>${moment(order.createdAt)
					.add(16, 'days')
					.format('L')}</strong><br />
            Please click the following link below to track your shipment.
          <p>
          <a href='https://t.17track.net/en#nums=${trackingId}'>Track your Shipment</a><br />
          <p>We thank you for believing in our service.</p>
          <br/><br/>
          <h4>With Regards</h4>
          <h3>Medeasy @ <a href='${
						process.env.MEDEASY_WEBSITE
					}'>Medeasy.com</a></h3>
        `
			}
			await transporter.sendMail(message)
			res.status(202).send({ statusCode: 202, order })
		} catch (err) {
			console.log(err)
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	fetchOrders: async (req, res) => {
		try {
			const orders = await Order.find({}).populate('user', ['name', 'email'])
			res.send({ statusCode: 200, orders })
		} catch (err) {
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	fetchOrdersByUserId: async (req, res) => {
		const user = req.user
		try {
			const orders = await Order.find({ user: user._id })
			res.send({ statusCode: 200, orders })
		} catch (err) {
			console.log(err)
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	},

	deleteOrderById: async (req, res) => {
		const { orderId } = req.params
		if (!orderId)
			return res
				.status(400)
				.send({ statusCode: 400, message: 'Order ID not found' })
		try {
			const order = await Order.findByIdAndDelete(orderId)
			if (!order)
				return res
					.status(404)
					.send({ statusCode: 404, message: 'Order not found' })
			res.status(202).send({ statusCode: 202, order })
		} catch (err) {
			res.status(500).send({ statusCode: 500, message: 'Server Error' })
		}
	}
}
