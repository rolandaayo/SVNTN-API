const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

/**
 * Initialize a Paystack payment transaction
 * @param {string} email - Customer email
 * @param {number} amount - Amount in kobo (multiply naira by 100)
 * @param {object} metadata - Additional data to attach to transaction
 * @returns {Promise<object>} - Paystack response with authorization_url and reference
 */
async function initializePayment(email, amount, metadata = {}) {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        metadata,
        callback_url: metadata.callback_url || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Payment initialization failed"
    );
  }
}

/**
 * Verify a Paystack payment transaction
 * @param {string} reference - Transaction reference
 * @returns {Promise<object>} - Paystack verification response
 */
async function verifyPayment(reference) {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Paystack verification error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Payment verification failed"
    );
  }
}

module.exports = {
  initializePayment,
  verifyPayment,
};
