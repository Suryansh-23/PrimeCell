<script lang="ts">
	import { fade } from 'svelte/transition';
	import Grid from '../components/Grid.svelte';
	import Info from '../components/Info.svelte';
	import { currRandom, iters, play, seed, totalIters } from '../stores/store';
	import { getRandomHex, hexToBinary } from '../utils';

	let editable: boolean = false;
	let keyPlay: boolean = false;
	let clear: boolean = false;
	let iterations: number = 10;

	let modal: HTMLDialogElement;

	$: {
		console.log('main page re-rendered');
	}
</script>

<svelte:document
	on:keydown={async (e) => {
		if (e instanceof KeyboardEvent) {
			// console.log(e);
			switch (e.key) {
				case 'Enter':
					editable = !editable;
					return;
				case ' ':
					$play = false;
					keyPlay = !keyPlay;
					$iters = Infinity;
					return;
				case 'Escape':
					clear = true;
					await new Promise((_) => setTimeout(_, 150));
					clear = false;
					$seed = '0'.repeat(64);
					$iters = 0;
					$totalIters = 0;
					return;
			}
		}
	}} />

<div class="mt-[7.5rem] flex max-w-full flex-col justify-around gap-7 lg:mx-10">
	<h1 class="prose ml-[-4.5rem] inline max-w-full text-center font-[Montserrat] text-5xl font-bold">
		PrimeCell
	</h1>
	<div class="flex w-full flex-wrap justify-center">
		<section class="me-10 flex w-full max-w-xs flex-col gap-y-4">
			<form class="flex flex-col gap-y-4">
				<fieldset class="form-control">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">
						<legend class="label-text text-2xl font-medium">Seed</legend>
						<span class="label-textx-alt label-text">
							<button
								class="btn-neutral btn-square btn"
								on:click={() => {
									$seed = getRandomHex(64);
									$iters = 0;
									$totalIters = 0;
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-dices"
									><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /><path
										d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /><path
										d="M6 18h.01" /><path d="M10 14h.01" /><path d="M15 6h.01" /><path
										d="M18 9h.01" /></svg
								></button>
							<button
								class="btn-neutral btn-square btn"
								on:click={() => {
									// copy the seed to clipboard
									navigator.clipboard.writeText($seed);
									console.log(hexToBinary($seed));
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-copy"
									><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
										d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg
								></button>
						</span>
					</label>
					<input
						type="text"
						placeholder="Type here"
						class="input-bordered input w-full max-w-xs"
						bind:value={$seed}
						class:input-error={$seed.length !== 64} />
					<!-- svelte-ignore a11y-label-has-associated-control -->
					{#if $seed.length !== 64}
						<label class="label">
							<span class="label-text-alt" transition:fade
								>The Seed phrase must be equal to 64 digits.</span
							></label>
					{/if}
				</fieldset>
				<div class="flex items-center justify-between">
					<!-- svelte-ignore a11y-label-has-associated-control -->

					<span class="label-text h-fit text-2xl font-medium">Iterations</span>

					<input
						type="number"
						placeholder="Type here"
						class="input-bordered input w-28"
						bind:value={iterations} />
				</div>
				<button
					class="btn-neutral btn"
					class:btn-disabled={$seed.length !== 64 || iterations < 1}
					on:click={() => {
						$iters = iterations;
						keyPlay = false;
						$play = true;
						$seed = $seed;
						$totalIters = 0;
					}}
					>Generate
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						style="color: #c8cad0cc;"
						class="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
					></button>
			</form>
			<div class="divider w-full" />
			<div class="">
				<span class="label-text mb-4 block h-fit text-2xl font-medium"
					>Random Num <code class="font-thin">#{$totalIters}</code></span>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="join-vertical join w-full font-mono"
					on:click|capture={(e) => {
						if (e instanceof MouseEvent && e.target instanceof HTMLButtonElement) {
							navigator.clipboard.writeText(e.target?.innerText);
						}
					}}>
					<div class="tooltip tooltip-right" data-tip="Copy">
						<button class="btn-neutral mb-2 w-full truncate p-1 px-2">{$currRandom.hex}</button>
					</div>
					<div class="tooltip tooltip-right" data-tip="Copy">
						<button class="btn-neutral w-full truncate p-1 px-2">{$currRandom.dec}</button>
					</div>
				</div>
			</div>
		</section>

		<div class="divider w-full md:divider-vertical lg:divider-horizontal" />
		<div class="ms-10">
			<Grid {editable} {keyPlay} {clear} />
		</div>
	</div>
</div>
<div class="absolute right-4 top-4 flex items-center gap-x-3">
	<div class="flex items-center font-medium">
		Built using
		<a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer" class="-mr-6 pl-1">
			<img
				class="h-16 w-16"
				src="https://svelte.dev/_app/immutable/assets/svelte-logo.5c5d7d20.svg"
				alt="Svelte" />
		</a>
	</div>
	<a
		class="btn-neutral btn-square btn"
		href="https:\\github.com\Suryansh-23\primecell"
		rel="noopener noreferrer"
		target="_blank">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-github">
			<path
				d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</svg>
	</a>
	<button
		class="btn-neutral btn-square btn"
		on:click={() => {
			modal.showModal();
		}}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-info"
			><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
		></button>
</div>
<dialog bind:this={modal} class="modal">
	<form method="dialog" class="frost modal-box pb-10">
		<!-- <h3 class="text-lg font-bold">Hello!</h3> -->
		<!-- <p class="py-4">Press ESC key or click outside to close</p> -->
		<Info />
	</form>
	<form method="dialog" class="modal-backdrop">
		<button class="cursor-default">close</button>
	</form>
</dialog>
