import os
import json

def main ():
    data = [{},{},{},{}]
    directories = os.listdir("./pictures/")
    print(directories)


    for directory in directories:
        group = directory.split("_")[-1]
        name = directory.split("_")[0]

        grade = get_grade(group) - 9
        path = "./pictures/"+directory+"/inode.json"

        images = json.load(open(path,"r"))
        icon = get_icon(images)

        data[grade][name] = "/pictures/"+directory+"/"+icon


    
    write_data(data)

def get_grade (group) :
    return int(json.load(open("./groupmapper.json","r"))[group.upper()])

def get_icon (images) :
    for image in images :
        if "ICON" in image.upper() :
            return image

    return images[0]

def write_data (data) : 
    with open("inode_9","w+") as f:
        json.dump(data[0],f)
    with open("inode_10","w+") as f:
        json.dump(data[1],f)
    with open("inode_11","w+") as f:
        json.dump(data[2],f)
    with open("inode_12","w+") as f:
        json.dump(data[3],f)

main()
