<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";
	import { supabase } from "$lib/supabaseClient";

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

{#await data.user}
	<div>...Loading</div>
{:then user}
	{#if !user}
		{goto(`/login?redirect=${document.location}`)}
	{/if}
{/await}
{@render children()}
