

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/dinfo") {
			console.log(env)
			const { results } = await env.DB.prepare(
				"SELECT * FROM faces WHERE id = ?"
			)
				.bind("00ba2200cbe7ec15c36ad58c9f8a2a90de31144dc7ecc732b3bd3c9e0499277c")
				.all();
			return Response.json(results);
		}

		return new Response(
			"Call /api/beverages to see everyone who works at Bs Beverages"
		);
	},
};
