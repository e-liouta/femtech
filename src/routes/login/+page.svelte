<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";

	let email = "";
	let password = "";
	let error = "";

	async function handleLogin() {
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			error = authError.message;
		} else {
			goto("/dashboard");
		}
	}
</script>

<div class="wrapper">
	<h1>Login</h1>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel condimentum
		lorem. Phasellus pellentesque metus lectus, ut rhoncus diam blandit id.
		Fusce condimentum dapibus laoreet. Donec a tempus turpis.
	</p>

	<form on:submit|preventDefault={handleLogin}>
		<Input type="email" bind:value={email} placeholder="Email" required />
		<Input
			type="password"
			bind:value={password}
			placeholder="Password"
			required
		/>
		<Button type="submit">Login</Button>
	</form>

	{#if error}
		<p style="color: red;">{error}</p>
	{/if}
	<p class="signin">Not a member yet? <a href="/">Sign Up</a></p>
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
		background-image: url("../../lib/images/femtech-login.jpg");
		background-size: cover;
		background-position: center;
		min-height: 100vh;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
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
		padding: 0 20rem;
	}

	.signin a {
		color: #e84f92;
		text-decoration: none;
		background-color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 0.2rem;
	}
</style>
