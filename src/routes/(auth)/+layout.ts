import type { LayoutLoad } from "./$types";
import { supabase } from "$lib/supabaseClient";

export const ssr = false;

export const load: LayoutLoad = async (event) => {
	return {
		user: (async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			return user
		})()
	}
}
