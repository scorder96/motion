/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Client } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';

export default {
	async fetch(request, env, ctx) {
		const client = new Client(env.DATABASE_URL);
		await client.connect();
		const url = new URL(request.url);
		const pathname = url.pathname;
		// return new Response(JSON.stringify(rows));

		if (pathname == '/signup') {
			const { email, password, name } = await request.json();
			const hashedPassword = await bcrypt.hash(password, 10);

			const exists = await client.query(`SELECT id FROM users WHERE email = '${email}';`);
			if (exists.rowCount > 0) {
				// throw new Error('User already exists');
				return new Response('User already exists', { status: 400 });
			}
			await client.query(`INSERT INTO users (email, password, name) VALUES ('${email}', '${hashedPassword}', '${name}');`);
			return new Response('User registered successfully', { status: 200 });
		} else if (pathname == '/login') {
			const { email, password } = await request.json();
			const result = await client.query(`SELECT * FROM users WHERE email = '${email}';`);
			if (result.rowCount === 0) {
				return new Response('User not found', { status: 404 });
			}

			const user = result.rows[0];
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				return new Response('Invalid password', { status: 401 });
			}
			const secret = new TextEncoder().encode(env.SECRET_KEY);

			const jwt = await new SignJWT({ email: user.email, name: user.name })
				.setProtectedHeader({ alg: 'HS256' })
				.setIssuedAt()
				.setExpirationTime('1h')
				.sign(secret);

			return new Response(jwt, {
				status: 200,
				headers: {
					'Set-Cookie': `token=${jwt}; HttpOnly; Secure; Path=/; SameSite=Strict`,
				},
			});
		} else if (pathname == '/get-user') {
			try {
				const token = request.headers.get('cookie').split('=')[1];
			} catch (error) {
				console.log(error);
			}
			// const cookies = parseCookies(request.headers.get('Cookie'));
			// const token = request.headers.get('Authorization')?.split(' ')[1];
			if (!token) {
				return new Response('Unauthorized', { status: 401 });
			}

			try {
				const secret = new TextEncoder().encode(env.SECRET_KEY);
				const { payload } = await jwtVerify(token, secret);
				return new Response(JSON.stringify(payload), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (error) {
				return new Response('Invalid token', { status: 401 });
			}
		}
	},
};
