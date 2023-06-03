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

# RETURNS 
# def get_all_users(): 
#     c = db.cursor()
#     c.execute("select * from Account")
#     data = c.fetchall()
#     return [[data[0], data[1]] in data]
# print(get_all_users())
# ================ INSERTING INFORMATION ================

# ADDS NEW USER: iff the username does not already exist. 
# Returns True/False depending on the status of adding user. False means the username already exists.
def add_user(username, password): 
    if(get_user(username) != None):
        return False
    c = db.cursor()
    c.execute("insert into Account values(?,?,?)", (username, password, "hello",))
    db.commit()
    c.close()
    return True

def add_message(username, group_id, message, time):
    c = db.cursor()
    c.execute("insert into Messages values(?,?,?, ?)", (username, group_id, message, time,))
    db.commit()
    c.close()

# def friends():
