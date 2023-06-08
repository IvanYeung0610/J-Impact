import sqlite3

DB_FILE = "test.db"

db = sqlite3.connect(DB_FILE, check_same_thread=False)
c = db.cursor()
c.executescript("""
    create TABLE if NOT EXISTS Account(username text primary key, password text, pfp text, desc text);
    create TABLE if NOT EXISTS Friends(username1 text, username2 text, PRIMARY KEY (username1, username2));
    create TABLE if NOT EXISTS FriendRequests(username1 text, username2 text, PRIMARY KEY (username1, username2));
    create TABLE if NOT EXISTS Messages(username text, group_id int, message text, time text);
    create TABLE if NOT EXISTS UserAssociation(group_id int, username text, PRIMARY KEY (group_id, username));
    create TABLE if NOT EXISTS EmojiAssociation(group_id int, emoji text, PRIMARY KEY (group_id, emoji));
    create TABLE if NOT EXISTS Groups(group_id int primary key, Title text, image text);
""")
c.close()

# ================ ACCESSING INFORMATION ================
def get_user(username):
    c = db.cursor()
    c.execute("select * from Account WHERE username = ?", (username,))
    user = c.fetchone()
    c.close()
    return user

# Returns True or False. True if a user exists with the given info, False if not.
def match_account_info(username, password):
    c = db.cursor()
    c.execute('select username from Account where (username = ? AND password = ?)', (username, password,))
    info = c.fetchone()
    c.close()
    return info != None

# RETURNS 2D ARRAY: [ [username, pfp, desc], . . . ]
def get_all_users():
    c = db.cursor()
    c.execute("select * from Account")
    data = c.fetchall()
    # return [[user[0], user[2]] for user in data]
    dict = {}
    for user in data:
        dict[user[0]] = user[2]
    # returns dict:
    # {
    #     username1: pfp1 
    #     username2: pfp2
    # }
    return dict


# returns a list of all groups that a certain user is in.
def get_all_groups_from_user(username):
    c = db.cursor()
    c.execute('select group_id from UserAssociation where (username = ?)', (username,))
    info = c.fetchall()
    c.close()
    return [group[0] for group in info]

# Returns a list of all usernames associated to a certain group
def get_all_users_by_group(group_id):
    c = db.cursor()
    c.execute('select username from UserAssociation where (group_id = ?)', (group_id,))
    info = c.fetchall()
    c.close()
    return [user[0] for user in info]

# Returns a list all users in a group other than the inputed username
def get_all_other_users_by_group(group_id, username):
    users = get_all_users_by_group(group_id)
    users.remove(username)
    return users

            
# Get all requests that the user has sent or recieved. 2D ARRAY: [ [USER1, USER2], . . . ] USERS CAN BE IN ANY ORDER
def get_all_friend_requests(user):
    c = db.cursor()
    c.execute("select * from FriendRequests WHERE (username1 = ? OR username2 = ?)", (user, user))
    data = c.fetchall()
    c.close()
    return data

# Get all friends of the user. 2D ARRAY: [ [USER1, USER2], . . . ] USERS CAN BE IN ANY ORDER
def get_all_friends(user):
    c = db.cursor()
    c.execute("select * from Friends WHERE (username1 = ? OR username2 = ?)", (user, user))
    data = c.fetchall()
    c.close()
    return data

# Gets all messages that were sent in a group
def get_messages_from_group(group_id):
    c = db.cursor()
    c.execute("SELECT * FROM Messages WHERE (group_id = ?)", (group_id,))
    data = c.fetchall()
    c.close()
    return data

# Gets the title for the group
def get_group_title(group_id):
    c = db.cursor()
    c.execute("SELECT Title FROM Groups WHERE (group_id = ?)", (group_id,))
    data = c.fetchone()
    if data == "" or data == None:
        data = ""
        users = get_all_users_by_group(group_id)
        for x in users:
            data += x + ", "
        data = data[:-2] + "'s chat"
    c.close()
    return data

# Gets the image (pfp) for the group
def get_group_image(group_id):
    c = db.cursor()
    c.execute("SELECT image FROM Groups WHERE (group_id = ?)", (group_id,))
    data = c.fetchone()
    c.close()
    return data

# Gets the size of the group
def get_group_size(group_id):
    data = get_all_users_by_group(group_id)
    return len(data)

# Gets profile picture of a user
def get_pfp(username):
    c = db.cursor()
    c.execute("SELECT pfp FROM Account WHERE (username = ?)", (username))
    data = c.fetchone()
    c.close()
    return data

# ================ INSERTING INFORMATION ================

