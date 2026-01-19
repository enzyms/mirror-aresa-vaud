
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NVM_INC: string;
	export const STARSHIP_SHELL: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const NVM_CD_FLAGS: string;
	export const TERM: string;
	export const SHELL: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_config_global_prefix: string;
	export const TERM_PROGRAM_VERSION: string;
	export const COLOR: string;
	export const TERM_SESSION_ID: string;
	export const npm_config_noproxy: string;
	export const npm_config_local_prefix: string;
	export const ZSH: string;
	export const ACCOUNT_ID: string;
	export const LC_ALL: string;
	export const GIT_EDITOR: string;
	export const BRANCH: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const LS_COLORS: string;
	export const npm_config_globalconfig: string;
	export const NETLIFY_CLI_VERSION: string;
	export const SSH_AUTH_SOCK: string;
	export const Q_SET_PARENT_CHECK: string;
	export const HEAD: string;
	export const NEXT_TELEMETRY_DISABLED: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const GATSBY_TELEMETRY_DISABLED: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const LSCOLORS: string;
	export const SITE_ID: string;
	export const KIRO_CLI_USING_ZSH_AUTOSUGGESTIONS: string;
	export const CACHED_COMMIT_REF: string;
	export const PATH: string;
	export const npm_package_json: string;
	export const _: string;
	export const DEPLOY_URL: string;
	export const npm_config_userconfig: string;
	export const npm_config_init_module: string;
	export const __CFBundleIdentifier: string;
	export const SHELL_PID: string;
	export const npm_command: string;
	export const TTY: string;
	export const PWD: string;
	export const CONTEXT: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
	export const DEPLOY_ID: string;
	export const npm_package_name: string;
	export const LANG: string;
	export const npm_config_npm_version: string;
	export const XPC_FLAGS: string;
	export const BUILD_ID: string;
	export const npm_config_node_gyp: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const URL: string;
	export const SHLVL: string;
	export const HOME: string;
	export const LANGUAGE: string;
	export const NETLIFY_LOCAL: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_config_cache: string;
	export const LOGNAME: string;
	export const LESS: string;
	export const STARSHIP_SESSION_KEY: string;
	export const npm_lifecycle_script: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const NVM_BIN: string;
	export const DEPLOY_PRIME_URL: string;
	export const npm_config_user_agent: string;
	export const NETLIFY_SKEW_PROTECTION_TOKEN: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const Q_TERM: string;
	export const QTERM_SESSION_ID: string;
	export const PULL_REQUEST: string;
	export const CLAUDECODE: string;
	export const SITE_NAME: string;
	export const COMMIT_REF: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NVM_INC: string;
		STARSHIP_SHELL: string;
		NoDefaultCurrentDirectoryInExePath: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		TERM_PROGRAM: string;
		NODE: string;
		INIT_CWD: string;
		NVM_CD_FLAGS: string;
		TERM: string;
		SHELL: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_config_global_prefix: string;
		TERM_PROGRAM_VERSION: string;
		COLOR: string;
		TERM_SESSION_ID: string;
		npm_config_noproxy: string;
		npm_config_local_prefix: string;
		ZSH: string;
		ACCOUNT_ID: string;
		LC_ALL: string;
		GIT_EDITOR: string;
		BRANCH: string;
		NVM_DIR: string;
		USER: string;
		LS_COLORS: string;
		npm_config_globalconfig: string;
		NETLIFY_CLI_VERSION: string;
		SSH_AUTH_SOCK: string;
		Q_SET_PARENT_CHECK: string;
		HEAD: string;
		NEXT_TELEMETRY_DISABLED: string;
		__CF_USER_TEXT_ENCODING: string;
		GATSBY_TELEMETRY_DISABLED: string;
		npm_execpath: string;
		PAGER: string;
		LSCOLORS: string;
		SITE_ID: string;
		KIRO_CLI_USING_ZSH_AUTOSUGGESTIONS: string;
		CACHED_COMMIT_REF: string;
		PATH: string;
		npm_package_json: string;
		_: string;
		DEPLOY_URL: string;
		npm_config_userconfig: string;
		npm_config_init_module: string;
		__CFBundleIdentifier: string;
		SHELL_PID: string;
		npm_command: string;
		TTY: string;
		PWD: string;
		CONTEXT: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
		DEPLOY_ID: string;
		npm_package_name: string;
		LANG: string;
		npm_config_npm_version: string;
		XPC_FLAGS: string;
		BUILD_ID: string;
		npm_config_node_gyp: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		URL: string;
		SHLVL: string;
		HOME: string;
		LANGUAGE: string;
		NETLIFY_LOCAL: string;
		HOMEBREW_PREFIX: string;
		npm_config_cache: string;
		LOGNAME: string;
		LESS: string;
		STARSHIP_SESSION_KEY: string;
		npm_lifecycle_script: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		NVM_BIN: string;
		DEPLOY_PRIME_URL: string;
		npm_config_user_agent: string;
		NETLIFY_SKEW_PROTECTION_TOKEN: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		Q_TERM: string;
		QTERM_SESSION_ID: string;
		PULL_REQUEST: string;
		CLAUDECODE: string;
		SITE_NAME: string;
		COMMIT_REF: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
