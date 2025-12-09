<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="bg-white rounded-[13px] shadow-card h-[180px] md:h-[213px] {className}">
	<slot />
</div>

