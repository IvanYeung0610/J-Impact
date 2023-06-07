import cloudinary
import cloudinary.uploader
import cloudinary.api

with open("app/keys/secret.env", "r") as secret_key:
    print(secret_key.read())
cloudinary.config( 
cloud_name = "", 
api_key = "", 
api_secret = "",
secure = True
)