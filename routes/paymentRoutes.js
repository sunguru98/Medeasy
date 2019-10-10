const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const {
  createRazorpayCharge,
  createRazorpayOrder,
  createPaypalOrder,
  createPaypalCharge,
  createCoinbaseCharge,
  verifyCoinbaseCharge
} = require('../controllers/paymentController')

// @route - POST /api/payments/razorpay/order
// @desc - Create a razorpay order
// @method - Public
router.post(
  '/razorpay/order',
  [
    check('orderId', 'Order id is required')
      .not()
      .isEmpty(),
    check('amount', 'Amount is required')
      .not()
      .isEmpty(),
    check('currency', 'Currency is required')
      .not()
      .isEmpty(),
    check('currency', 'Currency should not be more than 3 characters').isLength(
      { min: 3, max: 3 }
    )
  ],
  createRazorpayOrder
)

// @route - POST /api/payments/razorpay/charge
// @desc - Verify and charge a payment on razorpay
// @method - Public
router.post(
  '/razorpay/charge',
  [
    check('paymentId', 'Payment Id is required')
      .not()
      .isEmpty(),
    check('orderId', 'Razorpay Order Id is required')
      .not()
      .isEmpty(),
    check('signature', 'Payment Signature is required')
      .not()
      .isEmpty(),
    check('medEasyOrderId', 'Database Order id is required')
      .not()
      .isEmpty(),
    check('medEasyOrderId', 'Database Order Id is invalid').isMongoId()
  ],
  createRazorpayCharge
)

// @route - POST /api/payments/paypal/order
// @desc - Create a paypal order
// @method - Public
router.post(
  '/paypal/order',
  [
    check('orderId', 'Order id is required')
      .not()
      .isEmpty(),
    check('amount', 'Amount is required')
      .not()
      .isEmpty(),
    check('currency', 'Currency is required')
      .not()
      .isEmpty(),
    check('currency', 'Currency should not be more than 3 characters').isLength(
      { min: 3, max: 3 }
    )
  ],
  createPaypalOrder
)

// @route - POST /api/payments/paypal/charge
// @desc - Charge a payment on paypal
// @method - Public
router.post(
  '/paypal/charge',
  [
    check('paypalOrderId', 'Paypal Order id is required')
      .not()
      .isEmpty(),
    check('orderId', 'Database Order Id is required')
      .not()
      .isEmpty(),
    check('orderId', 'Invalid Order Id').isMongoId()
  ],
  createPaypalCharge
)

// @route - POST /api/payments/coinbase/charge
// @desc - Charge a payment on coinbase
// @method - Public
router.post(
  '/coinbase/charge',
  [
    check('orderId', 'Order id is required')
      .not()
      .isEmpty(),
    check('amount', 'Amount is required')
      .not()
      .isEmpty(),
    check('currency', 'Currency is required')
      .not()
      .isEmpty(),
    check('currency', 'Currency should not be more than 3 characters').isLength(
      { min: 3, max: 3 }
    )
  ],
  createCoinbaseCharge
)

// @route - POST /api/payments/coinbase/webhooks
// @desc - Webhook for coinbase payment status
// @method - Public
router.post('/coinbase/webhooks', verifyCoinbaseCharge)

module.exports = router