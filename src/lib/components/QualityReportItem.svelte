<script lang="ts">
	interface Props {
		title: string;
		date: string;
		severity: 'critical' | 'warning' | 'info';
		category: string;
	}

	let { title, date, severity, category }: Props = $props();

	const severityConfig = {
		critical: { bg: 'transparent', text: 'text-red-700', dot: 'bg-red-500' },
		warning: { bg: 'transparent', text: 'text-amber-700', dot: 'bg-amber-500' },
		info: { bg: 'transparent', text: 'text-gray-500', dot: 'bg-blue-500' }
	};

	const config = severityConfig[severity];
</script>

<div class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
	<div class="w-2 h-2 rounded-full {config.dot} mt-2 shrink-0"></div>
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium text-gray-900 truncate">{title}</p>
		<div class="flex items-center gap-2 mt-1">
			<span class="text-xs {config.bg} {config.text} py-0.5 rounded-full font-medium">{category}</span>
			<span class="text-xs text-gray-400">{date}</span>
		</div>
	</div>
</div>

