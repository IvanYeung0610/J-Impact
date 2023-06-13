# J-Message by J-Impact

# Roster: 
### Ivan Yeung (PM)
### Joshua Liu (devo)
### James Yu (devo)
### Jun Hong Wang (devo)

# Description: 
### Our program is a messaging application where users will be able to chat with one another along with one another, featuring real-time messaging, group chats, friends, and more. Users will be able to upload their own profile pictures and emojis that they can use in their desired chats. They will be able to connect with their friends by sending friend requests to them along with being suggested new friends based on mutual friends.

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
8. Run the program

    ``` 
    python3 __init__.py
    ```

9. Click on the following link:
    
    ```
    http://127.0.0.1:5000
    ```

10. Start chatting!


*Note that when you are accessing the app, you should use chrome to have all features properly fuctioning. Firefox causes some features like creating groups to be inaccessible.
