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
	<div class="right">
		<a href="/profile" class="icon" aria-label="Profile">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				width="24"
				height="24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</a>
		<button class="logout-btn" onclick={logout}>Logout</button>
	</div>
</nav>
<div>
	{@render children()}
</div>

<style lang="scss">
	nav {
		background-color: white;
		border-bottom: 1px solid white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.5rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
	}

	nav a {
		color: #ff5fa2;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}
	.nav a:hover {
		color: black;
	}

	.icon {
		color: #ff5fa2;
		display: flex;
		align-items: center;
		margin-right: 1rem;
		transition: color 0.2s;
		background-color: #ccc;
		padding: 0.4rem;
		border-radius: 1rem;
	}
	.icon:hover {
		color: black;
	}

	.logout-btn {
		background-color: transparent;
		border: 1px solid #ccc;
		color: black;
		padding: 0.4rem 0.9rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}
	.logout-btn:hover {
		border-color: #999;
		color: #000;
	}

	.right {
		display: flex;
		align-items: center;
	}

	div {
		padding: 1.5rem;
	}
</style>
