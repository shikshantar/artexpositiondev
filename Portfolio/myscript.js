images = []
const API = "https://raw.githubusercontent.com/shikshantar/artexposition2020/master/api"

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

initialiseImages = async (name,group) => {
    var images
    await fetch (`${API}/pictures/${name}_${group}/inode.json`).
    then(response => response.json()).
    then(obj => images = obj)

    console.log(images)

    return images

}

(async function() {
    name = decodeURI(getUrlParameter("p"))

    document.getElementById("studentNameTitle").textContent = name + " - Shikshantar Art"
    console.log(name)

    document.getElementById("studentName").textContent = name
    console.log(name)

    group = decodeURI( getUrlParameter("g"))
    document.getElementById("classSection").textContent = group
    var images = await initialiseImages(name,group)

    row1 = ``
    row2 = ``

    itr = 0

    for (i of images) {
        image = `${API}/pictures/${name}_${group}/${i}/original.jpg`
        console.log(i.split(/[_]/))
        i = i.replace("_ICON","")
        correctedImageName = i.split("_")[0]
        if (itr%2 == 0) {
            row1 +=    `
            <div class="image" onclick="window.open(${image})">
                <a href="${image}" data-featherlight="image"><img src="${image}" scale="0"></a>
                <h6 style="padding-top: 0.5rem; padding-left: 0.5rem; padding-right: 0.5rem">${correctedImageName}</h6>
                <p style="padding: 0 0.5rem ">${i.split(/[_]/)[1].split(/[.]/)[0]}</p>
                <div style="height:40px;" aria-hidden="true" class="wp-block-spacer"></div>
            </div>
            `
        } else {
            row2 += `
            <div class="image" onclick="window.open(${image})">
                <a href="${image}" data-featherlight="image"><img src="${image}" scale="0"></a>
                <h6 style="padding-top: 0.5rem; padding-left: 0.5rem; padding-right: 0.5rem">${correctedImageName}</h6>
                <p style="padding: 0 0.5rem ">${i.split(/[_]/)[1].split(/[.]/)[0]}</p>
                <div style="height:40px;" aria-hidden="true" class="wp-block-spacer"></div>
            </div>
            `
        }

        itr ++
    }

    document.getElementById("row1").innerHTML = row1
    document.getElementById("row2").innerHTML = row2
}())
