<template>
	<div class="container">
		<loader-svg ref="logo" />
		<v-btn @click="start">start</v-btn>
		<v-btn @click="stop">stopt</v-btn>
	</div>
</template>

<script>
	import {mapState, mapGetters} from 'vuex';

	import LoaderSvg from './preloader.svg?inline';
	import GzlyDesignMark from "./gzly-design-mark";

	export default {
		name: "grizzlyweb-logo",
		  components: {
			LoaderSvg,
		  },
		data() {
			return {

			};
		},
		computed: {
			preloader() {
				return new GzlyDesignMark(this.$refs.logo)
			},
			...mapGetters([
				'translate',
			]),
			...mapState([
				'settings',
			]),
		},
		mounted() {

			this.preloader.startLoading();
			setTimeout(() => {
				this.preloader.stopLoading();
			}, 4000)
		},
	    methods: {
			start() {
				this.preloader.startLoading();
			},
			stop() {
				this.preloader.stopLoading();
			}
	    },
		props: {
			msg: String
		}
	};
</script>

<style scoped lang="scss">
	@import 'preloader';

	.container {
		width: 70vmin;
		height: 70vmin;
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
	}


</style>
