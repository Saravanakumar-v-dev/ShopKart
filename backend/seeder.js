
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Category from './models/categoryModel.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';
import { mockCategories, mockProducts } from '../frontend/src/Utils/mockData.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();
        // await User.deleteMany(); // Don't delete users so we can keep our test user

        console.log('Data Cleared!'.red.inverse);

        // Get admin user (assuming first user or specific admin)
        // For now, we'll try to find any user, or create a dummy one if needed for the 'user' field in products
        let adminUser = await User.findOne({ isAdmin: true }) || await User.findOne();

        if (!adminUser) {
            console.log('No admin user found. Creating one...'.yellow);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            adminUser = await User.create({
                username: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                isAdmin: true
            });
            console.log(`Created admin user: ${adminUser.email}`.green);
        }

        // Import Categories
        // mockCategories have _id, so we need to map them carefully or let mongo create ids
        // But mockProducts ref these ids, so we should try to keep them if possible or map them.
        // Mongoose might not like string _ids if schema expects ObjectId. 
        // Let's check schemas. Category Schema usually auto-generates _id (ObjectId).
        // Mock data has string ids "cat1". This won't work if Schema defines _id as ObjectId (default).
        // We need to create a map of oldId -> newId

        const categoryMap = new Map();

        const createdCategories = [];
        for (const cat of mockCategories) {
            const newCat = new Category({
                name: cat.name,
                // Add any other fields from schema? 
                // Let's check Category Model
            });
            const savedCat = await newCat.save();
            createdCategories.push(savedCat);
            categoryMap.set(cat._id, savedCat._id);
        }

        console.log(`Imported ${createdCategories.length} categories`.green.inverse);

        // Import Products
        const sampleProducts = mockProducts.map(product => {
            // Map old category id to new category id
            const newCategoryId = categoryMap.get(product.category);

            if (!newCategoryId) {
                console.warn(`Category not found for product: ${product.name}`);
                return null;
            }

            return {
                ...product,
                _id: undefined, // Let mongo generate
                user: adminUser._id,
                category: newCategoryId,
                // Ensure review structure matches schema if needed, or empty
                reviews: [],
                numReviews: 0,
                rating: 0,
                quantity: product.countInStock || 0
            };
        }).filter(p => p !== null);

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();
        // await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
