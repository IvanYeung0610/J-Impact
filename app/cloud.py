import cloudinary
import cloudinary.uploader
import cloudinary.api

from db import *
import json

key = ""
with open("keys/secret.env", "r") as secret_key:
    key = secret_key.read()

cloudinary.config(
cloud_name = "dg13dndup", 
api_key = "536775968164576", 
api_secret = key,
secure = True
)

# returns json of all the data
def upload_image(image_data):
    # print("UPLOADED ONTO CLOUDINARY")
    result = cloudinary.uploader\
    .upload(image_data, 
    gravity = "center", width = 200, height = 200, crop = "scale", 
    radius = 50, border="7px_solid_red", fetch_format="png")
    return result

def upload_emoji(image_data):
    # print("UPLOADED ONTO CLOUDINARY")
    result = cloudinary.uploader\
    .upload(image_data, 
    gravity = "center", width = 32, height = 32, crop = "scale", 
    fetch_format="png")
    return result

# def upload_default_emojis():
#     result0 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#1b7a1a", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result0["url"])


#     result1 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#1a627a", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result1["url"])

#     result2 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#5c178a", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result2["url"])

#     result3 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#9e2134", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result3["url"])

#     result4 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#a68c24", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result4["url"])

#     result5 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#000000", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result5["url"])

#     result6 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     color="#fffafa", effect="outline:outer:2:200",
#     fetch_format="png")
#     add_default_emoji(result6["url"])

#     result7 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     effect="contrast:level_20;type_linear",
#     fetch_format="png")
#     add_default_emoji(result7["url"])

#     result8 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     effect="blur:100",
#     fetch_format="png")
#     add_default_emoji(result8["url"])

#     result9 = cloudinary.uploader\
#     .upload("https://github.com/twitter/twemoji/blob/master/assets/72x72/1f34c.png?raw=true", 
#     gravity = "center", width = 32, height = 32, crop = "scale", 
#     effect="vignette:10",
#     fetch_format="png")
#     add_default_emoji(result9["url"])

# upload_default_emojis()

