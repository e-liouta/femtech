<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";

	type Post = {
		id: string;
		title: string;
		body: string;
		user_id: string;
		author_name: string;
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
			.from("posts_with_author")
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

	function testClick() {
		alert("Button was clicked!");
	}
</script>

<div class="wrapper">
	<h1>Posts</h1>

	<div class="newform">
		<Input type="text" bind:value={newTitle} placeholder="Title" />
		<Input type="textarea" bind:value={newContent} placeholder="Message" />
		<Button onclick={createPost}>Post</Button>
	</div>

	{#each posts as post (post.id)}
		<div class="postcard">
			{#if editingPostId === post.id}
				<Input type="text" bind:value={editedTitle} placeholder="Edit title" />
				<Input
					type="textarea"
					bind:value={editedBody}
					placeholder="Edit message"
				/>
				<Button onclick={() => saveEdit(post.id)}>Save</Button>
				<Button onclick={cancelEditing}>Cancel</Button>
			{:else}
				<h3>{post.title}</h3>
				<p>{post.body}</p>
				<div class="postedby">
					<span>Posted by: {post.author_name}</span>
				</div>
				{#if post.user_id === userId}
					<div class="btns">
						<Button onclick={() => deletePost(post.id)}>Delete</Button>
						<Button onclick={() => startEditing(post)}>Edit</Button>
					</div>
				{/if}
			{/if}
		</div>
	{/each}
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
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	h1 {
		color: white;
		font-size: 3rem;
		text-align: center;
		margin-bottom: 2rem;
	}

	.postedby {
		font-size: 0.8rem;
		color: gray;
		font-weight: bold;
	}

	.btns {
		padding-top: 1rem;
	}

	form,
	.newform {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input[type="text"],
	textarea {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: none;
		background-color: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
		resize: vertical;

		&:focus {
			outline: none;
			box-shadow: 0 0 0 2px #ff5fa2;
			background-color: #fff;
		}
	}

	.postcard {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: 0.8rem;
		padding: 1.5rem;
		color: white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.postcard h3 {
		color: black;
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
	}

	.postcard p {
		color: black;
		margin: 0 0 1rem;
		font-size: 1.1rem;
	}

	.postcard button {
		margin-right: 0.5rem;
	}
</style>
