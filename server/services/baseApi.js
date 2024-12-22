const axios = require('axios');
const dotenv = require("dotenv");
const generateTransactionRef = require('../utilities/generateTransactionRef');
dotenv.config();


const squad_public_key = process.env.SQUADCO_PUBLIC_KEY;


const initiatePayment = async (email, amount, currency) => {
    const transaction_ref = generateTransactionRef();

    try {
        const response = await axios.post(
            'https://sandbox-api.squadco.com/payment/Initiate',
            {
                "amount": amount,
                "email": email,
                "currency": currency,
                "initiate_type": "inline",
                "transaction_ref": transaction_ref,
                "CallBack_URL": "https://www.linkedin.com/",
            },
            {
                headers: {
                    Authorization: squad_public_key,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}\n Message: ${response.message}`);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};


const DirectGTBankAccountDebit = async (name, email, amount, account_or_phoneno, currency) => {
    const transaction_ref = generateTransactionRef();

    try {
        const response = await axios.post(
            'https://sandbox-api-squadco.com/transaction/initiate/process-payment',
            {
                "transaction_reference": transaction_ref,
                "amount": amount,
                "pass_charge": false,
                "currency": currency,
                "webhook_url": "www.sampleurl.com",
                "bank": {
                    "bank_code": "058",
                    "account_or_phoneno": account_or_phoneno
                },
                "payment_method": "bank",
                "customer": {
                    "name": name,
                    "email": email
                }
            },
            {
                headers: {
                    Authorization: squad_public_key,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}\n Message: ${response.message}`);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};


const ValidatePaymentForDirectBankApiPayment = async (transaction_ref, otp) => {
    try {
        const response = await axios.post(
            'https://sandbox-api-squadco.com/transaction/validate-payment',
            {
                "transaction_reference": transaction_ref,
                "authorization": {
                  "otp_token": otp
                }
            },
            {
                headers: {
                    Authorization: squad_public_key,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}\n Message: ${response.message}`);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    };
};


const InitiateUSSDPayment = async (name, email, amount, bank_code, currency) => {
    const transaction_ref = generateTransactionRef();
    
    try {
        const response = await axios.post(
            'https://sandbox-api-squadco.com/transaction/initiate/process-payment',
            {
                "transaction_reference": transaction_ref,
                "amount": amount,
                "pass_charge": false,
                "currency": currency,
                "webhook_url": "www.sampleurl.com",
                "ussd": {
                  "bank_code": bank_code
                },
                "payment_method": "ussd",
                "customer": {
                  "name": name,
                  "email": email
                }
            },
            {
                headers: {
                    Authorization: squad_public_key,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}\n Message: ${response.message}`);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    };
};


const VerifyTransaction = async (transaction_ref) => {
    try {
        const response = await axios.get(
            `https://sandbox-api-d.squadco.com/transaction/verify/${{transaction_ref}}`,
            {
                headers: {
                    Authorization: squad_public_key,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}\n Message: ${response.message}`);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    };
};


module.exports = {initiatePayment, DirectGTBankAccountDebit, ValidatePaymentForDirectBankApiPayment};
