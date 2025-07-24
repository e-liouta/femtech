<!-- <script lang="ts">
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<h1>Dashboard</h1>
{#await data.user}
	<div>...Loading</div>
{:then user}
	{#if !user}
		{goto("/login")}
	{:else}
		<p>Your email: {user.email}</p>
	{/if}
{/await} -->
<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	type Post = {
		id: string;
		title: string;
		body: string;
	};

	let posts: Post[] = [];
	let newTitle = "";
	let newContent = "";

	// fernw tis anartiseis apo ti basi
	onMount(async () => {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("created_at", { ascending: false });

		if (!error && data) {
			posts = data as Post[];
		}
	});

	// ftiaxnw neo post
	async function createPost() {
		if (!newTitle.trim()) return alert("Title is required!");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("Please log in first.");
			return;
		}

		const { data, error } = await supabase
			.from("posts")
			.insert([{ user_id: user.id, title: newTitle, body: newContent }])

			.select();

		if (!error && data) {
			posts = [data[0] as Post, ...posts];
			newTitle = "";
			newContent = "";
		}
	}

	async function deletePost(id: string) {
		const { count } = await supabase
			.from("posts")
			.delete({ count: "exact" })
			.eq("id", id);
		if (count) {
			posts = posts.filter((p) => p.id !== id);
		}
	}

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

{#await data.user}
	<div>...Loading</div>
{:then user}
	{#if !user}
		{goto(`/login?redirect=${document.location}`)}
	{/if}
{/await}

<h1>Posts</h1>

<input type="text" bind:value={newTitle} placeholder="Title" />
<textarea bind:value={newContent} placeholder="Message"></textarea>
<button on:click={createPost}>Post</button>

{#each posts as post (post.id)}
	<div>
		<h3>{post.title}</h3>
		<p>{post.body}</p>

		<button on:click={() => deletePost(post.id)}>Delete</button>
	</div>
{/each}
<button on:click={logout}>Logout</button>
