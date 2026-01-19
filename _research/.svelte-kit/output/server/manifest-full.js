export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CwCF8gwX.js",app:"_app/immutable/entry/app.Cap0odOk.js",imports:["_app/immutable/entry/start.CwCF8gwX.js","_app/immutable/chunks/C9XF3vPS.js","_app/immutable/chunks/COqEOOc0.js","_app/immutable/chunks/CIHGOeTO.js","_app/immutable/entry/app.Cap0odOk.js","_app/immutable/chunks/COqEOOc0.js","_app/immutable/chunks/D6Pc9y0i.js","_app/immutable/chunks/CIHGOeTO.js","_app/immutable/chunks/DLPCevh1.js","_app/immutable/chunks/BG8Pl6mu.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/lexique",
				pattern: /^\/lexique\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
