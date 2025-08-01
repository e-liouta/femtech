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
		user_id: string;
	};

	let posts = $state<Post[]>([]);
	let newTitle = $state("");
	let newContent = $state("");
	let userId = $state("");
	let editingPostId = $state<string | null>(null);
	let editedTitle = $state("");
	let editedBody = $state("");

	// fernw tis anartiseis apo ti basi
	onMount(async () => {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("created_at", { ascending: false });

		if (!error && data) {
			posts = data as Post[];
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (user) {
			userId = user.id;
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

	function startEditing(post: Post) {
		editingPostId = post.id;
		editedTitle = post.title;
		editedBody = post.body;
	}

	function cancelEditing() {
		editingPostId = null;
		editedTitle = "";
		editedBody = "";
	}

	async function saveEdit(postId: string) {
		const { error } = await supabase
			.from("posts")
			.update({ title: editedTitle, body: editedBody })
			.eq("id", postId);

		if (!error) {
			posts = posts.map((p) =>
				p.id === postId ? { ...p, title: editedTitle, body: editedBody } : p,
			);
			cancelEditing();
		}
	}
</script>

<h1>Posts</h1>

<input type="text" bind:value={newTitle} placeholder="Title" />
<textarea bind:value={newContent} placeholder="Message"></textarea>
<button onclick={createPost}>Post</button>

{#each posts as post (post.id)}
	<div>
		{#if editingPostId === post.id}
			<input type="text" bind:value={editedTitle} placeholder="Edit title" />
			<textarea bind:value={editedBody} placeholder="Edit message"></textarea>
			<button onclick={() => saveEdit(post.id)}>Save</button>
			<button onclick={cancelEditing}>Cancel</button>
		{:else}
			<h3>{post.title}</h3>
			<p>{post.body}</p>
			{#if post.user_id === userId}
				<button onclick={() => deletePost(post.id)}>Delete</button>
				<button onclick={() => startEditing(post)}>Edit</button>
			{/if}
		{/if}
	</div>
{/each}
