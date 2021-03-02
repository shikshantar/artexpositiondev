import os
from os.path import isfile, join
from PIL import Image
import re

ART_DIR = "./artWebsite/"
THUMBNAIL_SIZE = (757,757)

def main():
	files = [file for file in os.listdir(ART_DIR) if isfile(join(ART_DIR, file))]
	ArtImageList = createArtImages(files)
	print(ArtImageList)
	create_directory_structure(ArtImageList)
	create_thumbnails(ArtImageList)

def createArtImages(files):
	list = []

	for file in files:
		list.append(ArtImages(file))

	return list

class ArtImages():
	def __init__(self, file):
		self.file = file
		self.file_name = file.split("/")[-1]
		self.initialise_name()

	def initialise_name(self):
		self.author_name = re.split('[^a-zA-Z]', self.file_name)[0]

def create_directory_structure(ArtImageList):
	# due to insufficiend data, resorting to name wise distribution
	# not deleting files automatically, cause no need to YET

	for ArtImage in ArtImageList:
		ArtImage.author_path = ART_DIR+ArtImage.author_name
		try :
			os.mkdir(ArtImage.author_path)
		except:
			pass
		try:
			os.mkdir(ArtImage.author_path + "/" +ArtImage.file_name.split(".")[0])
		except:
			pass

		os.rename(ART_DIR + ArtImage.file , ArtImage.author_path + "/" +ArtImage.file_name.split(".")[0] + "/" + ArtImage.file_name )

		ArtImage.file = ArtImage.author_path + "/" + ArtImage.file_name.split(".")[0] + "/" + ArtImage.file_name 
		ArtImage.directory_path = ArtImage.author_path + "/" + ArtImage.file_name.split(".")[0]

def create_thumbnails(ArtImageList):
	for ArtImage in ArtImageList:
		image = Image.open(ArtImage.file)
		image.thumbnail(THUMBNAIL_SIZE)
		image.save(ArtImage.directory_path + '/' + str(THUMBNAIL_SIZE)+".jpg")
main()