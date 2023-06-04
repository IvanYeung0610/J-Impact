from flask import Flask, render_template, session, request, redirect, url_for, jsonify
from flask_socketio import SocketIO, send, emit, rooms
from db import *
from search import search_friends

app = Flask(__name__)
app.config['SECRET_KEY'] = "temp"
app.secret_key = "temp"
socketio = SocketIO(app)

connected_users = {}

@app.route("/", methods=["GET", "POST"])
def home_page():
    if(session.get("CLIENT", None) != None and get_user(session.get("CLIENT")) != None):
        groups = get_all_groups_from_user(session.get("CLIENT"))
        group_info = {}
        accounts = get_all_users()
        for group in groups:
            group_info[group] = ["name", "profile_picture"] #profile picture for groups
        return render_template("home.html", USER=session.get("CLIENT"), GROUPS=groups, GROUP_INFO=group_info, ACCOUNTS=accounts)
    return redirect( url_for("login_page") )

@app.route("/homeajax", methods=["POST"])
def home_ajax():
    current = request.form["messageText"]
    print(current)
    #first -1 is group id, second is time
    add_message(session.get("CLIENT"), -1, current, -1)
    if current:
        return jsonify(value=current, user=session.get("CLIENT"))
    return jsonify({"error" : "error"})

@app.route("/login", methods=["GET", "POST"])
def login_page():
    if ( request.method == "GET" ):
        return render_template("login.html")
    username = request.form.get("username")
    password = request.form.get("password")
    if(match_account_info(username,password)):
        session["CLIENT"] = username
        return redirect( url_for("home_page") )
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register_page():
    if ( request.method == "GET" ):
        return render_template("registration.html")
    username = request.form.get("username")
    password = request.form.get("password")
    if(add_user(username,password)):
        return redirect( url_for("login_page") )
    return render_template("registration.html") # FAILED, username exists

@app.route("/logout", methods=["GET"])
def logout():
    session.pop("CLIENT")
    return redirect( url_for("login_page") )

@app.route("/friends", methods=["GET"])
def friends_page():
    if(session.get("CLIENT", None) != None and get_user(session.get("CLIENT")) != None):
        return render_template("home.html", USER=session.get("CLIENT"))
    
    unsortedf_list = get_all_friends()
    f_list = []
    for pair in unsortedf_list:
        if pair[0] == session.get("CLIENT"):
            f_list.append([ pair[1], get_user(pair[1])[2] ])
        else:
            f_list.append([pair[0], get_user(pair[0])[2] ])
    return render_template("friends.html", FRIENDS=f_list)  # FRIENDS is a 2D array of friends [ [username, pfp],  . . . ]


# ========================== SOCKETS ==========================

# If the user logs in succesfully, they will be added to our connected users
@socketio.on('login')
def check_login():
    if session.get("CLIENT") in connected_users:
        connected_users[session.get("CLIENT")].append(request.sid)
    else:
        connected_users[session.get("CLIENT")] = [request.sid]
    #print("LOGIN: ", connected_users)

# Adds to our list of all conneceted users. IFF their cookies information is correct.
@socketio.on('connect')
def check_connect():
    if(session.get("CLIENT", None) == None or get_user(session.get("CLIENT")) == None ):
        raise ConnectionRefusedError('unauthorized!')
    else:
        if session.get("CLIENT") in connected_users:
            connected_users[session.get("CLIENT")].append(request.sid)
        else:
            connected_users[session.get("CLIENT")] = [request.sid]
    #print("CONNECTED: ", connected_users)

@socketio.on('disconnect')
def disconnect():
    connected_users[session.get("CLIENT")].remove(request.sid)
    #print("DISCONNECT: " + session.get("CLIENT"))

# RECIEVES - info: [message, group_id]
# EMITS - "message" OR "ping": message is when they have the group selcted, otherwise they will be pinged
@socketio.on('message')
def handle_message(info):
    message = info[0]
    group_id = info[1]
    users_recieving = get_all_users_by_group(group_id)
    
    #print('received message: ' + message)

# Sends the friend request to the proper sockets.
# RECIEVES - users: [sender, reciever]
@socketio.on('send_request')
def send_friend_request(users): 
    sender = users[0]
    reciever = users[1]
    add_friend_request(sender,reciever)

    recievers = connected_users[reciever]
    for R in recievers:
        emit('request_recieved', sender, to=R)

@socketio.on('accepted_request')
def accept_friend_request(users):
    sender = users[0]
    reciever = users[1]
    delete_friend_request(sender, reciever)
    add_friend(sender,reciever)

    senders = connected_users[sender]
    for S in senders:
        emit("request_accepted", reciever, to=S)

@socketio.on('rejected_request')
def reject_friend_request(users):
    sender = users[0]
    reciever = users[1]
    delete_friend_request(sender, reciever)

    senders = connected_users[sender]
    for S in senders:
        emit("request_rejected", reciever, to=S)

if __name__ == "__main__":
    app.debug = True
    socketio.run(app, allow_unsafe_werkzeug=True)