# ADDS NEW USER: iff the username does not already exist. 
# Returns True/False depending on the status of adding user. False means the username already exists.
def add_user(username, password): 
    if(get_user(username) != None):
        return False
    c = db.cursor()
    c.execute("INSERT into Account values(?,?,?,?)", (username, password, "http://res.cloudinary.com/dg13dndup/image/upload/v1686194492/mzhudjd56rpkqtkgrei0.png","ADD A DESCRIPTION . . ."))
    db.commit()
    c.close()
    return True

def add_to_group(group_id, username):
    c = db.cursor()
    try:
        c.execute("INSERT into UserAssociation values(?,?)", (group_id, username))
        db.commit()
    except:
        print("ALREADY PART OF GROUP")
    c.close()

def add_message(username, group_id, message, time):
    c = db.cursor()
    c.execute("INSERT into Messages values(?,?,?,?)", (username, group_id, message, time,))
    db.commit()
    c.close()

# WILL AUTOMATICALLY SET BOTH PEOPLE IN A GROUP
def add_friend(user1, user2):
    c = db.cursor()
    try:
        c.execute("INSERT into Friends values(?,?)", (user1, user2,))
        c.execute("select max(group_id) from UserAssociation")
        max_id = c.fetchone()[0]
        if max_id != None:
            max_id += 1
        else:
            max_id = 0
        c.execute("INSERT into UserAssociation values(?,?)", (max_id, user1,))
        c.execute("INSERT into UserAssociation values(?,?)", (max_id ,user2,))
        db.commit()
    except:
        print("ALREADY FRIENDS")
    c.close()

# user1: Sender, user2: reciever
def add_friend_request(user1, user2):
    c = db.cursor()
    try:
        c.execute("INSERT into FriendRequests values(?,?)", (user1, user2,))
        db.commit()
    except:
        print("ALREADY REQUESTED")
    c.close()

# Adds a group to database when a new one is created either through an accepted friend request or a group that is made
def add_group(group_id, title, image):
    c = db.cursor()
    try:
        c.execute("INSERT into Groups values(?,?,?)", (group_id, title, image,))
        db.commit()
    except:
        print("GROUP ALREADY EXISTS")
    c.close()

# Creates a group without having add on to a friend group
def create_group(title, image, members):
    c = db.cursor()
    try:
        c.execute("select max(group_id) from UserAssociation")
        max_id = c.fetchone()[0]
        if max_id != None:
            max_id += 1
        else:
            max_id = 0
        add_group(max_id, title, image)
        for member in members:
            c.execute("INSERT into UserAssociation values(?, ?)", (max_id, member))
        db.commit()
    except:
        print("GROUP CANNOT BE MADE")
    c.close()

# ================ CHANGING INFORMATION ================

#Changes pfp of user
def change_pfp(username, new_pfp):
    c = db.cursor()
    try:
        c.execute("UPDATE Account SET pfp = ? WHERE username = ?", (new_pfp, username))
        db.commit()
    except:
        print("USER DOES NOT EXIST")
    c.close()

#Changes description of the user
def change_desc(username, new_desc):
    c = db.cursor()
    try:
        c.execute("UPDATE Account SET desc = ? WHERE username = ?", (new_desc, username))
        db.commit()
    except:
        print("USER DOES NOT EXIST")
    c.close()

#Changes title of the group
def change_group_title(group_id, new_title):
    c = db.cursor()
    try:
        c.execute("UPDATE Groups SET Title = ? WHERE group_id = ?", (new_title, group_id,))
        db.commit()
    except:
        print("GROUP DOES NOT EXIST")
    c.close()

#Changes image(pfp) of the group
def change_group_image(group_id, new_image):
    c = db.cursor()
    try:
        c.execute("UPDATE Groups SET image = ? WHERE group_id = ?", (new_image, group_id,))
        db.commit()
    except:
        print("GROUP DOES NOT EXIST")
    c.close()
# ================ DELETING INFORMATION ================
# user1: Sender, user2: reciever
def delete_friend_request(user1,user2):
    c = db.cursor()
    c.execute("DELETE from FriendRequests WHERE (user1 = ? AND user2 = ?)", (user1, user2,))
    db.commit()
    c.close()

# ================ POPULATING DATABASE (SAMPLE) ================
# only run once
def populate():
    c = db.cursor()
    c.execute("SELECT COUNT(*) FROM Account")
    size = c.fetchone()[0]
    if size == 0:
        for x in range(26):
            add_user(chr(x + 97), chr(x + 97))
        for x in range(26):
            if x % 4 == 0:
                if x == 0: 
                    pass
                else:
                    add_friend("a", chr(x + 97))
        for x in range(26):
            if (x + 2) % 4 == 0:
                add_friend_request("a", chr(x + 98))
        add_friend("a","b")
        add_friend("a","c")
        add_friend_request("f", "a")
        add_group(1, "DA BEST IN DA WEST", "image")
        add_to_group(1, "d")
        create_group("Falling Dogs", "image", ["f", "h", "i", "j", "g"])
    db.commit()
    c.close
