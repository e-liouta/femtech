<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";

	type PublicUser = {
		id: string;
		display_name: string | null;
		avatar_url: string | null;
		bio: string | null;
		created_at: string;
	};

	type Post = {
		id: string;
		title: string;
		body: string;
		user_id: string;
		created_at: string;
		author_name: string | null;
	};

	let userId = $state<string>("");
	let loading = $state(true);
	let saving = $state(false);
	let errorMsg = $state<string>("");

	// editable fields (from auth metadata)
	let displayName = $state<string>("");
	let avatarUrl = $state<string>("");
	let bio = $state<string>("");

	let myPosts = $state<Post[]>([]);

	onMount(async () => {
		const { data: auth } = await supabase.auth.getUser();
		if (!auth?.user) {
			goto("/login");
			return;
		}
		userId = auth.user.id;

		// to profil mou apo ti basi
		const { data: me, error: meErr } = await supabase
			.from("users_public")
			.select("*")
			.eq("id", userId)
			.single();

		if (meErr) {
			errorMsg = meErr.message;
		} else if (me) {
			const u = me as PublicUser;
			displayName = u.display_name ?? "";
			avatarUrl = u.avatar_url ?? "";
			bio = u.bio ?? "";
		}

		// ta dika mou mono post
		const { data: posts } = await supabase
			.from("posts_with_author")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (posts) myPosts = posts as Post[];

		loading = false;
	});

	async function saveProfile() {
		saving = true;
		errorMsg = "";

		const { error } = await supabase.auth.updateUser({
			data: {
				display_name: displayName || null,
				avatar_url: avatarUrl || null,
				bio: bio || null,
			},
		});

		if (error) {
			errorMsg = error.message;
		} else {
			// ananewsw users_public view data
			const { data: me } = await supabase
				.from("users_public")
				.select("*")
				.eq("id", userId)
				.single();

			// re-hydrate fields in case of server transforms later
			if (me) {
				displayName = (me as PublicUser).display_name ?? "";
				avatarUrl = (me as PublicUser).avatar_url ?? "";
				bio = (me as PublicUser).bio ?? "";
			}
		}
		saving = false;
	}

	async function signOut() {
		await supabase.auth.signOut();
		goto("/login");
	}
</script>

<div class="wrapper">
	<h1>My Profile</h1>

	{#if loading}
		<div class="card">Loading…</div>
	{:else}
		<div class="card profile">
			<div class="avatar">
				{#if avatarUrl}
					<img src={avatarUrl} alt="Avatar" />
				{:else}
					<div class="placeholder">No Avatar</div>
				{/if}
			</div>

			<div class="fields">
				<Input
					type="text"
					placeholder="Display name"
					bind:value={displayName}
				/>
				<Input type="text" placeholder="Avatar URL" bind:value={avatarUrl} />
				<Input type="textarea" placeholder="Bio" bind:value={bio} />
				{#if errorMsg}<p class="error">{errorMsg}</p>{/if}
				<div class="row">
					<Button onclick={saveProfile} disabled={saving}
						>{saving ? "Saving…" : "Save profile"}</Button
					>
					<Button variant="secondary" onclick={signOut}>Sign out</Button>
				</div>
			</div>
		</div>

		<div class="card">
			<h2>My Posts</h2>
			{#if myPosts.length === 0}
				<p>You haven’t posted yet.</p>
			{:else}
				<div class="list">
					{#each myPosts as post (post.id)}
						<div class="post" id={post.id}>
							<h3>{post.title}</h3>
							<p>{post.body}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	:global(html, body) {
		margin: 0;
		padding: 0;
		font-family: "Inter", sans-serif;
		background: url("../../../../lib/images/femtech-gradient.jpg") no-repeat
			center center fixed;
		background-size: cover;
		background-position: center;
		min-height: 100vh;
		width: 100%;
		min-height: 100vh;
	}

	.wrapper {
		padding: 3rem 2rem;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		color: white;
	}
	h1,
	h2 {
		text-align: center;
	}

	.card {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(20px);
		border-radius: 0.8rem;
		padding: 1.5rem;
	}

	.profile {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 1rem;
		align-items: start;
	}
	.avatar img,
	.placeholder {
		width: 140px;
		height: 140px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.6);
		display: grid;
		place-items: center;
		color: #333;
		font-weight: 600;
		border: 2px solid rgba(255, 255, 255, 0.4);
		object-fit: cover;
		overflow: hidden;
	}
	.fields {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.row {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.error {
		color: #ffb3c7;
		font-weight: 600;
	}

	.list {
		display: grid;
		gap: 0.75rem;
	}
	.post {
		background: rgba(255, 255, 255, 0.9);
		color: #111;
		border-radius: 0.6rem;
		padding: 0.9rem 1rem;
	}
	.post h3 {
		margin: 0 0 0.25rem;
	}
	.post p {
		margin: 0;
	}
</style>
