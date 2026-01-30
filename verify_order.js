
// using native fetch
const BASE_URL = 'http://localhost:5000';

async function verifyOrder() {
    const randomId = Math.floor(Math.random() * 10000);
    const user = {
        username: `orderuser${randomId}`,
        email: `order${randomId}@example.com`,
        password: 'password123'
    };

    console.log(`--- Testing Order Placement with user: ${user.email} ---`);

    // 1. Register
    console.log('1. Registering user...');
    let userId;
    let token;
    let cookieToCheck = '';

    try {
        const registerRes = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (registerRes.status === 201) {
            const data = await registerRes.json();
            userId = data._id;
            console.log('✅ Registration successful, ID:', userId);

            const setCookie = registerRes.headers.get('set-cookie');
            if (setCookie) {
                cookieToCheck = setCookie;
                console.log('✅ Cookie received');
            }
        } else {
            console.log('❌ Registration failed:', registerRes.status);
            return;
        }
    } catch (err) {
        console.error('❌ Registration error:', err.message);
        return;
    }

    // 2. Get a Product to Buy
    console.log('\n2. Fetching a product to buy...');
    let product;
    try {
        const productsRes = await fetch(`${BASE_URL}/api/products`);
        const products = await productsRes.json();
        if (products.products && products.products.length > 0) {
            product = products.products[0];
            console.log(`✅ Found product: ${product.name}, ID: ${product._id}, Price: ${product.price}`);
        } else {
            console.log('❌ No products found! Seeding might have failed.');
            return;
        }

    } catch (err) {
        console.error('❌ Product fetch error:', err.message);
        return;
    }

    // 3. Place Order
    console.log('\n3. Placing Order...');
    const orderData = {
        orderItems: [
            {
                name: product.name,
                qty: 1,
                image: product.image,
                price: product.price,
                product: product._id,
                _id: product._id
            }
        ],
        shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            postalCode: '12345',
            country: 'Test Country'
        },
        paymentMethod: 'PayPal',
        itemsPrice: product.price,
        shippingPrice: 10,
        taxPrice: 5,
        totalPrice: product.price + 10 + 5
    };

    try {
        const orderRes = await fetch(`${BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieToCheck
            },
            body: JSON.stringify(orderData)
        });

        if (orderRes.status === 201) {
            console.log('✅ Order placed successfully');
            const data = await orderRes.json();
            console.log('Order ID:', data._id);
        } else {
            console.log('❌ Order placement failed:', orderRes.status);
            const text = await orderRes.text();
            console.log('Response:', text);
        }

    } catch (err) {
        console.error('❌ Order placement error:', err.message);
    }
}

verifyOrder();
