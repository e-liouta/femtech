<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";

	let email = $state("");
	let password = $state("");
	let message = $state("");

	async function signUp() {
		const { error } = await supabase.auth.signUp({
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

<div class="wrapper">
	<h1>Welcome to FemTech!</h1>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel condimentum
		lorem. Phasellus pellentesque metus lectus, ut rhoncus diam blandit id.
	</p>

	<h2>Sign Up</h2>
	<form on:submit|preventDefault={signUp}>
		<Input type="email" bind:value={email} placeholder="Email" required />
		<Input
			type="password"
			bind:value={password}
			placeholder="Password"
			required
		/>
		<Button type="submit">Sign Up</Button>
	</form>

	{#if message}
		<p>{message}</p>
	{/if}

	<p class="signin">Already have an account? <a href="/login">Log In</a></p>
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

	h2 {
		color: white;
		font-size: 1.8rem;
	}

	p {
		color: white;
		font-size: 1.6rem;
		padding-right: 35rem;
	}

	.signin a {
		color: #e84f92;
		text-decoration: none;
		background-color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 0.2rem;
	}
</style>
