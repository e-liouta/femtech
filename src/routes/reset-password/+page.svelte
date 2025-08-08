<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { goto } from "$app/navigation";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";

	let newPassword = "";
	let confirmPassword = "";
	let error = "";
	let info = "";
	let saving = false;

	async function updatePassword() {
		error = "";
		info = "";
		if (!newPassword || newPassword.length < 8) {
			error = "Password must be at least 8 characters.";
			return;
		}
		if (newPassword !== confirmPassword) {
			error = "Passwords do not match.";
			return;
		}
		saving = true;
		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword,
		});
		saving = false;

		if (updateError) {
			error = updateError.message;
		} else {
			info = "Password updated! Redirecting to login…";
			setTimeout(() => goto("/"), 1500);
		}
	}
</script>

<div class="wrapper">
	<h1>Reset your password</h1>
	<form on:submit|preventDefault={updatePassword}>
		<Input
			type="password"
			bind:value={newPassword}
			placeholder="New password"
			required
		/>
		<Input
			type="password"
			bind:value={confirmPassword}
			placeholder="Confirm new password"
			required
		/>
		<Button type="submit" disabled={saving}>Save</Button>
	</form>
	{#if error}<p style="color:red">{error}</p>{/if}
	{#if info}<p style="color:#00ffad">{info}</p>{/if}
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
		font-size: 3rem;
		font-weight: 800;
		margin: 0;
	}

	p {
		color: white;
		font-size: 1.6rem;
		padding: 0 20rem;
	}
	form {
		padding: 1rem;
	}
</style>
