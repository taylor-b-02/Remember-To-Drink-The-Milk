export default class Scroll {
	constructor() {
		this.main = document.querySelector(".main-page");
		this.header = document.querySelector(".navbar");

		this.pic1 = document.querySelector(".pic1");
		this.pic2 = document.querySelector(".pic2");
		this.pic3 = document.querySelector(".pic3");
		this.pic4 = document.querySelector(".pic4");

		this.playNext = true;
		// this.pause= 0;

		this.carousel = [
			{
				colorChange: "blue-lightblue",
				frameOut: this.pic1,
				frameIn: this.pic2,
				color: "#3292f2",
			},
			{
				colorChange: "lightblue-purple",
				frameOut: this.pic2,
				frameIn: this.pic3,
				color: "#6a4ca6",
			},
			{
				colorChange: "purple-green",
				frameOut: this.pic3,
				frameIn: this.pic4,
				color: "#5bb84d",
			},
			{
				colorChange: "green-blue",
				frameOut: this.pic4,
				frameIn: this.pic1,
				color: "#0060bf",
			},
		];
	}
	play = async () => {
		while (this.playNext /*|| this.pause !== 3*/) {
			await this.timer(5000); // waits 5 secs before switching

			let transition = this.carousel.shift();

			this.main.style.colorchange = transition.colorChange;
			this.header.style.colorChange = transition.colorChange;
			// console.log(this.header.style.colorChange);

			transition.frameOut.style.animationName = "out-frame";
			// console.log(transition.frameOut);
			// console.log(this.pic1);
			// console.log(this.pic2);
			// console.log(this.pic3);
			// console.log(this.pic4);

			transition.frameIn.style.animationName = "in-frame";

			this.main.style.backgroundColor = transition.color;
			this.header.style.backgroundColor = transition.color;

			transition.frameOut.style.left = "-250%";
			transition.frameIn.style.left = "50%";
			this.carousel.push(transition);
			// pause ++
		}
	};

	timer = async (time) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve("resolved");
			}, time);
		});
	};
}
