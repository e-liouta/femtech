<script lang="ts">
	import { supabase } from "$lib/supabaseClient";

	let email = "";
	let password = "";
	let message = "";

	async function signUp() {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			message = error.message;
		} else {
			message = "Check your email to confirm your account!";
		}
	}
</script>

<head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
		rel="stylesheet"
	/>
</head>

<div class="wrapper">
	<h1>Welcome to FemTech!</h1>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel condimentum
		lorem. Phasellus pellentesque metus lectus, ut rhoncus diam blandit id.
	</p>

	<h2>Sign Up</h2>
	<form on:submit|preventDefault={signUp}>
		<input type="email" bind:value={email} placeholder="Email" required />
		<input
			type="password"
			bind:value={password}
			placeholder="Password"
			required
		/>
		<button type="submit">Sign Up</button>
	</form>

	{#if message}
		<p>{message}</p>
	{/if}
</div>

<style lang="scss">
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: "Inter", sans-serif;
	}

	.wrapper {
		background-image: url("../lib/images/femtech-bg.jpg");
		background-size: cover;
		background-position: center;
		min-height: 100vh;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}

	h1 {
		color: white;
		font-size: 5rem;
		font-weight: 800;
		margin: 0;
	}

	p {
		color: white;
		font-size: 1.6rem;
		padding-right: 35rem;
	}
</style>
