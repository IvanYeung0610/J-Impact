from flask import Flask, render_template, session, request, redirect, url_for, jsonify
from flask_socketio import SocketIO, send, emit
from db import *

app = Flask(__name__)
app.config['SECRET_KEY'] = "temp"
app.secret_key = "temp"
socketio = SocketIO(app)

connected_users = {}

@app.route("/", methods=["GET", "POST"])
def home_page():
    if(session.get("CLIENT", None) != None and get_user(session.get("CLIENT")) != None):
        return render_template("home.html", USER=session.get("CLIENT"))
    return redirect( url_for("login_page") )

@app.route("/homeajax", methods=["POST"])
def home_ajax():
    current = request.form["messageText"]
    print(current)
    add_message(session.get("CLIENT"), -1, current, -1)
    if current:
        return jsonify(value=current)
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

# Recieving message
@socketio.on('message')
def handle_message(message):
    emit("message", message, to=connected_users["a"][0])
    #print('received message: ' + message)

if __name__ == "__main__":
    app.debug = True
    socketio.run(app, allow_unsafe_werkzeug=True)
