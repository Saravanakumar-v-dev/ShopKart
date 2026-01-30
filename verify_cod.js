
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './backend/models/orderModel.js';
import User from './backend/models/userModel.js';
import Product from './backend/models/productModel.js';
import connectDB from './backend/config/db.js';

dotenv.config();

const verifyCOD = async () => {
    try {
        await connectDB();

        console.log("Creating Test Order...");

        const user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            console.log("User not found (run seeder first maybe?)");
            process.exit(1);
        }

        const product = await Product.findOne({});
        if (!product) {
            console.log("No products found");
            process.exit(1);
        }

        const order = new Order({
            user: user._id,
            orderItems: [
                {
                    name: product.name,
                    qty: 1,
                    image: product.image,
                    price: product.price,
                    product: product._id
                }
            ],
            shippingAddress: {
                address: '123 Test St',
                city: 'Test City',
                postalCode: '12345',
                country: 'India'
            },
            paymentMethod: 'CashOnDelivery',
            itemsPrice: product.price,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: product.price
        });

        const createdOrder = await order.save();
        console.log(`Order Created: ${createdOrder._id}`);
        console.log(`Payment Method: ${createdOrder.paymentMethod}`);

        if (createdOrder.paymentMethod === 'CashOnDelivery') {
            console.log("✅ Verification SUCCESS: COD Order created successfully.");
        } else {
            console.log("❌ Verification FAILED: Payment method mismatch.");
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

verifyCOD();
