
// using native fetch
// Since we are in an ES module project (package.json type: module), we can use top-level await or just functions.
// Node 22 has global fetch.

const BASE_URL = 'http://localhost:5000';

async function verifyAuth() {
    const randomId = Math.floor(Math.random() * 10000);
    const user = {
        username: `testuser${randomId}`,
        email: `test${randomId}@example.com`,
        password: 'password123'
    };

    console.log(`--- Testing with user: ${user.email} ---`);

    // 1. Register
    console.log('1. Registering user...');
    try {
        const registerRes = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (registerRes.status === 201) {
            console.log('✅ Registration successful');
            const data = await registerRes.json();
            console.log('User ID:', data._id);
        } else {
            console.log('❌ Registration failed:', registerRes.status);
            const text = await registerRes.text();
            console.log('Response:', text);
            return;
        }
    } catch (err) {
        console.error('❌ Registration error:', err.message);
        return;
    }

    // 2. Login
    console.log('\n2. Logging in...');
    let cookieToCheck = '';
    try {
        const loginRes = await fetch(`${BASE_URL}/api/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (loginRes.status === 201) { // Controller returns 201 on login
            console.log('✅ Login successful');

            // Extract Set-Cookie
            const setCookie = loginRes.headers.get('set-cookie');
            if (setCookie) {
                console.log('✅ Cookie received:', setCookie);
                cookieToCheck = setCookie;
            } else {
                console.log('❌ No cookie received!');
            }

        } else {
            console.log('❌ Login failed:', loginRes.status);
            const text = await loginRes.text();
            console.log('Response:', text);
            return;
        }
    } catch (err) {
        console.error('❌ Login error:', err.message);
        return;
    }

    // 3. Access Protected Route (Profile)
    console.log('\n3. Accessing Protected Route (Profile)...');
    try {
        const profileRes = await fetch(`${BASE_URL}/api/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieToCheck // Send the cookie back
            }
        });

        if (profileRes.status === 200) {
            console.log('✅ Profile access successful');
            const data = await profileRes.json();
            console.log('Profile Data:', data);
        } else {
            console.log('❌ Profile access failed:', profileRes.status);
            const text = await profileRes.text();
            console.log('Response:', text);
        }

    } catch (err) {
        console.error('❌ Profile access error:', err.message);
    }
}

verifyAuth();
