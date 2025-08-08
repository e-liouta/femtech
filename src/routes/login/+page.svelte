<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	import { browser } from "$app/environment";

	let email = "";
	let password = "";
	let error = "";
	let info = "";
	let loading = false;

	let resetDialog: HTMLDialogElement | null = null;
	let emailReset = "";
	let sending = false;

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

	function openReset() {
		error = "";
		info = "";
		emailReset = "";
		resetDialog?.showModal();
	}

	function closeReset() {
		resetDialog?.close();
	}

	async function sendReset() {
		error = "";
		info = "";
		if (!emailReset) {
			error = "Please enter your email.";
			return;
		}
		sending = true;

		const redirectTo = browser
			? `${window.location.origin}/reset-password`
			: undefined;
		const { error: resetError } = await supabase.auth.resetPasswordForEmail(
			emailReset,
			{ redirectTo },
		);

		sending = false;
		if (resetError) error = resetError.message;
		else {
			info = "Check your inbox for a password reset link.";
			closeReset();
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

	<p class="forgot">
		<a href="#" on:click|preventDefault={openReset}>Forgot your password?</a>
	</p>

	{#if error}
		<p style="color: red;">{error}</p>
	{/if}
	<p class="signin">Not a member yet? <a href="/">Sign Up</a></p>
</div>

<dialog
	bind:this={resetDialog}
	class="reset-dialog"
	aria-label="Reset password"
>
	<form
		method="dialog"
		class="reset-inner"
		on:submit|preventDefault={sendReset}
	>
		<button type="button" class="close" on:click={closeReset} aria-label="Close"
			>×</button
		>
		<h2>Reset Your Password</h2>
		<Input
			type="email"
			bind:value={emailReset}
			placeholder="Your email"
			required
		/>
		<div class="row">
			<Button type="button" onclick={closeReset}>Cancel</Button>
			<Button type="submit" disabled={sending}
				>{sending ? "Sending…" : "Send link"}</Button
			>
		</div>
	</form>
</dialog>

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

	.signin {
		font-size: 0.8rem;
	}

	.signin a {
		color: #e84f92;
		text-decoration: none;
		background-color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 0.2rem;
	}

	.forgot {
		font-size: 0.8rem;
		text-align: right;
		padding-right: 37rem;
		a {
			text-decoration: underline;
			color: white;
		}
	}

	.reset-dialog {
		border: none;
		border-radius: 0.75rem;
		padding: 0;
		width: min(90%, 600px);
		background: black;
		color: white;
	}
	.reset-dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(6px);
	}
	.reset-inner {
		padding: 1.25rem;
		display: grid;
		gap: 0.9rem;
	}
	.row {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
	.close {
		position: absolute;
		right: 0.6rem;
		top: 0.3rem;
		font-size: 1.4rem;
		background: transparent;
		border: 0;
		color: #aaa;
		cursor: pointer;
	}
	@media (max-width: 1024px) {
		p {
			padding: 0 2rem;
		}
	}
</style>
