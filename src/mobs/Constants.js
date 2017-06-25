const SpriteConstants = {
	SIZE: 16,
	WalkingSpeed: {
		RUN: 4,
		NORMAL: 1,
		SLOW: 0.5,
		SLOWEST: 0.25,
		STILL: 0
	},
	AnimFPS: {
		NORMAL: 6,
		SLOW: 4,
		SLOWEST: 2
	},
	Animation: {
		STILL_UP: "still-up",
		STILL_DOWN: "still-down",
		STILL_SIDE: "still-side",
		WALKING_UP: "walking-up",
		WALKING_DOWN: "walking-down",
		WALKING_SIDE: "walking-side"
	},
	Anchor: {
		X: 0.5,
		Y: 1
	},
	Direction: {
		UP: "up",
		RIGHT: "right",
		DOWN: "down",
		LEFT: "left"
	},
	DEBUG: true
};

export default SpriteConstants;
