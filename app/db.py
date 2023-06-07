import sqlite3

DB_FILE = "test.db"

db = sqlite3.connect(DB_FILE, check_same_thread=False)
c = db.cursor()
c.executescript("""
    create TABLE if NOT EXISTS Account(username text primary key, password text, pfp text);
    create TABLE if NOT EXISTS Friends(username1 text, username2 text, PRIMARY KEY (username1, username2));
    create TABLE if NOT EXISTS FriendRequests(username1 text, username2 text, PRIMARY KEY (username1, username2));
    create TABLE if NOT EXISTS Messages(username text, group_id int, message text, time text);
    create TABLE if NOT EXISTS UserAssociation(group_id int, username text, PRIMARY KEY (group_id, username));
    create TABLE if NOT EXISTS EmojiAssociation(group_id int, emoji text, PRIMARY KEY (group_id, emoji));
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

# RETURNS 2D ARRAY: [ [username, pfp], . . . ]
def get_all_users():
    c = db.cursor()
    c.execute("select * from Account")
    data = c.fetchall()
    return [[user[0], user[2]] for user in data]

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

# Get all requests that the user has sent or recieved. 2D ARRAY: [ [USER1, USER2], . . . ] USERS CAN BE IN ANY ORDER
def get_all_friend_requests(user):
    c = db.cursor()
    c.execute("select * from FriendRequests WHERE (username1 = ? OR username2 = ?)", (user, user))
    data = c.fetchall()
    return data

# Get all friends of the user. 2D ARRAY: [ [USER1, USER2], . . . ] USERS CAN BE IN ANY ORDER
def get_all_friends(user):
    c = db.cursor()
    c.execute("select * from Friends WHERE (username1 = ? OR username2 = ?)", (user, user))
    data = c.fetchall()
    return data

def get_messages_from_group(group_id):
    c = db.cursor()
    c.execute("SELECT * FROM Messages WHERE (group_id = ?)", (group_id,))
    data = c.fetchall()
    c.close()
    return data

# ================ INSERTING INFORMATION ================

# ADDS NEW USER: iff the username does not already exist. 
# Returns True/False depending on the status of adding user. False means the username already exists.
def add_user(username, password): 
    if(get_user(username) != None):
        return False
    c = db.cursor()
    c.execute("INSERT into Account values(?,?,?)", (username, password, "hello",))
    db.commit()
    c.close()
    return True

def add_to_group(username, group_id):
    c = db.cursor()
    try:
        c.execute("INSERT into UserAssociation values(?,?)", (username, group_id))
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

# ================ DELETING INFORMATION ================
# user1: Sender, user2: reciever
def delete_friend_request(user1,user2):
    c = db.cursor()
    c.execute("DELETE from FriendRequests WHERE (user1 = ? AND user2 = ?)", (user1, user2,))
    db.commit()
    c.close()
