import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { supabase } from "$lib/supabaseClient";

export const ssr = false;

export const load: PageLoad = async (event) => {
	return {
		user: (async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			return user
		})()
	}
}
