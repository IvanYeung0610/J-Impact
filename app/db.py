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

def get_user(username):
    c = db.cursor()
    c.execute("select * from Account WHERE username = ?", (username,))
    user = c.fetchone()
    c.close()
    return user
print(get_user("apple"))