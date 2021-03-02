const STATIC_ASSETS_URL = "https://raw.githubusercontent.com/shikshantar/artexposition2020/master/staticAssets"

startBackgroundRotation = async (totalImages, delay) => {
	rotation_index = 0

	function rotate(totalImages, index) {
		document.getElementById("slideshow").style.backgroundImage = `url(${STATIC_ASSETS_URL}/banner/${index%totalImages}.jpg)`
		console.log(index)
		return index + 1
	}

	setInterval(() => {
		rotation_index = rotate(totalImages, rotation_index)
	}, delay);
}

(function() {

	startBackgroundRotation(5,3000)

})()
