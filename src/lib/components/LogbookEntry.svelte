<script lang="ts">
	interface Props {
		title: string;
		content: string;
		timestamp: string;
		author: string;
	}

	let { title, content, timestamp, author }: Props = $props();
</script>

<div class="py-4 border-b border-gray-100 last:border-0">
	<div class="flex items-center justify-between mb-2">
		<h4 class="font-semibold text-gray-900">{title}</h4>
		<span class="text-xs text-gray-400">{timestamp}</span>
	</div>
	<p class="text-sm text-gray-600 line-clamp-2">{content}</p>
	<p class="text-xs text-gray-400 mt-2">Par {author}</p>
</div>

