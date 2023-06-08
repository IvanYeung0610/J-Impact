import cloudinary
import cloudinary.uploader
import cloudinary.api

key = ""
with open("app/keys/secret.env", "r") as secret_key:
    key = secret_key.read()

cloudinary.config(
cloud_name = "dg13dndup", 
api_key = "536775968164576", 
api_secret = secret_key,
secure = True
)