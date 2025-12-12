<script lang="ts">
	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<div class="md:px-8 xl:px-20 pt-2 pb-3">
	<h1 class="text-xl md:text-2xl lg:text-[30px] font-bold text-gray-300 uppercase tracking-[0.06em]">
		{title}
	</h1>
</div>

