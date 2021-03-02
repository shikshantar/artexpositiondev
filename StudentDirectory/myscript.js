var participants

var active_tab = document.getElementById("tab-holder").children[0];

var API_PATH = "https://raw.githubusercontent.com/shikshantar/artexposition2020/master/api/"

fetchFromAPI = async (path,func) => {
	await fetch(API_PATH+path).
	then (str => str.json()).
	then (obj => func(obj))
}

getSortedParticipants = async rade => {
	elegibleParticipants = participants[grade]

	keys = Object.keys(elegibleParticipants)
	var sortedParticipants = []

	for (key of keys) {
		var group = key
		var participantsInGroup = elegibleParticipants[group]

		for (participant of participantsInGroup) {
			//create an object representing each participant
			var participant = {
				"group" : group,
				"name" : participant,
				"artwork" : []
			}

			var request;
			if(window.XMLHttpRequest)
				request = new XMLHttpRequest();
			else
				request = new ActiveXObject("Microsoft.XMLHTTP");
			request.open('GET',API_PATH+"./pictures/"+participant.name+"_"+participant.group+"/inode.json", false);
			request.send(); // there will be a 'pause' here until the response to come.
			// the object request will be actually modified
			if (request.status !== 404)
				sortedParticipants.push(participant)
			else
				console.log(participant.name+" does not exist")
		}
		/*
		old code fpr shuffling, never know when it might be used
		sortedParticipants = shuffle(sortedParticipants)
		sortedParticipants = shuffle(sortedParticipants)
		*/

		sortedParticipants.sort(function(a, b) {
			var textA = a.name.toUpperCase();
			var textB = b.name.toUpperCase();
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
	}
	return sortedParticipants

}

shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

generateShowcase = async (participants, tag) => {
	HTML = `<div class="image-column">`

	participant_rows = divideArray(participants,3)

	for (participant_row of participant_rows) {
		HTML += `<div class="image-row" style="width:90%;">`

		for (participant of participant_row) {
			console.log(participant)
			image_link = await getImage(participant)
			if (image_link == null) {
				continue
			}
			console.log("recv :"+image_link)
			HTML += `<div class="image">
			<img src="${image_link}">
			<h6 style="padding-top: 0.5rem; padding-left: 0.5rem; padding-right: 0.5rem">${participant.name}</h6>
			<p style="padding: 0 0.5rem ">${participant.group}</p>
			<div class="view-more">
				View more
				<span style="display:none">${participant.name}</span>
				<span style="display:none">${participant.group}</span>
			</div>
			</div>`
		}
		HTML += `</div>`
	}

	HTML += '<div>'

	document.getElementById("data_display").innerHTML = HTML;
	initialiseParticipantButtonAction()
	active_tab.classList.remove("active-tab");
	tag.classList.add("active-tab");

	active_tab = tag;


}

getImage = async participant => {
	name = `${participant.name}_${participant.group}`
	var path = "./pictures/"+name+"/inode.json"
	console.log(path)
	try {
		await fetch(API_PATH+path).
		then (str => str.json()).
		then (obj => paths = obj)
		var path = ""
		for (possiblePath of paths) {
			if (possiblePath.toUpperCase().includes("ICON")) {
				path = possiblePath
			}
		}

		if (path == "") {
			path = paths[0]
		}
		return API_PATH+`pictures/${name}/${path}/thumbnail.jpg`
	} catch (e){
		console.log(e)
		return null
	}
}

divideArray = (arr,num) => {
	rows = [[], [], []]
	for (var i=0; i< arr.length; i++) {
		remainder = i%3
		if (remainder == 0) {
			rows[0].push(arr[i])
		} else if (remainder == 1) {
			rows[1].push(arr[i])
		} else {
			rows[2].push(arr[i])
		}
	}

	return rows
}

initialiseParticipantButtonAction = () => {
	var btns = Array.prototype.slice.call(document.getElementsByClassName("view-more"))
	console.log(btns)
	btns.forEach(btn => {

		btn.name = btn.children[0].textContent
		btn.group = btn.children[1].textContent

		btn.onclick = function (){
			openPortfolio(this.name, this.group)
		}
	})
}


openPortfolio = (name,group) => {
	window.open(`./../Portfolio?p=${name}&g=${group}`)
}


initialise_participants = async () => {
	await fetchFromAPI("participants.json", p => {
		participants = p
	})
}

executeDropdownBehaviour = tag => {
	var groups = Object.keys(tag.dropdown_content)

	if (document)

	div = document.createElement("div");
	div.id = this.class + "-dropdown"
	inner_html = ""

	groups.forEach( group => {
		inner_html += `
			<div>
			</div>
		`
	} )
}

getAndDisplayOpeningDialogue = child => {
	var thetab = child
	fetch ("./introduction.html").
	then (response => response.text()).
	then (data => {
		display = document.getElementById("data_display")

		console.log(data)
		display.innerHTML = data
		active_tab.classList.remove("active-tab");
		thetab.classList.add("active-tab");
		active_tab = thetab;
	})

}

(async function() {
	var tabs = document.getElementById('tab-holder');
	var children = Array.prototype.slice.call(tabs.children);
	console.log(children)

	await initialise_participants()
	console.log(children)

	for (child of children) {
		console.log(child)
		if (!child.innerHTML.includes("<")) {
			child.onclick = async function () {
				document.getElementById("data_display").innerHTML = ""

				this.class = this.textContent
				this.dropdown_content = participants[this.textContent]
				console.log("helo")

				//executeDropdownBehaviour(this)

				grade = this.textContent
				this.sortedParticipants = await getSortedParticipants(grade)

				generateShowcase(this.sortedParticipants, this)
			}
		} else {
			console.log(child)
			child.click()
		}
	}


})();
