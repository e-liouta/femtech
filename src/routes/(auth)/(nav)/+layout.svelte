<script lang="ts">
	import type { Snippet } from "svelte";
	import { supabase } from "$lib/supabaseClient";

	let { children }: { children: Snippet } = $props();

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			alert("You have been logged out!");
			window.location.href = "/login";
		} else {
			console.error("Logout error:", error.message);
		}
	}
</script>

<nav>
	<a href="/dashboard">Dashboard</a>
	<button onclick={logout}>Logout</button>
</nav>
<div>
	{@render children()}
</div>

<style>
	nav {
		background-color: lightgray;
		display: flex;
		gap: 1rem;
	}

	div {
		padding: 1rem;
	}
</style>
