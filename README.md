# J-Message by J-Impact

# Roster: 
### Ivan Yeung (PM)
### Joshua Liu (devo)
### James Yu (devo)
### Jun Hong Wang (devo)

# Description: 
### Our program is a messaging application where users will be able to chat with one another along with one another, featuring real-time messaging, group chats, friends, and more. Users will be able to upload their own profile pictures and send emojis. They will be able to connect with their friends by sending friend requests to them along with being able to create groups with their friends where they can change the group's image and add additional members.

# APIs:
### https://github.com/stuy-softdev/notes-and-code/blob/main/api_kb/411_on_Cloudinary.md 

# Launch Codes:
1. Create and activate an environment

    ```
    python3 -m venv <<name>>
    cd <<name>>
    . bin/activate
    ```
2. Clone the project 

    ```
    git clone git@github.com:IvanYeung0610/J-Impact.git
    ```

3. Navigate to root directory

    ``` 
    cd J-Impact/
    ```
4. Install requirements

    ```
    pip install -r requirements.txt
    ```
5. Make an account on cloudinary and obtain the secret key for your account. https://cloudinary.com/users/register_free 

6. Cd into app/keys and create a secret.env file inside the directory and input that key you obtained from your cloudinary account into the file.

7. Go into the cloud.py and change cloudinary.config varaibles to values that reflect the cloudinary account that you made.

    ```
    cloudinary.config(
    cloud_name = {cloud_name}, 
    api_key = {api_key}, 
    api_secret = key,
    secure = True
    )
    ```

8. Uncomment the following code in cloud.py

    ```
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
    ```
9. Run the program

    ``` 
    python3 __init__.py
    ```

10. Click on the following link:
    
    ```
    http://127.0.0.1:5000
    ```

11. Start chatting!


*Note that when you are accessing the app, you should use chrome to have all features properly fuctioning. Firefox causes some features like creating groups to be inaccessible.
