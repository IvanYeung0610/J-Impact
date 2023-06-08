import cloudinary
import cloudinary.uploader
import cloudinary.api


key = ""
with open("app/keys/secret.env", "r") as secret_key:
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