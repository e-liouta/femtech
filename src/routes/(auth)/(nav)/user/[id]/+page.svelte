<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";

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

	let loading = $state(true);
	let notFound = $state(false);
	let user: PublicUser | null = $state(null);
	let posts: Post[] = $state([]);
	let isMe = $state(false);

	function formatDate(iso?: string) {
		if (!iso) return "";
		return new Date(iso).toLocaleString();
	}

	onMount(async () => {
		const { params } = get(page) as { params: Record<string, string> };
		const id = params?.id;

		if (!id) {
			notFound = true;
			loading = false;
			return;
		}

		// eimai egw
		const { data: auth } = await supabase.auth.getUser();
		isMe = !!auth?.user && auth.user.id === id;

		// dimosio profil
		const { data: u, error: uErr } = await supabase
			.from("users_public")
			.select("*")
			.eq("id", id)
			.single();

		if (uErr || !u) {
			notFound = true;
			loading = false;
			return;
		}
		user = u as PublicUser;

		// to post apo ton x xristi
		const { data: p, error: pErr } = await supabase
			.from("posts_with_author")
			.select("*")
			.eq("user_id", id)
			.order("created_at", { ascending: false });

		if (!pErr && p) posts = p as Post[];
		loading = false;
	});

	function goEditProfile() {
		goto("/profile");
	}
</script>

<title
	>{user?.display_name ? `${user.display_name} — Profile` : "Profile"}</title
>
<meta name="description" content={user?.bio ?? "User profile"} />

<div class="wrapper">
	{#if loading}
		<div class="card">Loading…</div>
	{:else if notFound}
		<div class="card">
			<h1>User not found</h1>
			<p>We couldn’t find that profile.</p>
		</div>
	{:else}
		<div class="card header">
			<div class="avatar">
				{#if user?.avatar_url}
					<img src={user.avatar_url} alt="Avatar" />
				{:else}
					<div class="placeholder">No Avatar</div>
				{/if}
			</div>

			<div class="meta">
				<h1>{user?.display_name || "User"}</h1>
				{#if user?.bio}<p class="bio">{user.bio}</p>{/if}

				{#if isMe}
					<button class="edit" onclick={goEditProfile}>Edit profile</button>
				{/if}
			</div>
		</div>

		<div class="card">
			<h2>Posts</h2>
			{#if posts.length === 0}
				<p>No posts yet.</p>
			{:else}
				<div class="list">
					{#each posts as post (post.id)}
						<div class="post" id={post.id}>
							<h3>{post.title}</h3>
							<p class="body">{post.body}</p>
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
		background: url("../../../../../lib/images/femtech-gradient.jpg") no-repeat
			center center fixed;
		background-size: cover;
		min-height: 100vh;
		width: 100%;
	}

	.wrapper {
		padding: 3rem 2rem;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.card {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: 0.8rem;
		padding: 1.5rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.header {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 1rem;
		align-items: center;
	}

	.avatar img,
	.placeholder {
		width: 140px;
		height: 140px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.6);
		display: grid;
		place-items: center;
		color: black;
		font-weight: 600;
		border: 2px solid rgba(255, 255, 255, 0.4);
		overflow: hidden;
		object-fit: cover;
	}

	.meta {
		color: black;
	}

	.meta h1 {
		margin: 0;
	}
	.bio {
		margin: 0.5rem 0;
	}
	.joined {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
	}

	.edit {
		margin-top: 0.6rem;
		background: white;
		color: black;
		border: none;
		border-radius: 0.5rem;
		padding: 0.5rem 0.9rem;
		cursor: pointer;
	}

	h2 {
		margin: 0 0 0.5rem;
		text-align: center;
	}

	.list {
		display: grid;
		gap: 0.75rem;
	}
	.post {
		background: rgba(255, 255, 255, 0.9);
		color: black;
		border-radius: 0.6rem;
		padding: 0.9rem 1rem;
	}
	.post h3 {
		margin: 0 0 0.3rem;
	}
	.post .body {
		margin: 0 0 0.4rem;
	}
	.post .time {
		color: black;
	}
</style>
