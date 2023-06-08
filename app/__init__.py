from flask import Flask, render_template, session, request, redirect, url_for, jsonify
from flask_socketio import SocketIO, send, emit, rooms, join_room, leave_room
from db import *
from search import *
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = "temp"
app.secret_key = "temp"
socketio = SocketIO(app)

connected_users = {}

#sample populate
populate()

@app.route("/", methods=["GET", "POST"])
def home_page():
    if(session.get("CLIENT", None) != None and get_user(session.get("CLIENT")) != None):
        groups = get_all_groups_from_user(session.get("CLIENT"))
        #print(groups)
        group_info = {}
        # accounts = get_all_users()
        for group in groups:
            if get_group_size(group) > 2: #Checks if it is a chat between two friends or a group
                group_info[group] = [get_group_title(group), get_group_image(group) , get_group_size(group), get_all_other_users_by_group(group, session.get("CLIENT"))]
            else:
                friend_username = get_all_other_users_by_group(group, session.get("CLIENT"))[0]
                group_info[group] = [friend_username, get_pfp(friend_username), get_group_size(group), get_all_other_users_by_group(group, session.get("CLIENT"))]
        return render_template("home.html", USER=session.get("CLIENT"), GROUPS=groups, GROUP_INFO=group_info)
    return redirect( url_for("login_page") )

@app.route("/homeajax", methods=["POST"])
def home_ajax():
    current = request.form.get("messageText")
    local_time = time.localtime()
    string_time = time.strftime("%c", local_time)
    if current:
        return jsonify(value=current, user=session.get("CLIENT"), time=string_time)
    return jsonify({"error" : "error"})

@app.route("/messagesajax", methods=["POST"])
def messages_ajax():
    id = request.form.get("group_id") #group id
    messages = get_messages_from_group(id)
    group = get_all_users_by_group(id)
    messageData = {"username": [], "message": [], "time": [], "group_id": [], "title": ""}
    if len(group) <= 2:
        if group[0] == session.get("CLIENT"):
            messageData["title"] = group[1]
        else:
            messageData["title"] = session.get("CLIENT")
    else:
        messageData["title"] = get_group_title(id)
    for data in messages:
        #print(data)
        messageData["username"].append(data[0])
        messageData["message"].append(data[2])
        messageData["time"].append(data[3])
    messageData["group_id"] = group
    if id: 
        return jsonify(messageData)
    return jsonify({"error": "error"})

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

@app.route("/friends", methods=["GET", "POST"])
def friends_page():
    if(session.get("CLIENT", None) != None and get_user(session.get("CLIENT")) != None):
        unsortedf_list = get_all_friends(session.get("CLIENT"))
        f_list = []
        for pair in unsortedf_list:
            # print(pair[1])
            # print(get_user(pair[1]))
            if pair[0] == session.get("CLIENT"):
                f_list.append([ pair[1], get_user(pair[1])[2] ])
            else:
                f_list.append([pair[0], get_user(pair[0])[2] ])
        return render_template("friends.html", FRIENDS=f_list, USER=session.get("CLIENT"))  # FRIENDS is a 2D array of friends [ [username, pfp],  . . . ]
    return render_template("home.html", USER=session.get("CLIENT"))
    
@app.route("/friend-request-ajax", methods=["POST"])
def friend_request_ajax():
    #username1 is sender, 2 is receiver
    fr = get_all_friend_requests(session.get("CLIENT"))
    #splits the requests into incoming and outgoing, but won't really matter for showing on browser
    requests = {"received": [], "sent": []}
    for req in fr:
        if req[0] == session.get("CLIENT"):
            requests["sent"].append(req)
        else:
            requests["received"].append(req)
    print(requests)
    if fr: 
        return jsonify(requests=requests)
    return jsonify({"error": "error"})

@app.route("/friend-list", methods=["POST"])
def friends_list_ajax():
    #usernames can be in any order
    fr = get_all_friends(session.get("CLIENT"))
    #splits the requests into incoming and outgoing, but won't really matter for showing on browser
    requests = {"friends": fr, "username": session.get("CLIENT")}
    if fr: 
        return jsonify(requests=requests)
    return jsonify({"error": "error"})

@app.route("/search-friends", methods=["POST"])
def search_friends_ajax():
    friends = search_friends(request.form["searchTerm"], session.get("CLIENT"))
    # print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    return jsonify(friends=friends)

@app.route("/search-friend-requests", methods=["POST"])
def search_friend_requests_ajax():
    freqs = search_friend_requests(request.form["searchTerm"], session.get("CLIENT"))
    print(freqs)
    return jsonify(freqs=freqs)

@app.route("/load-explore-ajax", methods=["POST"])
def explore_ajax():
    print(request.form["search"])
    randos = search_new_friends(request.form["search"], session.get("CLIENT"))
    return jsonify({"randos": randos})

@app.route("/explore-search-ajax", methods=["POST"])
def explore_search_ajax():
    randos = search_new_friends(request.form["search"], session.get("CLIENT"))
    return jsonify({"randos": randos})

@app.route("/settings")
def settings():
    return render_template("settings.html", USER=session.get("CLIENT"), about_me="about me goes here this is sample text to see how the about me section looks like when it is full of amazing text that describes the user. why are you still reading this")

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
    print("CONNECTED: ", connected_users)

@socketio.on('disconnect')
def disconnect():
    connected_users[session.get("CLIENT")].remove(request.sid)
    #print("DISCONNECT: " + session.get("CLIENT"))

# Changes the group that the user is in
@socketio.on('select_group')
def select_group(group_id):
    Current_rooms = rooms(request.sid)
    if len(Current_rooms) == 2:
        if Current_rooms[0] == request.sid:
            leave_room(Current_rooms[1])
        else:
            leave_room(Current_rooms[0])
        # print("  JOINED:  ", group_id)
        join_room(group_id)
    else:
        join_room(group_id)
        # print("  JOINED:  ", group_id)
    if type(group_id) is int:
        members = get_all_users_by_group(group_id)
        emit("clicked_group", members, to=request.sid)

# RECIEVES - info: message
# EMITS - "message" OR "ping": message is when they have the group selcted, otherwise they will be pinged
#           A ping will contain the group_id that the message was recieved in
@socketio.on('message')
def handle_message(message):
    user = session.get("CLIENT", " ")
    group_id = rooms(request.sid)[0]
    if rooms(request.sid)[0] == request.sid:
        group_id = rooms(request.sid)[1]
    local_time = time.localtime()
    string_time = time.strftime("%c", local_time)
    info = [user, message, string_time]
    
    add_message(user, group_id, message, string_time)
    emit("message", info, to=group_id)

    users_recieving = get_all_users_by_group(group_id)
    # print("USERS: ", users_recieving)
    for user in users_recieving:                        # LOOPS THRU ALL RECIVEING USERS
        for socket in connected_users.get(user, []):    # LOOPS THRU EACH SOCKET FOR A RECIEVING USER
            if not (group_id in rooms(socket)):         # IF THE SOCKET IS NOT LOOKING AT THE GROUP, PING THEM
                #print("HEI")
                emit("ping", group_id, to=socket)

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
