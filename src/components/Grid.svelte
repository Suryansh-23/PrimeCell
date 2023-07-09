<script lang="ts">
	import { onMount } from 'svelte';
	import { currRandom, iters, play, seed, totalIters } from '../stores/store';
	import { binaryToDecimal, binaryToHex, hexToBinary, hexToDecimal } from '../utils';

	export let num: number = 16;
	export let editable: boolean = false;
	export let keyPlay: boolean = false;
	export let clear: boolean = false;

	let delayed = true;
	let binSeed = hexToBinary($seed);
	const cells: number[][] = [];
	let tmp;
	for (let i = 0; i < num; i++) {
		tmp = new Array(num);
		for (let j = 0; j < num; j++) {
			tmp[j] = Number(binSeed[i * num + j]);
		}
		cells.push(tmp);
		$currRandom = { hex: $seed, dec: hexToDecimal($seed) };
	}

	const grid: number[] = [];
	for (let i = 0; i < num * num; i++) {
		grid.push(i);
	}

	let future: number[][] = [];
	for (let i = 0; i < num; i++) {
		future.push(new Array(num).fill(0));
	}

	$: {
		if ($play || binaryToHex(binSeed) !== $seed) {
			binSeed = hexToBinary($seed);
			for (let i = 0; i < num; i++) {
				for (let j = 0; j < num; j++) {
					cells[i][j] = Number(binSeed[i * num + j]);
				}
			}
			$currRandom = { hex: $seed, dec: binaryToDecimal(binSeed) };
		}
	}

	const step = async () => {
		if (clear) {
			for (let i = 0; i < num; i++) {
				for (let j = 0; j < num; j++) {
					cells[i][j] = 0;
				}
			}
		}

		if ((keyPlay || $play) && $iters > 0) {
			$iters = $iters - 1;
			$totalIters++;
			for (let i = 0; i < num; i++) {
				for (let j = 0; j < num; j++) {
					future[i][j] = cells[i][j];
				}
			}

			for (let i = 0; i < num; i++) {
				for (let j = 0; j < num; j++) {
					let neighs = [
						[(i - 1 + num) % num, (j + num) % num],
						[(i + 1 + num) % num, (j + num) % num],
						[(i + num) % num, (j - 1 + num) % num],
						[(i + num) % num, (j + 1 + num) % num],
						[(i - 1 + num) % num, (j - 1 + num) % num],
						[(i - 1 + num) % num, (j + 1 + num) % num],
						[(i + 1 + num) % num, (j - 1 + num) % num],
						[(i + 1 + num) % num, (j + +num) % num]
					];
					let liveNeighs = neighs.map(([x, y]) => cells[x][y]).filter((x) => x).length;
					if (cells[i][j]) {
						if (liveNeighs < 2 || liveNeighs > 4) {
							future[i][j] = 0;
						}
					} else {
						if (liveNeighs === 3) {
							future[i][j] = 1;
						}
					}
				}
			}

			for (let i = 0; i < num; i++) {
				for (let j = 0; j < num; j++) {
					cells[i][j] = future[i][j];
				}
			}

			$currRandom = {
				hex: binaryToHex(future.flat().join('')),
				dec: binaryToDecimal(future.flat().join(''))
			};
		}

		if ($iters == 0) {
			$play = false;
			keyPlay = false;
			$iters = Infinity;
		}

		delayed && (await new Promise((_) => setTimeout(_, 100)));
		requestAnimationFrame(step);
	};

	onMount(() => {
		requestAnimationFrame(step);
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="w-fit border border-slate-400">
	<div
		class="grid w-max"
		style="grid-template-columns: repeat({num}, minmax(0, 1fr))"
		on:focus={() => {}}
		on:mouseover|capture={(e) => {
			if (editable) {
				const x = Number(e.target?.getAttribute('data-x'));
				const y = Number(e.target?.getAttribute('data-y'));

				cells[x][y] = Number(!cells[x][y]);
				const start = Math.floor((x * num + y) / 4);

				$seed =
					$seed.slice(0, start) +
					parseInt(
						`${cells[Math.floor(start / 4)][(start * 4) % num]}${
							cells[Math.floor(start / 4)][((start * 4) % num) + 1]
						}${cells[Math.floor(start / 4)][((start * 4) % num) + 2]}${
							cells[Math.floor(start / 4)][((start * 4) % num) + 3]
						}`,
						2
					).toString(16) +
					$seed.slice(start + 1);
			}
		}}>
		{#each cells as row, x}
			{#each row as cell, y}
				<div
					data-x={x}
					data-y={y % num}
					data-live={cell}
					style="width: calc((100vw * 0.90)/16); height: calc((100vw * 0.90)/16);"
					class="max-h-7 max-w-[1.75rem] select-none border border-slate-400 text-center"
					class:cursor-default={!editable}
					class:bg-slate-500={Boolean(cell)}>
					{#if isNaN(cell)}
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
							class="mx-auto my-auto align-middle"
							><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
					{/if}
				</div>
			{/each}
		{/each}
	</div>
</div>
<div class="form-control mt-2 items-center">
	<label class="label w-fit cursor-pointer">
		<span class="label-text mr-3 text-xl">Delayed</span>
		<input type="checkbox" class="toggle" bind:checked={delayed} />
	</label>
</div>
